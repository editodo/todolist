import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput } from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import { API_URL, apiFetch } from '../config';
import { STICKERS } from '../components/stickers';
import { t } from '../i18n';

const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Full-screen daily record (design: 하루기록 layout), opened from the 하루 기록 button
// on the to-do list and calendar. route.params.date = 'YYYY-MM-DD' (defaults to today).
export default function DailyWriteScreen({ navigation, route }) {
    const date = route.params?.date || todayStr();
    const { theme } = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [content, setContent] = useState('');
    const [emotion, setEmotion] = useState('');
    const [exists, setExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch(`${API_URL}/api/diaries?date=${date}`);
                const diary = res.ok ? await res.json() : null;
                if (diary) {
                    setContent(diary.content || '');
                    setEmotion(diary.emotion || '');
                    setExists(true);
                }
            } catch (e) {
                console.error('Load diary failed', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    const handleSave = async () => {
        if (!content.trim()) return Alert.alert(t('알림'), t('오늘의 이야기를 들려주세요!'));
        if (!emotion) return Alert.alert(t('알림'), t('오늘 하루 요약 스티커를 골라주세요!'));
        setSaving(true);
        try {
            const res = await apiFetch(`${API_URL}/api/diaries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, content, emotion }),
            });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || t('저장 실패'));
            navigation.goBack();
        } catch (e) {
            Alert.alert(t('오류'), t('저장하지 못했습니다: {msg}', { msg: e.message }));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(t('기록 삭제'), t('이 날의 기록을 지울까요?'), [
            { text: t('취소'), style: 'cancel' },
            {
                text: t('삭제'), style: 'destructive', onPress: async () => {
                    try {
                        const res = await apiFetch(`${API_URL}/api/diaries?date=${date}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error();
                        navigation.goBack();
                    } catch (e) {
                        Alert.alert(t('오류'), t('삭제하지 못했습니다.'));
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn} accessibilityLabel={t('뒤로')}>
                        <Ionicons name="arrow-back" size={22} color={colors.text} />
                    </TouchableOpacity>
                    {exists && (
                        <TouchableOpacity onPress={handleDelete} style={styles.headerBtn} accessibilityLabel={t('기록 삭제')}>
                            <Text style={styles.deleteText}>{t('삭제')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={colors.main} />
                ) : (
                    <>
                        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
                            <Text style={styles.title}>{t('오늘 하루를 기록해요')}</Text>
                            <Text style={styles.dateText}>{date.replace(/-/g, '.')}</Text>
                            <TextInput
                                style={styles.textarea}
                                multiline
                                value={content}
                                onChangeText={setContent}
                                placeholder={t('투두리스트는 잘 지켜졌는지, 기분은 어떤지 적어봐요.')}
                                placeholderTextColor={colors.guideText}
                                textAlignVertical="top"
                                maxLength={5000}
                                accessibilityLabel={t('오늘 하루 기록')}
                            />
                        </ScrollView>

                        <View style={styles.footer}>
                            <Text style={styles.stickerLabel}>{t('오늘 하루 요약 스티커')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stickerRow}>
                                {STICKERS.map((s) => {
                                    const selected = emotion === s.id;
                                    return (
                                        <TouchableOpacity
                                            key={s.id}
                                            onPress={() => setEmotion(s.id)}
                                            style={[styles.sticker, selected && styles.stickerSelected]}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected }}
                                        >
                                            <Image source={s.source} style={styles.stickerImage} />
                                            {selected && (
                                                <View style={styles.badge}>
                                                    <Ionicons name="checkmark" size={10} color="#fff" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            <Button title={saving ? t('저장 중...') : t('기록 완료')} onPress={saving ? undefined : handleSave} />
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center', paddingHorizontal: 18 },
    header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerBtn: { minWidth: 30, height: 30, justifyContent: 'center' },
    deleteText: { fontSize: 13, color: theme.colors.guideText, textDecorationLine: 'underline' },
    body: { flex: 1 },
    title: { marginTop: 10, fontSize: 18, fontWeight: '700', color: theme.colors.text, letterSpacing: -0.33 },
    dateText: { marginTop: 4, fontSize: 12, color: theme.colors.guideText },
    textarea: { marginTop: 14, minHeight: 220, fontSize: 14, lineHeight: 22, color: theme.colors.text, padding: 0 },
    footer: { paddingBottom: 20 },
    stickerLabel: { fontSize: 12, color: theme.colors.subText, marginBottom: 8 },
    stickerRow: { gap: 8, paddingVertical: 4, paddingRight: 4, marginBottom: 6 },
    sticker: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.border,
        alignItems: 'center', justifyContent: 'center',
    },
    stickerSelected: { borderWidth: 2, borderColor: theme.colors.text },
    stickerImage: { width: 32, height: 32 },
    badge: {
        position: 'absolute', top: -4, left: -4, width: 16, height: 16, borderRadius: 8,
        backgroundColor: theme.colors.text, alignItems: 'center', justifyContent: 'center',
    },
});
