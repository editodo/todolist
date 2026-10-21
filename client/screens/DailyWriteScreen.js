import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import { API_URL, apiFetch } from '../config';
import { STICKERS, STICKER_MAP } from '../components/stickers';
import { useAuth } from '../context/AuthContext';
import { t } from '../i18n';
import BackButton from '../components/BackButton';

const MAX = 5000;

const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Full-screen daily record (design: 하루기록 layout), opened from the 하루 기록 button
// on the to-do list and calendar. route.params.date = 'YYYY-MM-DD' (defaults to today).
export default function DailyWriteScreen({ navigation, route }) {
    const date = route.params?.date || todayStr();
    const { theme } = useTheme();
    const { user } = useAuth();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [content, setContent] = useState('');
    const [emotion, setEmotion] = useState('');
    const [saved, setSaved] = useState(null); // the stored record; null = nothing written yet
    const [editing, setEditing] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const sel = useRef(null); // last cursor position (native reports every move)
    const inputRef = useRef(null);
    const [forcedSel, setForcedSel] = useState(); // cursor set once after a toolbar insert

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch(`${API_URL}/api/diaries?date=${date}`);
                const diary = res.ok ? await res.json() : null;
                if (diary) {
                    setContent(diary.content || '');
                    setEmotion(diary.emotion || '');
                    setSaved({ content: diary.content || '', emotion: diary.emotion || '' });
                    setEditing(false);
                }
            } catch (e) {
                console.error('Load diary failed', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    // Toolbar: insert at the cursor, on a new line (append when the field was never focused)
    const insert = (text) => {
        // web: the browser does not report cursor moves while typing, so ask the textarea itself
        const webEnd = Platform.OS === 'web' ? inputRef.current?.selectionEnd : undefined;
        const at = webEnd ?? sel.current?.end ?? content.length;
        const before = content.slice(0, at);
        const piece = (before && !before.endsWith('\n') ? '\n' : '') + text;
        setContent((before + piece + content.slice(at)).slice(0, MAX));
        sel.current = { start: at + piece.length, end: at + piece.length };
        setForcedSel(sel.current);
    };
    const insertTime = () => {
        const d = new Date();
        insert(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} `);
    };
    const insertDone = async () => {
        try {
            const res = await apiFetch(`${API_URL}/api/todos/${user.id}?date=${date}`);
            const done = res.ok ? (await res.json()).filter((x) => x.is_completed) : [];
            if (!done.length) return Alert.alert(t('알림'), t('이 날 완료한 할 일이 없어요.'));
            insert(`${done.map((x) => `✓ ${x.text}`).join('\n')}\n`);
        } catch (e) {
            Alert.alert(t('오류'), t('할 일을 불러오지 못했어요.'));
        }
    };

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
            setSaved({ content, emotion });
            setEditing(false);
        } catch (e) {
            Alert.alert(t('오류'), t('저장하지 못했습니다: {msg}', { msg: e.message }));
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setContent(saved.content);
        setEmotion(saved.emotion);
        setEditing(false);
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

    const sticker = STICKER_MAP[saved?.emotion];

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.header}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={colors.main} />
                ) : !editing ? (
                    // View mode: the saved record, read-only, with 수정 / 삭제
                    <>
                        <ScrollView style={styles.body}>
                            <View style={styles.viewHead}>
                                {sticker && <Image source={sticker} style={styles.viewSticker} />}
                                <View>
                                    <Text style={styles.title}>{t('하루 기록')}</Text>
                                    <Text style={styles.dateText}>{date.replace(/-/g, '.')}</Text>
                                </View>
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.viewText} selectable>{saved.content}</Text>
                            </View>
                        </ScrollView>
                        <View style={[styles.footer, styles.row]}>
                            <Button title={t('삭제')} type="prev" onPress={handleDelete} style={styles.half} />
                            <Button title={t('기록 수정')} onPress={() => setEditing(true)} style={styles.half} />
                        </View>
                    </>
                ) : (
                    <>
                        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
                            <Text style={styles.title}>{t('오늘 하루를 기록해요')}</Text>
                            <Text style={styles.dateText}>{date.replace(/-/g, '.')}</Text>
                            <View style={styles.box}>
                                <View style={styles.toolbar}>
                                    <ToolBtn icon="list" label={t('목록')} onPress={() => insert('• ')} color={colors.subText} />
                                    <ToolBtn icon="checkbox-outline" label={t('오늘 한 일')} onPress={insertDone} color={colors.subText} />
                                    <ToolBtn icon="time-outline" label={t('시간')} onPress={insertTime} color={colors.subText} />
                                </View>
                                <TextInput
                                    ref={inputRef}
                                    style={styles.textarea}
                                    multiline
                                    value={content}
                                    onChangeText={setContent}
                                    selection={forcedSel}
                                    onSelectionChange={(e) => { sel.current = e.nativeEvent.selection; if (forcedSel) setForcedSel(undefined); }}
                                    placeholder={t('투두리스트는 잘 지켜졌는지, 기분은 어떤지 적어봐요.')}
                                    placeholderTextColor={colors.guideText}
                                    textAlignVertical="top"
                                    maxLength={MAX}
                                    accessibilityLabel={t('오늘 하루 기록')}
                                />
                                <Text style={styles.count}>{content.length} / {MAX}</Text>
                            </View>
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
                            <View style={styles.row}>
                                {saved && <Button title={t('취소')} type="prev" onPress={cancelEdit} style={styles.half} />}
                                <Button title={saving ? t('저장 중...') : t('기록 완료')} onPress={saving ? undefined : handleSave} style={styles.half} />
                            </View>
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function ToolBtn({ icon, label, onPress, color }) {
    return (
        <TouchableOpacity onPress={onPress} style={toolStyles.btn} accessibilityRole="button" accessibilityLabel={label}>
            <Ionicons name={icon} size={15} color={color} />
            <Text style={[toolStyles.text, { color }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const toolStyles = StyleSheet.create({
    btn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 8 },
    text: { fontSize: 12 },
});

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center', paddingHorizontal: 18 },
    header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    body: { flex: 1 },
    title: { marginTop: 10, fontSize: 18, fontWeight: '700', color: theme.colors.text, letterSpacing: -0.33 },
    dateText: { marginTop: 4, fontSize: 12, color: theme.colors.guideText },
    // The writing area is a tinted card so it reads as "type here"
    box: { marginTop: 14, marginBottom: 12, backgroundColor: theme.colors.base, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, padding: 14 },
    toolbar: { flexDirection: 'row', marginTop: -8, marginHorizontal: -8, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    textarea: { minHeight: 220, fontSize: 14, lineHeight: 22, color: theme.colors.text, padding: 0 },
    count: { marginTop: 6, fontSize: 11, color: theme.colors.guideText, textAlign: 'right' },
    viewHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    viewSticker: { width: 48, height: 48, marginTop: 10 },
    viewText: { fontSize: 14, lineHeight: 22, color: theme.colors.text, minHeight: 120 },
    row: { flexDirection: 'row', gap: 10 },
    half: { flex: 1 },
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
