import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, Modal, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getSettings, saveSettings, requestPermission, hasPermission, DEFAULT_SETTINGS } from '../notifications';
import { t } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

const TIMES = Array.from({ length: 48 }, (_, i) => ({ hour: Math.floor(i / 2), minute: (i % 2) * 30 }));
export const formatTime = ({ hour, minute }) =>
    `${hour < 12 ? t('오전') : t('오후')} ${hour % 12 === 0 ? 12 : hour % 12}:${String(minute).padStart(2, '0')}`;

const ROWS = [
    { key: 'morning', title: '아침 할 일 알림', desc: '오늘 남은 할 일 개수를 알려드려요. 다 끝낸 날은 울리지 않아요.' },
    { key: 'evening', title: '저녁 일기 알림', desc: '하루 기분을 남기도록 알려드려요. 일기를 쓴 날은 울리지 않아요.' },
];

export default function NotificationSettingsScreen({ navigation }) {
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
    const { user } = useAuth();
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [allowed, setAllowed] = useState(true);
    const [picking, setPicking] = useState(null); // 'morning' | 'evening' while the time list is open

    useEffect(() => {
        getSettings().then(setSettings);
        hasPermission().then(setAllowed);
    }, []);

    const update = async (key, patch) => {
        if (patch.enabled) {
            const ok = await requestPermission();
            setAllowed(ok);
            if (!ok) return;
        }
        const next = { ...settings, [key]: { ...settings[key], ...patch } };
        setSettings(next);
        await saveSettings(next, user);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={t('알림 설정')}
                leftButton={<BackButton onPress={() => navigation.goBack()} />}
            />
            <ScrollView style={styles.content}>
                {!allowed && (
                    <View style={styles.blocked}>
                        <Text style={styles.blockedText}>{t('휴대폰 설정에서 EdiTodo 알림이 꺼져 있어요. 알림을 받으려면 설정에서 켜주세요.')}</Text>
                        <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.blockedBtn}>
                            <Text style={styles.blockedBtnText}>{t('설정 열기')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {ROWS.map(({ key, title, desc }) => (
                    <View key={key} style={styles.row}>
                        <View style={styles.rowTop}>
                            <Text style={styles.title}>{t(title)}</Text>
                            <Switch
                                value={allowed && settings[key].enabled}
                                onValueChange={(enabled) => update(key, { enabled })}
                                trackColor={{ true: colors.main }}
                                accessibilityLabel={t(title)}
                            />
                        </View>
                        <Text style={styles.desc}>{t(desc)}</Text>
                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setPicking(key)}
                            disabled={!(allowed && settings[key].enabled)}
                        >
                            <Text style={[styles.timeText, !(allowed && settings[key].enabled) && styles.dim]}>{formatTime(settings[key])}</Text>
                            <Text style={styles.dim}>{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <Text style={styles.note}>{t('알림은 이 기기에만 적용돼요. 앱을 2주 넘게 열지 않으면 알림이 멈추고, 다시 열면 이어서 울려요.')}</Text>
            </ScrollView>

            <Modal visible={picking !== null} transparent animationType="slide" onRequestClose={() => setPicking(null)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPicking(null)}>
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>{t('알림 시간')}</Text>
                        <ScrollView style={{ maxHeight: 360 }}>
                            {TIMES.map((t) => {
                                const selected = picking && settings[picking].hour === t.hour && settings[picking].minute === t.minute;
                                return (
                                    <TouchableOpacity
                                        key={`${t.hour}:${t.minute}`}
                                        style={styles.option}
                                        onPress={() => { update(picking, t); setPicking(null); }}
                                    >
                                        <Text style={[styles.optionText, selected && styles.optionSelected]}>{formatTime(t)}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.body, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },
    back: { fontSize: 24, padding: 5, color: colors.text },
    content: { flex: 1, padding: 18 },
    blocked: { backgroundColor: '#fdf0ef', borderRadius: 5, padding: 14, marginBottom: 16 },
    blockedText: { fontSize: 13, color: '#c0392b', lineHeight: 19 },
    blockedBtn: { marginTop: 10, alignSelf: 'flex-start' },
    blockedBtnText: { fontSize: 13, fontWeight: 'bold', color: '#c0392b', textDecorationLine: 'underline' },
    row: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 15, fontWeight: 'bold', color: colors.text },
    desc: { fontSize: 12, color: colors.subText, marginTop: 4, lineHeight: 17 },
    timeBtn: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: colors.mypageColor, borderRadius: 5 },
    timeText: { fontSize: 14, color: colors.text },
    dim: { color: colors.fnb },
    note: { fontSize: 12, color: colors.subText, marginTop: 20, lineHeight: 18 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: colors.body, borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 18, paddingBottom: 30 },
    sheetTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
    option: { paddingVertical: 12 },
    optionText: { fontSize: 15, color: colors.text, textAlign: 'center' },
    optionSelected: { color: colors.main, fontWeight: 'bold' },
});
