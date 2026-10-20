// Crash/error reports from store builds only. DSN comes from eas.json (EXPO_PUBLIC_SENTRY_DSN); empty = off.
// sendDefaultPii: false keeps IPs, usernames and request bodies out of reports.
// The web build uses sentry.web.js instead, so the SDK isn't shipped to browsers.
import * as Sentry from '@sentry/react-native';

Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: !__DEV__ && Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
    sendDefaultPii: false,
    // Request URLs carry user ids and console logs may carry user text: keep both out of reports
    beforeBreadcrumb: (crumb) => (['console', 'fetch', 'xhr', 'http'].includes(crumb.category) ? null : crumb),
});

export const wrapApp = Sentry.wrap;
