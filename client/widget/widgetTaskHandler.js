import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../config';
import { loadTodos, readTodos, saveTodos, send, todoOps, localToday } from '../todoStore';
import { TodayWidget } from './TodayWidget';

// The widget runs without the app open: it reads the saved login (same key AuthContext writes)
// and uses the same to-do store, so offline changes go through the same queue as the app's.
async function savedUser() {
    try {
        const raw = await SecureStore.getItemAsync('user');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

// fromServer: false → only this phone's copy (used when the app itself just changed the list)
export async function todayState({ fromServer = true } = {}) {
    const user = await savedUser();
    if (!user?.token) return { status: 'signedOut' };
    setAuthToken(user.token);
    const date = localToday();
    let items;
    try {
        items = fromServer ? (await loadTodos(user.id, date)).items : await readTodos(user.id, date);
    } catch (e) {
        items = await readTodos(user.id, date);
    }
    return { status: 'ok', userId: user.id, date, items };
}

// Draw from this phone's copy first (no network wait), then catch up with the server.
export async function widgetTaskHandler({ widgetAction, clickAction, clickActionData, renderWidget }) {
    if (widgetAction === 'WIDGET_DELETED') return;
    const state = await todayState({ fromServer: false });

    if (widgetAction === 'WIDGET_CLICK' && clickAction === 'TOGGLE' && state.status === 'ok') {
        const item = state.items.find((i) => i.id === clickActionData?.id);
        if (!item) return renderWidget(TodayWidget(state));
        item.isCompleted = !item.isCompleted;
        renderWidget(TodayWidget(state)); // the tick shows at once
        await saveTodos(state.userId, state.date, state.items);
        try {
            await send(state.userId, todoOps.update(item.id, { is_completed: item.isCompleted }));
        } catch (e) {
            item.isCompleted = !item.isCompleted; // the server refused it: undo
            await saveTodos(state.userId, state.date, state.items);
            renderWidget(TodayWidget(state));
        }
        return;
    }

    renderWidget(TodayWidget(state));
    const fresh = await todayState(); // server (or the phone copy when offline)
    renderWidget(TodayWidget(fresh));
}
