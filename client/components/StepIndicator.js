import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function StepIndicator({ step }) {
    const { theme } = useTheme();
    const { colors } = theme;
    const steps = ['모드선택', '테마선택', '색상선택', '선택확인'];

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            {/* Background Line */}
            <View style={styles.lineBackground} />

            {/* Active Progress Line */}
            <View style={[styles.lineActive, { width: `${(step - 1) * 33.33}%` }]} />

            {/* Steps */}
            <View style={styles.stepWrapper}>
                {steps.map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === step;
                    const isCompleted = stepNum < step;

                    return (
                        <View key={index} style={styles.stepItem}>
                            <View style={[
                                styles.circle,
                                (isActive || isCompleted) && styles.circleActive,
                                isCompleted && styles.circleCompleted
                            ]}>
                                {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                            <Text style={[
                                styles.label,
                                (isActive || isCompleted) && styles.labelActive
                            ]}>
                                {label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        marginBottom: 40,
        marginTop: 10,
        position: 'relative',
        height: 60,
        justifyContent: 'flex-start',
    },
    lineBackground: {
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#D9D9D9',
        zIndex: 0,
    },
    lineActive: {
        position: 'absolute',
        top: 12,
        left: 0,
        height: 1,
        backgroundColor: theme.colors.main,
        zIndex: 1,
    },
    stepWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        top: 5, // Align with dot center
        zIndex: 2,
    },
    stepItem: {
        alignItems: 'center',
        width: 60,
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    circleActive: {
        backgroundColor: theme.colors.main,
    },
    circleCompleted: {
        backgroundColor: theme.colors.main,
    },
    checkMark: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 12,
        color: '#aaa',
        marginTop: -3,
    },
    labelActive: {
        color: theme.colors.text,
        fontWeight: 'bold',
    }
});
