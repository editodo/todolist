import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// type: 'main' (teal) | 'sub' (teal outline) | 'dark' | 'prev' (light gray, the design's 이전 button)
const TYPES = {
    main: { bg: colors.main, border: colors.main, text: colors.white },
    sub: { bg: colors.white, border: colors.main, text: colors.main },
    dark: { bg: colors.dark, border: colors.dark, text: colors.white },
    prev: { bg: colors.lightGray, border: colors.lightGray, text: '#888888' },
};

export default function Button({ title, type = 'main', onPress, style, textStyle }) {
    const t = TYPES[type] || TYPES.main;
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
