import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { layout } from '../theme';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';

export default function Step01Screen({ navigation }) {
    const { mode, setMode, theme } = useTheme();

    const handleNext = () => {
        if (!mode) return;
        navigation.navigate('Step02');
    }

    const options = [
        { id: 'light', label: '라이트' },
        { id: 'dark', label: '다크' },
        { id: 'system', label: '시스템 모드' },
    ];

    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StepIndicator step={1} />

                <View style={styles.content}>
                    <Text style={styles.title}>내게 원하는{'\n'}모드를 설정해요.</Text>
                    <View style={styles.subtitleWrapper}>
                        <Text style={styles.subtitle}>
                            나중에 마이페이지에서 수정할 수 있어요.{'\n'}
                            아래 버튼을 눌러 적용해 보세요.
                        </Text>
                        <Image
                            source={theme.mode === 'dark' ? require('../assets/images/common/direction_down_white.svg') : require('../assets/images/common/direction_down.svg')}
                            style={styles.downArrow}
                        />
                    </View>

                    <View style={styles.optionsRow}>
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[
                                    styles.optionBtn,
                                    mode === opt.id && styles.optionBtnActive
                                ]}
                                onPress={() => setMode(opt.id)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    mode === opt.id && styles.optionTextActive
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.bottomBtnGroup}>
                    <Button
                        title="다음"
                        onPress={handleNext}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, padding: 18, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },

    content: { flex: 1, marginTop: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: theme.colors.text, lineHeight: 32 },
    subtitle: { fontSize: 13, color: theme.colors.guideText, lineHeight: 22 },
    subtitleWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 40,
    },
    downArrow: {
        width: 14,
        height: 14,
        marginLeft: 5,
        marginBottom: 4,
    },

    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8
    },
    optionBtn: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: theme.colors.body,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    optionBtnActive: {
        borderColor: theme.colors.main,
        borderWidth: 2,
    },
    optionText: {
        fontSize: 14,
        color: theme.colors.guideText
    },
    optionTextActive: {
        color: theme.colors.main,
        fontWeight: 'bold'
    },

    bottomBtnGroup: { marginBottom: 20 }
});
