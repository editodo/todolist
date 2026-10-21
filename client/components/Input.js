import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Text } from './AppText';
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
        height: 44, // design is 40; 44 keeps a comfortable touch target
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        paddingHorizontal: 16,
        fontSize: Platform.OS === 'web' ? 16 : 14, // design 14; web stays 16 so mobile Safari doesn't zoom
        color: colors.text,
        backgroundColor: colors.body,
    },
});
