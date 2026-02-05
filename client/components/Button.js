import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Button({ title, type = 'main', onPress, style }) {
    // type: 'main' | 'sub' | 'dark'
    const backgroundColor = type === 'main' ? colors.main :
        type === 'dark' ? colors.dark :
            colors.white;

    const textColor = type === 'main' || type === 'dark' ? colors.white : colors.main;
    const borderColor = type === 'main' ? colors.main :
        type === 'dark' ? colors.dark :
            colors.main;

    return (
        <TouchableOpacity
            style={[styles.btn, { backgroundColor, borderColor }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
        fontWeight: '600',
    }
});
