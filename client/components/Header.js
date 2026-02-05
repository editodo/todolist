import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function Header({ title, leftButton, rightButton, showMenu }) {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { colors } = theme;

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {showMenu ? (
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                        <Ionicons name="menu" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                ) : (
                    leftButton
                )}
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
