import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Text } from './AppText';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';

const pad = (n) => String(n).padStart(2, '0');
export const toDateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Popup date picker. Tap the title to switch to a year + month grid (like a native date picker).
// monthOnly: start on the month grid and return the 1st of the picked month.
export default function DatePicker({ visible, value, onSelect, onClose, monthOnly = false }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const styles = getStyles(theme);
    const [vy, vm, vd] = value.split('-').map(Number);
    const [year, setYear] = useState(vy);
    const [month, setMonth] = useState(vm - 1);
    const [picking, setPicking] = useState(monthOnly);

    // Reopen on the current value each time
    useEffect(() => {
        if (visible) { setYear(vy); setMonth(vm - 1); setPicking(monthOnly); }
    }, [visible]);

    const shift = (delta) => {
        if (picking) return setYear(year + delta);
        const d = new Date(year, month + delta, 1);
        setYear(d.getFullYear()); setMonth(d.getMonth());
    };

    const pickMonth = (m) => {
        if (monthOnly) return onSelect(toDateStr(year, m, 1));
        setMonth(m); setPicking(false);
    };

    const startDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells = [...Array(startDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);
    const now = new Date();
    const isToday = (d) => d && year === now.getFullYear() && month === now.getMonth() && d === now.getDate();
    const isValue = (d) => d && year === vy && month === vm - 1 && d === vd;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('닫기')}>
                <Pressable style={styles.card} onPress={() => {}}>
                    <View style={styles.head}>
                        <TouchableOpacity onPress={() => shift(-1)} style={styles.arrow} accessibilityLabel={t('이전')}>
                            <Text style={styles.arrowText}>◀</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPicking(!picking)} accessibilityRole="button" accessibilityLabel={t('연도·월 선택')}>
                            <Text style={styles.title}>{picking ? `${year}` : `${year}.${pad(month + 1)}`} ▾</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shift(1)} style={styles.arrow} accessibilityLabel={t('다음')}>
                            <Text style={styles.arrowText}>▶</Text>
                        </TouchableOpacity>
                    </View>

                    {picking ? (
                        <View style={styles.monthGrid}>
                            {Array.from({ length: 12 }, (_, m) => {
                                const active = year === vy && m === vm - 1;
                                return (
                                    <TouchableOpacity key={m} style={[styles.monthCell, active && { backgroundColor: c.main }]} onPress={() => pickMonth(m)}>
                                        <Text style={[styles.monthText, active && { color: '#fff', fontWeight: '700' }]}>{t('{n}월').replace('{n}', m + 1)}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : (
                        <>
                            <View style={styles.row}>
                                {[t('일'), t('월'), t('화'), t('수'), t('목'), t('금'), t('토')].map((d, i) => (
                                    <Text key={i} style={styles.week}>{d}</Text>
                                ))}
                            </View>
                            <View style={styles.dayGrid}>
                                {cells.map((d, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.dayCell, isValue(d) && { backgroundColor: c.main }]}
                                        disabled={!d}
                                        onPress={() => onSelect(toDateStr(year, month, d))}
                                    >
                                        {d && (
                                            <Text style={[styles.dayText, isToday(d) && { color: c.main, fontWeight: '700' }, isValue(d) && { color: '#fff', fontWeight: '700' }]}>{d}</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    <View style={styles.foot}>
                        <TouchableOpacity onPress={() => onSelect(toDateStr(now.getFullYear(), now.getMonth(), monthOnly ? 1 : now.getDate()))} style={styles.footBtn}>
                            <Text style={[styles.footText, { color: c.main }]}>{t('오늘')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.footBtn}>
                            <Text style={styles.footText}>{t('닫기')}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const getStyles = (theme) => StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', padding: 16 },
    card: { width: '100%', maxWidth: 340, backgroundColor: theme.colors.base, borderRadius: 14, padding: 14 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    arrow: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    arrowText: { fontSize: 10, color: theme.colors.calendarColr },
    title: { fontSize: 16, fontWeight: '700', color: theme.colors.text, paddingVertical: 10, paddingHorizontal: 8 },
    row: { flexDirection: 'row' },
    week: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, color: theme.colors.fnbText, paddingVertical: 6 },
    dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: `${100 / 7}%`, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 999 },
    dayText: { fontSize: 14, color: theme.colors.text },
    monthGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 6 },
    monthCell: { width: '25%', height: 52, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
    monthText: { fontSize: 15, color: theme.colors.text },
    foot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    footBtn: { paddingVertical: 10, paddingHorizontal: 12 },
    footText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
});
