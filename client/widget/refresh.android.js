import { requestWidgetUpdate } from 'react-native-android-widget';
import { TodayWidget } from './TodayWidget';
import { todayState } from './widgetTaskHandler';

// Redraw the home-screen widget from this phone's copy (no network); a no-op when none is placed
export function refreshWidget() {
    requestWidgetUpdate({
        widgetName: 'TodayTodos',
        renderWidget: async () => TodayWidget(await todayState({ fromServer: false })),
    }).catch(() => {});
}
