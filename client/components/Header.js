import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Header({ title, leftButton, rightButton }) {
    const { theme } = useTheme();
    const { colors } = theme;

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {leftButton}
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.rightContainer}>
                {rightButton}
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.body,
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    leftContainer: {
        minWidth: 40,
        alignItems: 'flex-start',
    },
    rightContainer: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
    menuBtn: {
        padding: 4,
    }
});
