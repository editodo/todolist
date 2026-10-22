import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, apiFetch } from './config';

// To-dos that keep working offline:
// - every day's list is also kept on the device, so it opens without a connection
// - changes made offline wait in a queue and are sent in order once the server is reachable
// A server error (4xx/5xx) is a real failure and is thrown; only "couldn't reach the server" is queued.

export const localToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const queueKey = (userId) => `todoQueue:${userId}`;
const cacheKey = (userId, date) => `todos:${userId}:${date}`;

export const toItem = (row) => ({
    id: row.id,
    text: row.text,
    isCompleted: !!row.is_completed,
    repeat: row.repeat_rule || null, // 'daily' | 'weekdays' | 'weekly' | null
});

const readJson = async (key, fallback) => {
    try {
        const v = await AsyncStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch (e) {
        return fallback;
    }
};
const writeJson = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});

// op: { method, path, body?, tempId?, id? } — path may contain ":id", filled from op.id when sent
async function request(op) {
    const path = op.id !== undefined ? op.path.replace(':id', op.id) : op.path;
    const res = await apiFetch(`${API_URL}${path}`, {
        method: op.method,
        headers: op.body ? { 'Content-Type': 'application/json' } : undefined,
        body: op.body ? JSON.stringify(op.body) : undefined,
    });
    if (!res.ok) {
        const err = new Error(`server ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return res.json().catch(() => null);
}

let flushing = null;

// Sends queued changes in order. Stops at the first "offline" (kept for next time);
// a change the server rejects is dropped so it can't block everything after it.
export function flushQueue(userId) {
    if (!flushing) {
        flushing = (async () => {
            let queue = await readJson(queueKey(userId), []);
            while (queue.length) {
                const op = queue[0];
                try {
                    const result = await request(op);
                    queue = queue.slice(1);
                    // A to-do created offline now has its real id: point the later changes at it
                    if (op.tempId !== undefined && result?.id) {
                        queue = queue.map((q) => (q.id === op.tempId ? { ...q, id: result.id } : q));
                    }
                } catch (e) {
                    if (!e.status) break; // still offline
                    console.error('Dropped a queued to-do change', op.method, op.path, e.status);
                    queue = queue.slice(1);
                }
                await writeJson(queueKey(userId), queue);
            }
            return queue.length;
        })().finally(() => { flushing = null; });
    }
    return flushing;
}

// Runs a change now, or queues it when offline. Resolves the server's answer, or { queued: true }.
export async function send(userId, op) {
    const pending = await flushQueue(userId);
    if (pending === 0) {
        try {
            return await request(op);
        } catch (e) {
            if (e.status) throw e;
        }
    }
    const queue = await readJson(queueKey(userId), []);
    await writeJson(queueKey(userId), [...queue, op]);
    return { queued: true };
}

// One day's list: from the server when possible, otherwise the copy on this device.
// While changes are still waiting to be sent, the device copy is newer than the server, so it wins.
export async function loadTodos(userId, date) {
    const pending = await flushQueue(userId);
    if (pending === 0) {
        try {
            const rows = await request({ method: 'GET', path: `/api/todos/${userId}?date=${date}` });
            const items = rows.map(toItem);
            await writeJson(cacheKey(userId, date), items);
            return { items, offline: false };
        } catch (e) {
            if (e.status) throw e;
        }
    }
    return { items: await readJson(cacheKey(userId, date), []), offline: true };
}

export const readTodos = (userId, date) => readJson(cacheKey(userId, date), []);

// Keep the device copy in step with what the screen shows (including changes still queued);
// today's list also redraws the Android home-screen widget (required lazily: the widget code imports this file)
export const saveTodos = async (userId, date, items) => {
    await writeJson(cacheKey(userId, date), items);
    if (date === localToday()) require('./widget/refresh').refreshWidget();
};

export const todoOps = {
    create: (tempId, text, date, repeat) => ({ method: 'POST', path: '/api/todos', tempId, body: { text, target_date: date, ...(repeat ? { repeat } : {}) } }),
    update: (id, fields) => ({ method: 'PUT', path: '/api/todos/:id', id, body: fields }),
    remove: (id, series) => ({ method: 'DELETE', path: `/api/todos/:id${series ? '?scope=series' : ''}`, id }),
};
