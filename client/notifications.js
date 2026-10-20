// Local reminders (no server push): a morning to-do reminder and an evening diary reminder.
// Scheduled on the device as one-off notifications for the next DAYS_AHEAD days, so "today" can be
// skipped when the to-dos are done or the diary is written. Re-synced on app start, when the app goes
// to the background, and when settings change. Web uses notifications.web.js (no-op).
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { API_URL, apiFetch } from './config';

const SETTINGS_KEY = 'notificationSettings';
const DAYS_AHEAD = 14; // iOS keeps at most 64 pending; 2 per day x 14 = 28
const CHANNEL_ID = 'reminders';

export const DEFAULT_SETTINGS = {
    morning: { enabled: true, hour: 9, minute: 0 },
    evening: { enabled: false, hour: 21, minute: 0 },
};

export const isSupported = true;

Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function getSettings() {
    try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
}

export async function saveSettings(settings, user) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    await syncReminders(user);
}

// Android drops notifications whose channel doesn't exist, so create it before any scheduling
async function ensureChannel() {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: '할 일 알림',
        importance: Notifications.AndroidImportance.DEFAULT,
    });
}

// Shows the system permission dialog if it hasn't been answered yet. Returns true when allowed.
export async function requestPermission() {
    await ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
}

// True until the user has answered the system dialog once (onboarding offers reminders only then)
export async function permissionUndetermined() {
    return (await Notifications.getPermissionsAsync()).status === 'undetermined';
}

export async function hasPermission() {
    return (await Notifications.getPermissionsAsync()).granted;
}

export async function cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// What today looks like, so today's reminders can be personalised or skipped. null = unknown (offline).
async function fetchToday(user) {
    try {
        const today = ymd(new Date());
        const [todosRes, diaryRes] = await Promise.all([
            apiFetch(`${API_URL}/api/todos/${user.id}?date=${today}`),
            apiFetch(`${API_URL}/api/diaries?date=${today}`),
        ]);
        if (!todosRes.ok || !diaryRes.ok) return null;
        const todos = await todosRes.json();
        const diary = await diaryRes.json();
        return { total: todos.length, open: todos.filter((t) => !t.is_completed).length, diaryWritten: Boolean(diary) };
    } catch (e) {
        return null;
    }
}

function morningContent(today, isToday) {
    if (!isToday || !today) return { title: '좋은 아침이에요 ☀️', body: '오늘의 할 일을 확인해보세요 ✏️' };
    if (today.total === 0) return { title: '좋은 아침이에요 ☀️', body: '오늘 할 일을 적어볼까요?' };
    return { title: '좋은 아침이에요 ☀️', body: `오늘 할 일이 ${today.open}개 있어요. 하나씩 해볼까요? ✏️` };
}

// Pure schedule: [{ date, content }] for the next DAYS_AHEAD days. today = { total, open, diaryWritten } or null.
export function planReminders(settings, today, now) {
    const plan = [];
    for (let day = 0; day < DAYS_AHEAD; day++) {
        const isToday = day === 0;
        const at = (t) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, t.hour, t.minute);

        const allDoneToday = isToday && today && today.total > 0 && today.open === 0;
        if (settings.morning.enabled && !allDoneToday && at(settings.morning) > now) {
            plan.push({ date: at(settings.morning), content: { ...morningContent(today, isToday), data: { screen: 'Todolist' } } });
        }
        const diaryDoneToday = isToday && today?.diaryWritten;
        if (settings.evening.enabled && !diaryDoneToday && at(settings.evening) > now) {
            plan.push({ date: at(settings.evening), content: { title: '오늘 하루는 어땠나요?', body: '기분을 남겨보세요 🙂', data: { screen: 'Daily' } } });
        }
    }
    return plan;
}

// Replaces every pending reminder with a fresh schedule. Safe to call often.
export async function syncReminders(user) {
    try {
        await cancelAll();
        if (!user?.token || !(await hasPermission())) return;
        await ensureChannel();

        const settings = await getSettings();
        if (!settings.morning.enabled && !settings.evening.enabled) return;

        const plan = planReminders(settings, await fetchToday(user), new Date());
        for (const { date, content } of plan) {
            await Notifications.scheduleNotificationAsync({
                content,
                trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
            });
        }
    } catch (e) {
        console.warn('Reminder sync failed', e);
    }
}

// Calls onOpen(screen) when the user taps a reminder (including the one that launched the app).
export function onReminderTap(onOpen) {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen) onOpen(screen);
    });
    const last = Notifications.getLastNotificationResponse();
    const screen = last?.notification.request.content.data?.screen;
    if (screen) onOpen(screen);
    return () => sub.remove();
}
