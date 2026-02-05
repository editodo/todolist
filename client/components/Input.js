import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function Input({ value, onChangeText, placeholder, secureTextEntry, label }) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.guideText}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: colors.subText,
        marginBottom: 5,
    },
    input: {
        height: 48, // slightly taller for mobile touch
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        paddingHorizontal: 16,
        fontSize: 16, // prevent iOS zoom
        color: colors.text,
        backgroundColor: colors.body,
    },
});
