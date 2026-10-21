import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './AppText';
import { colors } from '../theme';
import { useTheme } from '../context/ThemeContext';

// type: 'main' (teal) | 'sub' (teal outline) | 'dark' | 'prev' (light gray, the design's 이전 button)
const types = (c) => ({
    main: { bg: c.main, border: c.main, text: c.white },
    sub: { bg: c.body, border: c.main, text: c.main },
    dark: { bg: c.dark, border: c.dark, text: c.white },
    prev: { bg: c.border, border: c.border, text: c.guideText },
});

export default function Button({ title, type = 'main', onPress, style, textStyle }) {
    const themeColors = useTheme()?.theme?.colors || { ...colors, body: colors.white, border: colors.lightGray, guideText: '#888888' };
    const t = types(themeColors)[type] || types(themeColors).main;
    const backgroundColor = t.bg;
    const borderColor = t.border;
    const textColor = t.text;

    return (
        <TouchableOpacity
            style={[styles.btn, { backgroundColor, borderColor }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginTop: 10,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: -0.33,
    }
});
