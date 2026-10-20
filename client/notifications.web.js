// Web build: browsers can't schedule these reminders (see notifications.js)
export const DEFAULT_SETTINGS = { morning: { enabled: false, hour: 9, minute: 0 }, evening: { enabled: false, hour: 21, minute: 0 } };
export const isSupported = false;
export const getSettings = async () => DEFAULT_SETTINGS;
export const saveSettings = async () => {};
export const requestPermission = async () => false;
export const hasPermission = async () => false;
export const permissionUndetermined = async () => false;
export const cancelAll = async () => {};
export const syncReminders = async () => {};
export const onReminderTap = () => () => {};
