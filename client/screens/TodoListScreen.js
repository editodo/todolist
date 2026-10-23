
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from '../components/AppText';
import { colors as staticColors, layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../context/DateContext';
import TodoItem, { askRepeatDelete } from '../components/TodoItem';
import UndoToast, { useUndoDelete } from '../components/UndoToast';
import DatePicker from '../components/DatePicker';
import { useNetInfo } from '@react-native-community/netinfo';
import { API_URL, apiFetch } from '../config';
import { loadTodos, readTodos, saveTodos, send, todoOps, localToday } from '../todoStore';
import { t } from '../i18n';

const REPEATS = [null, 'daily', 'weekdays', 'weekly']; // tap the chip to cycle

export default function TodoListScreen({ navigation }) {
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = getStyles(theme);
    const { user } = useAuth(); // Get logged-in user
    const { selectedDate, setSelectedDate } = useDate(); // Global Date

    const [todos, setTodos] = useState([]);
    // ✕ removes at once; the server delete runs when the undo toast expires (failure → reload from server)
    const { pending: pendingDelete, remove: removeTodo, undo: undoDelete, flush: flushDelete } = useUndoDelete(setTodos, async (item) => {
        try {
            await send(user.id, todoOps.remove(item.id));
        } catch (e) {
            console.error('Delete failed', e);
            fetchTodos();
        }
    });
    const [isWriting, setIsWriting] = useState(false);
    const [newTodoText, setNewTodoText] = useState('');
    const draft = useRef(''); // latest text; read once per save so Enter + the blur that follows can't add it twice
    const [refreshing, setRefreshing] = useState(false);
    const [repeat, setRepeat] = useState(null);
    const inputRef = useRef(null);
    const [overdue, setOverdue] = useState(0); // 지난 날 못 한 일 (today only)
    const loadedFor = useRef(null); // the date `todos` belongs to, so a stale list is never saved under a new date
    const net = useNetInfo();

    // Date Logic
    // Local date (new Date('YYYY-MM-DD') is UTC and can land on the previous day)
    const [selY, selM, selD] = selectedDate.split('-').map(Number);
    const dateObj = new Date(selY, selM - 1, selD);
    const formattedDate = `${String(selM).padStart(2, '0')}.${String(selD).padStart(2, '0')}`;
    const weekMap = [t('일'), t('월'), t('화'), t('수'), t('목'), t('금'), t('토')];

    const dateRef = useRef(selectedDate); // the date on screen now, so a slow answer for an earlier date is dropped
    dateRef.current = selectedDate;

    // Show this phone's copy at once, then replace it with the server's (or keep it when offline, see todoStore)
    const fetchTodos = async () => {
        const date = selectedDate;
        try {
            if (loadedFor.current !== date) {
                const cached = await readTodos(user.id, date);
                if (dateRef.current !== date) return;
                loadedFor.current = date;
                setTodos(cached);
            }
            const { items, offline } = await loadTodos(user.id, date);
            if (dateRef.current !== date) return;
            setTodos(items);
            if (!offline && date === localToday()) fetchOverdue();
        } catch (e) {
            console.error(e);
        }
    };

    const fetchOverdue = async () => {
        try {
            const res = await apiFetch(`${API_URL}/api/todos/overdue?date=${selectedDate}`);
            setOverdue(res.ok ? (await res.json()).count : 0);
        } catch (e) {
            setOverdue(0);
        }
    };

    const carryOver = async () => {
        setOverdue(0);
        try {
            await apiFetch(`${API_URL}/api/todos/carry-over`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate }),
            });
        } finally {
            fetchTodos();
        }
    };

    // One load per visit: entering the tab, or a new date while on it (also after changes made in the calendar)
    useFocusEffect(useCallback(() => {
        if (user) fetchTodos();
    }, [user?.id, selectedDate]));

    // Keep the device copy matching the screen (it's what shows when offline)
    useEffect(() => {
        if (user && loadedFor.current === selectedDate) saveTodos(user.id, selectedDate, todos);
    }, [todos]);

    // Back online after being offline: send what was queued and reload (not on the first connection report)
    const wasOnline = useRef(null);
    useEffect(() => {
        if (wasOnline.current === false && net.isConnected && user) fetchTodos();
        wasOnline.current = net.isConnected;
    }, [net.isConnected]);

    // New date: commit a pending delete from the old one, clear the old date's banner
    useEffect(() => {
        flushDelete();
        setOverdue(0);
    }, [selectedDate]);

    // Handlers
    const handleToggle = async (id) => {
        // Optimistic UI Update
        const target = todos.find(t => t.id === id);
        if (!target) return;
        const newStatus = !target.isCompleted;

        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, isCompleted: newStatus } : todo
        ));

        try {
            await send(user.id, todoOps.update(id, { is_completed: newStatus }));
        } catch (e) {
            console.error('Update failed', e);
            setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, isCompleted: !newStatus } : todo)));
        }
    };

    const handleEdit = async (id, text) => {
        const before = todos.find(t => t.id === id)?.text;
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)));
        try {
            await send(user.id, todoOps.update(id, { text }));
        } catch (e) {
            console.error('Edit failed', e);
            setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: before } : t)));
        }
    };

    const handleDelete = (id) => {
        const item = todos.find(t => t.id === id);
        if (!item?.repeat) return removeTodo(todos, id);
        askRepeatDelete(() => removeTodo(todos, id), async () => {
            setTodos(prev => prev.filter(t => t.id !== id));
            try {
                await send(user.id, todoOps.remove(id, true));
            } catch (e) {
                console.error('Delete repeat failed', e);
                fetchTodos();
            }
        });
    };

    const repeatLabel = (r) => {
        if (r === 'daily') return t('매일');
        if (r === 'weekdays') return t('평일');
        if (r === 'weekly') return t('매주 {day}요일', { day: weekMap[dateObj.getDay()] });
        return t('반복 안 함');
    };
    const cycleRepeat = () => {
        setRepeat(r => REPEATS[(REPEATS.indexOf(r) + 1) % REPEATS.length]);
        inputRef.current?.focus(); // web: the chip took focus; keep typing
    };

    const handleAddStart = () => {
        setIsWriting(true);
    };

    const changeDraft = (text) => {
        draft.current = text;
        setNewTodoText(text);
    };

    // Saves on Enter and when the field loses focus (tapping elsewhere)
    const handleAddSubmit = async () => {
        const text = draft.current.trim();
        draft.current = '';
        if (!text) {
            setNewTodoText('');
            setIsWriting(false);
            return;
        }

        const tempId = Date.now();
        const optimisticTodo = {
            id: tempId,
            text,
            isCompleted: false,
            repeat,
        };

        setTodos(prev => [...prev, optimisticTodo]);
        setNewTodoText('');
        setIsWriting(false);
        setRepeat(null);

        try {
            const saved = await send(user.id, todoOps.create(tempId, text, selectedDate, repeat));
            // Offline: keeps the temporary id until the queue is sent and the list reloads
            if (saved?.id) setTodos(prev => prev.map(t => (t.id === tempId ? { ...t, id: saved.id } : t)));
        } catch (e) {
            console.error('Create failed', e);
            setTodos(prev => prev.filter(t => t.id !== tempId));
            Alert.alert(t('오류'), t('할 일을 저장하지 못했습니다.'));
        }
    };

    const [pickerOpen, setPickerOpen] = useState(false);

    const changeDate = (days) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        const nextDate = d.toISOString().split('T')[0];
        setSelectedDate(nextDate);
    };

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            {/* Design: ◀ 07.23(토) ▶ — tap the date to pick from a calendar */}
            <View style={styles.dateNav}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.arrowBtn} accessibilityLabel={t('이전 날')}><Text style={styles.arrow}>◀</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setPickerOpen(true)} accessibilityLabel={t('날짜 선택')}>
                    <Text style={styles.dateText}>{formattedDate}({weekMap[dateObj.getDay()]})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeDate(1)} style={styles.arrowBtn} accessibilityLabel={t('다음 날')}><Text style={styles.arrow}>▶</Text></TouchableOpacity>
            </View>

            <DatePicker
                visible={pickerOpen}
                value={selectedDate}
                onSelect={(d) => { setSelectedDate(d); setPickerOpen(false); }}
                onClose={() => setPickerOpen(false)}
            />

            <View style={styles.content}>
                <View style={styles.contentInner}>
                    {overdue > 0 && (
                        <TouchableOpacity style={styles.carryBar} onPress={carryOver} accessibilityRole="button">
                            <Text style={styles.carryText}>{t('지난 날 못 한 일 {n}개', { n: overdue })}</Text>
                            <Text style={styles.carryAction}>{t('오늘로 가져오기')}</Text>
                        </TouchableOpacity>
                    )}
                    <FlatList
                        automaticallyAdjustKeyboardInsets // iOS: keep the new-todo input above the keyboard
                        refreshing={refreshing}
                        onRefresh={async () => { setRefreshing(true); await fetchTodos(); setRefreshing(false); }}
                        keyboardShouldPersistTaps="handled"
                        data={todos}
                        contentContainerStyle={{ padding: 6, paddingBottom: 20 }}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TodoItem
                                id={item.id}
                                text={item.text}
                                isCompleted={item.isCompleted}
                                repeat={item.repeat}
                                onToggle={handleToggle}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                theme={theme}
                            />
                        )}
                        ListFooterComponent={
                            isWriting ? (
                                <View style={styles.writeRow}>
                                    <TextInput
                                        ref={inputRef}
                                        style={styles.input}
                                        value={newTodoText}
                                        onChangeText={changeDraft}
                                        placeholder={t('할 일을 입력하세요')}
                                        placeholderTextColor={theme.colors.dominant}
                                        autoFocus
                                        onSubmitEditing={handleAddSubmit}
                                        // web: focus moving to × (cancel) or the repeat chip isn't "done typing"
                                        onBlur={(e) => { if (!['todo-cancel', 'todo-repeat'].includes(e?.nativeEvent?.relatedTarget?.dataset?.testid)) handleAddSubmit(); }}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity testID="todo-repeat" onPress={cycleRepeat} style={[styles.repeatChip, repeat && styles.repeatChipOn]} accessibilityRole="button" accessibilityLabel={t('반복')}>
                                        <Text style={[styles.repeatChipText, repeat && styles.repeatChipTextOn]}>↻ {repeatLabel(repeat)}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity testID="todo-cancel" onPress={() => { changeDraft(''); setIsWriting(false); }} style={styles.cancelBtn} accessibilityLabel={t('입력 취소')}>
                                        <View style={styles.cancelIconCircle}>
                                            <Text style={styles.cancelIconText}>×</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                // Design: "+ 할 일 추가" pill inside the card, palette accent color
                                <TouchableOpacity style={styles.newTodoBtn} onPress={handleAddStart} accessibilityRole="button">
                                    <Text style={styles.newTodoText}>{t('+ 할 일 추가')}</Text>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>
            </View>

            {/* Design: 하루 기록 button opens the daily record for this date */}
            <TouchableOpacity
                style={styles.dailyBtn}
                onPress={() => navigation.navigate('DailyWrite', { date: selectedDate })}
                activeOpacity={0.85}
                accessibilityRole="button"
            >
                <Text style={styles.dailyBtnText}>{t('하루 기록')}</Text>
            </TouchableOpacity>

            <UndoToast visible={!!pendingDelete} message={t('할 일을 삭제했어요')} onUndo={undoDelete} />
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.body,
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center',
    },
    dateNav: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        backgroundColor: theme.colors.body,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
    },
    arrowBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }, // 44pt touch target
    arrow: {
        fontSize: 10,
        color: theme.colors.calendarColr,
    },
    content: {
        flex: 1,
        paddingHorizontal: 18,
    },
    // Design: paper card in the palette color with a soft shadow
    contentInner: {
        flex: 1,
        marginTop: 10,
        backgroundColor: theme.colors.base,
        borderRadius: theme.style.borderRadius,
        paddingVertical: 14,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    newTodoBtn: {
        alignSelf: 'center',
        marginTop: 14,
        height: 30,
        paddingHorizontal: 14,
        borderRadius: 15,
        justifyContent: 'center',
        backgroundColor: theme.colors.accent,
    },
    newTodoText: { fontSize: 13, color: theme.colors.base },
    dailyBtn: {
        height: 50,
        marginTop: 12,
        marginHorizontal: 18,
        marginBottom: 12,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
    },
    dailyBtnText: { fontSize: 16, fontWeight: '500', letterSpacing: -0.33, color: theme.colors.base },
    writeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginHorizontal: 15,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.dominant,
        backgroundColor: 'transparent',
        paddingHorizontal: 4,
    },
    input: {
        flex: 1,
        minWidth: 0, // web: let the field shrink so the repeat chip and × fit
        fontSize: 16,
        color: theme.colors.checkboxCol,
        marginRight: 10,
        height: 40,
    },
    cancelBtn: {
        padding: 5,
    },
    repeatChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.dominant,
        marginRight: 4,
    },
    repeatChipOn: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
    repeatChipText: { fontSize: 12, color: theme.colors.guideText },
    repeatChipTextOn: { color: theme.colors.base },
    carryBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: theme.colors.body,
    },
    carryText: { fontSize: 13, color: theme.colors.text },
    carryAction: { fontSize: 13, fontWeight: '600', color: theme.colors.accent },
    cancelIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8
    },
    cancelIconText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: -2
    },
});
