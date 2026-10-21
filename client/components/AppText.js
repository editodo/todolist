import React from 'react';
import { Text as RNText, TextInput as RNTextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// App-wide font: every screen imports Text/TextInput from here instead of react-native.
// Adds the current font (NotoSansKR or the font picked in 글꼴 변경) unless the style sets its own fontFamily
// (icons, etc.). Bold text uses the bold file on phones, because Android won't synthesize bold for custom fonts.
const BOLD = new Set(['bold', '600', '700', '800', '900']);

function withFont(font, style) {
    if (!font) return style;
    const flat = StyleSheet.flatten(style) || {};
    if (flat.fontFamily) return style;
    const bold = BOLD.has(String(flat.fontWeight));
    if (font.custom || Platform.OS === 'web') return [style, { fontFamily: bold ? font.bold : font.regular }];
    return [style, { fontFamily: bold ? font.bold : font.regular }, bold ? { fontWeight: 'normal' } : null];
}

// Big accessibility font sizes stay readable without breaking fixed-height rows (tab bar, buttons)
const MAX_FONT_SCALE = 1.3;

export function Text(props) {
    const font = useTheme()?.theme?.font;
    return <RNText maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} style={withFont(font, props.style)} />;
}

export function TextInput(props) {
    const font = useTheme()?.theme?.font;
    return <RNTextInput maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} style={withFont(font, props.style)} />;
}
