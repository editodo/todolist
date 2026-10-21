import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import * as Font from 'expo-font';
import { Text } from '../components/AppText';
import { layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../i18n';
import { API_URL } from '../config';

const SAMPLE = '더 많은 테마는 E-T에서 열심히 준비 중이에요\n123456789!@#$%&*()_+-=\nThe quick brown fox';

// Design: 글꼴 변경 (static font_modify) — preview box, font list, 적용하기.
// A catalog font is downloaded only when tapped for preview.
export default function FontSettingsScreen({ navigation }) {
    const { theme, fonts, fontId, setFontId } = useTheme();
    const t = useT();
    const styles = getStyles(theme);
    const [selected, setSelected] = useState(fontId);
    const [previewFamily, setPreviewFamily] = useState(null);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);

    const pick = async (id) => {
        setSelected(id);
        setFailed(false);
        if (id === null) return setPreviewFamily(null);
        const entry = fonts.find((f) => f.id === id);
        const family = `ET_font_${id}`;
        setLoading(true);
        try {
            const uri = entry.url.startsWith('/') ? `${API_URL}${entry.url}` : entry.url;
            await Font.loadAsync({ [family]: uri });
            setPreviewFamily(family);
        } catch (e) {
            setFailed(true);
            setPreviewFamily(null);
        } finally {
            setLoading(false);
        }
    };

    const baseFamily = Platform.OS === 'web' ? 'Noto Sans KR' : 'NotoSansKR_400Regular';
    const options = [{ id: null, name: t('기본 글씨체') }, ...fonts];

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={t('글꼴 변경')}
                leftButton={<TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel={t('뒤로')}><Text style={styles.back}>{'<'}</Text></TouchableOpacity>}
            />
            <View style={styles.body}>
                <View style={styles.preview}>
                    {loading ? (
                        <ActivityIndicator color={theme.colors.main} />
                    ) : (
                        <Text style={[styles.sample, { fontFamily: previewFamily || baseFamily }]}>{SAMPLE}</Text>
                    )}
                </View>
                {failed && <Text style={styles.error}>{t('글꼴을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')}</Text>}

                <ScrollView style={styles.list}>
                    {options.map((f) => {
                        const active = selected === f.id;
                        return (
                            <TouchableOpacity
                                key={String(f.id)}
                                style={styles.row}
                                onPress={() => pick(f.id)}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: active }}
                            >
                                <Text style={styles.rowText}>{f.name}</Text>
                                <View style={[styles.radio, active && styles.radioOn]}>
                                    {active && <View style={styles.radioDot} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <Button
                    title={t('적용하기')}
                    onPress={() => { if (!loading && !failed) { setFontId(selected); navigation.goBack(); } }}
                    style={{ marginBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.body, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },
    back: { fontSize: 24, padding: 5, color: theme.colors.text },
    body: { flex: 1, paddingHorizontal: 18 },
    preview: {
        marginTop: 20, height: 180, padding: 20, borderRadius: theme.style.borderRadius,
        backgroundColor: theme.colors.base, justifyContent: 'center', alignItems: 'center',
    },
    sample: { fontSize: 14, lineHeight: 22, color: theme.colors.text, textAlign: 'center' },
    error: { marginTop: 8, fontSize: 12, color: theme.colors.danger },
    list: { flex: 1, marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.colors.border },
    row: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rowText: { fontSize: 14, color: theme.colors.calendarColr, fontWeight: '500' },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.fnb, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    radioOn: { backgroundColor: theme.colors.main, borderColor: theme.colors.main },
    radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});
