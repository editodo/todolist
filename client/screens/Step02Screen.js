import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { layout } from '../theme';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';
import ThemePreview from '../components/ThemePreview';

export default function Step02Screen({ navigation }) {
    const { themeStyle, setThemeStyle, theme } = useTheme();

    const handleNext = () => {
        navigation.navigate('Step03');
    }

    const themes = [
        { id: 'simple', label: '심플' },
        { id: 'round', label: '라운드' },
        { id: 'skitch', label: '스케치' },
        { id: 'kitsch', label: '키치' },
    ];

    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StepIndicator step={2} />

                <View style={styles.content}>
                    <Text style={styles.title}>내 마음에 드는{'\n'}테마를 골라볼까요?</Text>
                    <Text style={styles.subtitle}>
                        나중에 마이페이지에서 수정할 수 있어요.{'\n'}
                        더 많은 테마는 Editodo에서 열심히 준비 중이에요!
                    </Text>

                    <View style={styles.optionsRow}>
                        {themes.map((t) => (
                            <TouchableOpacity
                                key={t.id}
                                style={[styles.optionBtn, themeStyle === t.id && styles.optionBtnActive]}
                                onPress={() => setThemeStyle(t.id)}
                            >
                                <Text style={[styles.optionText, themeStyle === t.id && styles.optionTextActive]}>
                                    {t.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Preview Area (Real) */}
                    <View style={styles.previewContainer}>
                        <Text style={styles.caption}>테마 미리보기</Text>
                        <ThemePreview theme={theme} />
                    </View>
                </View>

                <View style={styles.bottomBtnGroup}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Button
                            title="이전"
                            type="sub"
                            onPress={() => navigation.goBack()}
                            style={{ flex: 1, backgroundColor: '#EEEEEE', borderColor: '#EEE' }}
                            textStyle={{ color: '#888' }}
                        />
                        <Button
                            title="다음"
                            onPress={handleNext}
                            style={{ flex: 2 }}
                        />
                    </View>
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
    subtitle: { fontSize: 13, color: theme.colors.guideText, marginBottom: 20, lineHeight: 20 },

    optionsRow: { flexDirection: 'row', gap: 8, marginBottom: 30 },
    optionBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: theme.colors.body,
        borderWidth: 1, borderColor: theme.colors.border,
    },
    optionBtnActive: {
        borderColor: theme.colors.main, borderWidth: 2,
    },
    optionText: { fontSize: 13, color: theme.colors.guideText },
    optionTextActive: { color: theme.colors.main, fontWeight: 'bold' },

    previewContainer: { flex: 1 },
    caption: { fontSize: 12, color: theme.colors.subText, marginBottom: 5, fontWeight: '400' },

    bottomBtnGroup: { marginBottom: 20 }
});
