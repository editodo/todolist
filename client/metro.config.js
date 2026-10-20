// Sentry's Metro config adds debug IDs so crash reports point at the original source lines
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

module.exports = getSentryExpoConfig(__dirname);
