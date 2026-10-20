import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { layout } from '../theme';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';
import ThemePreview from '../components/ThemePreview';

// Step 1 of 3 (design: 테마선택). Mode (light/dark/system) sits here too, per the design note
// "white/black/system 모드 추가 - step1".
const MODES = [
    { id: 'light', label: '라이트' },
    { id: 'dark', label: '다크' },
    { id: 'system', label: '시스템' },
];
const THEMES = [
    { id: 'simple', label: '심플' },
    { id: 'round', label: '라운드' },
    { id: 'skitch', label: '스케치' },
    { id: 'kitsch', label: '키치' },
];

function Chips({ options, value, onChange, styles }) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {options.map((opt) => {
                const active = value === opt.id;
                return (
                    <TouchableOpacity
                        key={opt.id}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => onChange(opt.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                    >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

export default function Step01Screen({ navigation }) {
    const { mode, setMode, themeStyle, setThemeStyle, theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StepIndicator step={1} />

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>내 마음에 드는{'\n'}테마를 골라볼까요?</Text>
                    <Text style={styles.subtitle}>
                        나중에 마이페이지에서 수정할 수 있어요.{'\n'}
                        더 많은 테마는 E-T에서 열심히 준비 중이에요!
                    </Text>

                    <Text style={styles.caption}>화면 모드</Text>
                    <Chips options={MODES} value={mode} onChange={setMode} styles={styles} />

                    <Text style={styles.caption}>테마</Text>
                    <Chips options={THEMES} value={themeStyle} onChange={setThemeStyle} styles={styles} />

                    <Text style={styles.caption}>테마 미리보기</Text>
                    <ThemePreview theme={theme} />
                </ScrollView>

                <View style={styles.bottomBtnGroup}>
                    <Button title="다음" onPress={() => navigation.navigate('Step03')} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, padding: 18, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },
    content: { flex: 1 },
    title: { fontSize: 18, fontWeight: '700', color: theme.colors.text, lineHeight: 26, letterSpacing: -0.33 },
    subtitle: { fontSize: 12, color: theme.colors.subText, lineHeight: 18, marginTop: 10, marginBottom: 14 },
    caption: { fontSize: 12, color: theme.colors.subText, marginTop: 14, marginBottom: 6 },
    chipRow: { gap: 6, paddingRight: 4 },
    chip: {
        height: 30,
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.body,
    },
    chipActive: { borderColor: theme.colors.main },
    chipText: { fontSize: 12, color: theme.colors.guideText },
    chipTextActive: { color: theme.colors.main, fontWeight: '600' },
    bottomBtnGroup: { marginBottom: 20 },
});
