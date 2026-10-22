import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import App from './App';
import { widgetTaskHandler } from './widget/widgetTaskHandler';

registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler); // home-screen widget (Android only)
