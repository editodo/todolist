
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { Text, TextInput } from '../components/AppText';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors as staticColors, layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../context/DateContext';
import TodoItem from '../components/TodoItem';
import UndoToast, { useUndoDelete } from '../components/UndoToast';
import { API_URL, apiFetch } from '../config';
import { t } from '../i18n';

// Configure Calendar Locale (Korean)
LocaleConfig.locales['ko'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

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
            const response = await apiFetch(`${API_URL}/api/todos/${item.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('delete failed');
        } catch (e) {
            console.error('Delete failed', e);
            fetchTodos();
        }
    });
    const [isWriting, setIsWriting] = useState(false);
    const [newTodoText, setNewTodoText] = useState('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    // Date Logic
    // Local date (new Date('YYYY-MM-DD') is UTC and can land on the previous day)
    const [selY, selM, selD] = selectedDate.split('-').map(Number);
    const dateObj = new Date(selY, selM - 1, selD);
    const formattedDate = `${String(selM).padStart(2, '0')}.${String(selD).padStart(2, '0')}`;
    const weekMap = [t('일'), t('월'), t('화'), t('수'), t('목'), t('금'), t('토')];

    // Initial Fetch
    useEffect(() => {
        // Commit a pending delete first, or the old date's list could bring it back
        if (user) flushDelete().then(fetchTodos);
    }, [user, selectedDate]); // Refetch when date changes

    const fetchTodos = async () => {
        try {
            const response = await apiFetch(`${API_URL}/api/todos/${user.id}?date=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                // Map DB columns (if snake_case) to app state attributes
                const mappedData = data.map(item => ({
                    id: item.id,
                    text: item.text,
                    isCompleted: !!item.is_completed // 0 or 1 to boolean
                }));
                setTodos(mappedData);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Handlers
    const handleToggle = async (id) => {
        // Optimistic UI Update
        const target = todos.find(t => t.id === id);
        if (!target) return;
        const newStatus = !target.isCompleted;

        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, isCompleted: newStatus } : todo
        ));

        // API Call
        try {
            await apiFetch(`${API_URL}/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_completed: newStatus })
            });
        } catch (e) {
            console.error('Update failed', e);
            // Revert on failure if needed
        }
    };

    const handleEdit = async (id, text) => {
        const before = todos.find(t => t.id === id)?.text;
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)));
        try {
            const response = await apiFetch(`${API_URL}/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!response.ok) throw new Error('edit failed');
        } catch (e) {
            console.error('Edit failed', e);
            setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: before } : t)));
        }
    };

    const handleDelete = (id) => removeTodo(todos, id);

    const handleAddStart = () => {
        setIsWriting(true);
    };

    const handleAddSubmit = async () => {
        if (!newTodoText.trim()) {
            setIsWriting(false);
            return;
        }

        const tempId = Date.now();
        const optimisticTodo = {
            id: tempId,
            text: newTodoText,
            isCompleted: false
        };

        // UI Optimistic Update
        setTodos([...todos, optimisticTodo]);
        setNewTodoText('');
        setIsWriting(false);

        // API Call
        try {
            const response = await apiFetch(`${API_URL}/api/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    text: optimisticTodo.text,
                    target_date: selectedDate
                })
            });

            if (response.ok) {
                const savedTodo = await response.json();
                // Update temporary ID with real ID from DB
                setTodos(prev => prev.map(t =>
                    t.id === tempId ? { ...t, id: savedTodo.id } : t
                ));
            }
        } catch (e) {
            console.error('Create failed', e);
            Alert.alert(t('오류'), t('할 일을 저장하지 못했습니다.'));
        }
    };

    const changeDate = (days) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        const nextDate = d.toISOString().split('T')[0];
        setSelectedDate(nextDate);
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setIsCalendarVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Design: ◀ 07.23(토) ▶ — tap the date to pick from a calendar */}
            <View style={styles.dateNav}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.arrowBtn} accessibilityLabel={t('이전 날')}><Text style={styles.arrow}>◀</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setIsCalendarVisible(true)} accessibilityLabel={t('날짜 선택')}>
                    <Text style={styles.dateText}>{formattedDate}({weekMap[dateObj.getDay()]})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeDate(1)} style={styles.arrowBtn} accessibilityLabel={t('다음 날')}><Text style={styles.arrow}>▶</Text></TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.contentInner}>
                    <FlatList
                        data={todos}
                        contentContainerStyle={{ padding: 6, paddingBottom: 20 }}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TodoItem
                                id={item.id}
                                text={item.text}
                                isCompleted={item.isCompleted}
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
                                        style={styles.input}
                                        value={newTodoText}
                                        onChangeText={setNewTodoText}
                                        placeholder={t('할 일을 입력하세요')}
                                        placeholderTextColor={theme.colors.dominant}
                                        autoFocus
                                        onSubmitEditing={handleAddSubmit}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity onPress={() => setIsWriting(false)} style={styles.cancelBtn} accessibilityLabel={t('입력 취소')}>
                                        <View style={styles.cancelIconCircle}>
                                            <Text style={styles.cancelIconText}>×</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                // Design: "+ new todo" pill inside the card, palette accent color
                                <TouchableOpacity style={styles.newTodoBtn} onPress={handleAddStart} accessibilityRole="button">
                                    <Text style={styles.newTodoText}>+ new todo</Text>
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

            {/* Calendar Modal */}
            <Modal
                transparent={true}
                visible={isCalendarVisible}
                animationType="fade"
                onRequestClose={() => setIsCalendarVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsCalendarVisible(false)}
                >
                    <View style={styles.calendarContainer}>
                        <Calendar
                            current={selectedDate}
                            onDayPress={handleDayPress}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: colors.main }
                            }}
                            theme={{
                                backgroundColor: colors.base,
                                calendarBackground: colors.base,
                                textSectionTitleColor: colors.text,
                                selectedDayBackgroundColor: colors.main,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: colors.main,
                                dayTextColor: colors.text,
                                textDisabledColor: colors.guideText,
                                dotColor: colors.main,
                                selectedDotColor: '#ffffff',
                                arrowColor: colors.main,
                                monthTextColor: colors.text,
                                indicatorColor: colors.main,
                                textDayFontWeight: '300',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
    arrowBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    arrow: {
        fontSize: 10,
        color: theme.colors.calendarColr,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarContainer: {
        backgroundColor: theme.colors.base,
        borderRadius: 15,
        padding: 10,
        width: '90%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
        marginBottom: 70, // clears the 60px tab bar
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
        fontSize: 16,
        color: theme.colors.checkboxCol,
        marginRight: 10,
        height: 40,
    },
    cancelBtn: {
        padding: 5,
    },
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
