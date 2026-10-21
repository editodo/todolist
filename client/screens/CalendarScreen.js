import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import { colors, layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import TodoItem from '../components/TodoItem'; // Reusing TodoItem
import UndoToast, { useUndoDelete } from '../components/UndoToast';
import { STICKER_MAP } from '../components/stickers';
import DatePicker from '../components/DatePicker';

const EMOJI_MAP = STICKER_MAP;

// Mock Data for Calendar Status
// status: 'complete' | 'incomplete' | 'none'
// mood: '😀', '😐', '😭', etc. (If mood exists, it replaces the circle)
import { useAuth } from '../context/AuthContext';
import { useDate } from '../context/DateContext';
import { API_URL, apiFetch } from '../config';
import { t } from '../i18n';

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar = [];
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) week.push(null);
            else if (dayCounter > daysInMonth) week.push(null);
            else {
                week.push(dayCounter);
                dayCounter++;
            }
        }
        calendar.push(week);
        if (dayCounter > daysInMonth) break;
    }
    return calendar;
}

export default function CalendarScreen({ navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { selectedDate, setSelectedDate } = useDate();

    const c = theme.colors;
    const styles = getStyles(theme);

    const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
    const [monthData, setMonthData] = useState({});
    const [pickerOpen, setPickerOpen] = useState(false);
    const [selectedTodos, setSelectedTodos] = useState([]);
    // Same delete-with-undo as the to-do tab
    const { pending: pendingDelete, remove: removeTodo, undo: undoDelete, flush: flushDelete } = useUndoDelete(setSelectedTodos, async (item) => {
        try {
            const response = await apiFetch(`${API_URL}/api/todos/${item.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('delete failed');
        } catch (e) {
            console.error('Delete failed', e);
            fetchDateTodos();
        }
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const calendarData = generateCalendar(year, month);

    // Fetch Month Data (Diaries)
    useEffect(() => {
        if (user) fetchMonthData();
    }, [user, year, month]);

    // Coming back from the 하루 기록 screen: show the new/removed sticker
    useFocusEffect(useCallback(() => {
        if (user) fetchMonthData();
    }, [user, year, month]));

    // Fetch Selected Date Todos
    useEffect(() => {
        if (user && selectedDate) flushDelete().then(fetchDateTodos);
    }, [user, selectedDate]);

    const fetchMonthData = async () => {
        try {
            const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
            const response = await apiFetch(`${API_URL}/api/diaries?user_id=${user.id}&month=${formattedMonth}`);
            if (response.ok) {
                const data = await response.json();
                // Convert array to object map: { '2024-02-01': { emotion: 'XXX', content: '...' } }
                const map = {};
                data.forEach(item => {
                    const day = parseInt(item.date.split('-')[2]); // Safe parsing for formatted string
                    map[day] = {
                        mood: item.emotion || '✅',
                        content: item.content
                    };
                });
                setMonthData(map);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchDateTodos = async () => {
        try {
            const response = await apiFetch(`${API_URL}/api/todos/${user.id}?date=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedTodos(data.map(item => ({
                    id: item.id,
                    text: item.text,
                    isCompleted: !!item.is_completed
                })));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleDateClick = (day) => {
        if (day) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setSelectedDate(dateStr);
        }
    };




    const handleToggle = async (id) => {
        // Optimistic UI Update
        const target = selectedTodos.find(t => t.id === id);
        if (!target) return;
        const newStatus = !target.isCompleted;

        setSelectedTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, isCompleted: newStatus } : todo
        ));

        // API Call to persist completion status
        try {
            await apiFetch(`${API_URL}/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_completed: newStatus })
            });
        } catch (e) {
            console.error('Update failed', e);
            // Revert on failure if needed
            setSelectedTodos(prev => prev.map(todo =>
                todo.id === id ? { ...todo, isCompleted: !newStatus } : todo
            ));
        }
    };

    const handleEdit = async (id, text) => {
        const before = selectedTodos.find(t => t.id === id)?.text;
        setSelectedTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)));
        try {
            const response = await apiFetch(`${API_URL}/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!response.ok) throw new Error('edit failed');
        } catch (e) {
            console.error('Edit failed', e);
            setSelectedTodos(prev => prev.map(t => (t.id === id ? { ...t, text: before } : t)));
        }
    };

    const handleDelete = (id) => removeTodo(selectedTodos, id);

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
                        <Text style={styles.arrowText}>◀</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPickerOpen(true)} accessibilityRole="button" accessibilityLabel={t('연도·월 선택')}>
                        <Text style={styles.headerTitle}>{year}.{String(month + 1).padStart(2, '0')} ▾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
                        <Text style={styles.arrowText}>▶</Text>
                    </TouchableOpacity>
                </View>

                <DatePicker
                    monthOnly
                    visible={pickerOpen}
                    value={`${year}-${String(month + 1).padStart(2, '0')}-01`}
                    onSelect={(d) => { const [y, m] = d.split('-').map(Number); setCurrentDate(new Date(y, m - 1, 1)); setPickerOpen(false); }}
                    onClose={() => setPickerOpen(false)}
                />

                {/* Calendar Grid */}
                <View style={styles.calendarBox}>
                    <View style={styles.weekRow}>
                        {[t('일'), t('월'), t('화'), t('수'), t('목'), t('금'), t('토')].map((d, i) => (
                            <Text key={i} style={styles.weekText}>{d}</Text>
                        ))}
                    </View>

                    {calendarData.map((week, wIndex) => (
                        <View key={wIndex} style={styles.weekRow}>
                            {week.map((day, dIndex) => {
                                const data = day ? monthData[day] : null;
                                const isSelected = !!day && selectedDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const hasMood = data && data.mood;

                                return (
                                    <TouchableOpacity
                                        key={dIndex}
                                        style={[
                                            styles.dayCell,
                                            isSelected && styles.selectedDayCell
                                        ]}
                                        onPress={() => handleDateClick(day)}
                                        disabled={!day}
                                    >
                                        {/* Day Number */}
                                        {day && (
                                            <Text style={[
                                                styles.dayText,
                                                isSelected && { color: theme.colors.main, fontWeight: '700' }
                                            ]}>
                                                {day}
                                            </Text>
                                        )}

                                        {/* Status Indicator */}
                                        {day && (
                                            <View style={[
                                                styles.statusCircle,
                                                hasMood ? { backgroundColor: 'transparent' } : { backgroundColor: theme.colors.border }
                                            ]}>
                                                {hasMood && (
                                                    EMOJI_MAP[data.mood] ? (
                                                        <Image
                                                            source={EMOJI_MAP[data.mood]}
                                                            style={[
                                                                styles.emojiImage,
                                                                isSelected && styles.selectedEmoji
                                                            ]}
                                                        />
                                                    ) : (
                                                        <Text style={[
                                                            styles.emojiText,
                                                            isSelected && styles.selectedEmoji
                                                        ]}>
                                                            {data.mood}
                                                        </Text>
                                                    )
                                                )}
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Bottom Sheet - Selected Day Todos */}
                <View style={[styles.bottomSheet, { backgroundColor: c.base }]}>
                    <ScrollView contentContainerStyle={styles.todoList} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
                        {selectedDate ? (
                            selectedTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    id={todo.id}
                                    text={todo.text}
                                    isCompleted={todo.isCompleted}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    theme={theme}
                                />
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', color: c.guideText, marginTop: 20 }}>{t('날짜를 선택해주세요.')}</Text>
                        )}
                    </ScrollView>

                </View>

                {/* Design: 하루 기록 button under the day's list (palette accent color) */}
                <TouchableOpacity
                    style={[styles.dailyBtn, { backgroundColor: c.accent }]}
                    onPress={() => navigation.navigate('DailyWrite', { date: selectedDate })}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                >
                    <Text style={[styles.dailyBtnText, { color: c.base }]}>{selectedDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && monthData[parseInt(selectedDate.split('-')[2])] ? t('기록 보기') : t('하루 기록')}</Text>
                </TouchableOpacity>
            </View>
            <UndoToast visible={!!pendingDelete} message={t('할 일을 삭제했어요')} onUndo={undoDelete} />
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center', paddingHorizontal: 18, paddingBottom: 12 },

    // Design: ◀ 2022.07 ▶ month header (50 high, 15 bold)
    monthNav: { height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
    arrowBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }, // 44pt touch target
    arrowText: { fontSize: 10, color: theme.colors.calendarColr },

    calendarBox: { marginBottom: 10 },
    weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    weekText: { width: 40, textAlign: 'center', fontSize: 14, color: theme.colors.fnbText, fontWeight: '600', paddingVertical: 8 },

    // Selected day: rounded pill outline (pre-redesign style), tall enough to clear the sticker
    dayCell: { width: 40, height: 52, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 6, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
    selectedDayCell: { borderColor: theme.colors.main },
    dayText: { fontSize: 13, fontWeight: '500', color: theme.colors.text, marginBottom: 3 },
    statusCircle: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    emojiText: { fontSize: 16 },
    emojiImage: { width: 20, height: 20, borderRadius: 10 },
    selectedEmoji: {},

    // Design: the day's to-dos in a paper card (palette base, soft shadow)
    bottomSheet: {
        flex: 1,
        marginTop: 6,
        borderRadius: theme.themeName === 'round' ? 16 : 0,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    todoList: { paddingBottom: 10 },

    dailyBtn: { height: 50, borderRadius: 6, marginTop: 12, justifyContent: 'center', alignItems: 'center' },
    dailyBtnText: { fontSize: 16, fontWeight: '500', letterSpacing: -0.33 },
});
