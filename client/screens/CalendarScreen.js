import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { colors, layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import TodoItem from '../components/TodoItem'; // Reusing TodoItem
import DiaryModal from '../components/DiaryModal';
import Header from '../components/Header';

// Emoji Map for Icons
const EMOJI_MAP = {
    emoji_1: require('../assets/images/emoji/emoji_1.svg'),
    emoji_2: require('../assets/images/emoji/emoji_2.svg'),
    emoji_3: require('../assets/images/emoji/emoji_3.svg'),
    emoji_4: require('../assets/images/emoji/emoji_4.svg'),
    emoji_5: require('../assets/images/emoji/emoji_5.svg'),
    emoji_6: require('../assets/images/emoji/emoji_6.svg'),
    emoji_7: require('../assets/images/emoji/emoji_7.svg'),
    emoji_8: require('../assets/images/emoji/emoji_8.svg'),
    emoji_9: require('../assets/images/emoji/emoji_9.svg'),
    emoji_10: require('../assets/images/emoji/emoji_10.svg'),
    emoji_11: require('../assets/images/emoji/emoji_11.svg'),
    emoji_12: require('../assets/images/emoji/emoji_12.svg'),
    emoji_13: require('../assets/images/emoji/emoji_13.svg'),
    emoji_14: require('../assets/images/emoji/emoji_14.svg'),
    emoji_15: require('../assets/images/emoji/emoji_15.svg'),
    emoji_16: require('../assets/images/emoji/emoji_16.svg'),
};

// Mock Data for Calendar Status
// status: 'complete' | 'incomplete' | 'none'
// mood: '😀', '😐', '😭', etc. (If mood exists, it replaces the circle)
import { useAuth } from '../context/AuthContext';
import { useDate } from '../context/DateContext';
import { API_URL } from '../config';

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
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [isDiaryModalVisible, setIsDiaryModalVisible] = useState(false);
    const [diaryInitialData, setDiaryInitialData] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const calendarData = generateCalendar(year, month);

    // Fetch Month Data (Diaries)
    useEffect(() => {
        if (user) fetchMonthData();
    }, [user, year, month]);

    // Fetch Selected Date Todos
    useEffect(() => {
        if (user && selectedDate) fetchDateTodos();
    }, [user, selectedDate]);

    const fetchMonthData = async () => {
        try {
            const formattedMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
            const response = await fetch(`${API_URL}/api/diaries?user_id=${user.id}&month=${formattedMonth}`);
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
            const response = await fetch(`${API_URL}/api/todos/${user.id}?date=${selectedDate}`);
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
            await fetch(`${API_URL}/api/todos/${id}`, {
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

    const handleMore = () => {
        Alert.alert('알림', '수정 및 삭제는 투두리스트 메뉴에서만 가능합니다.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <Header title="캘린더" showMenu={true} />
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
                        <Text style={styles.arrowText}>◀</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{year}.{String(month + 1).padStart(2, '0')}</Text>
                    <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
                        <Text style={styles.arrowText}>▶</Text>
                    </TouchableOpacity>
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarBox}>
                    <View style={styles.weekRow}>
                        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                            <Text key={i} style={[styles.weekText, i === 0 && { color: '#FF6B6B' }, i === 6 && { color: '#4D96FF' }]}>{d}</Text>
                        ))}
                    </View>

                    {calendarData.map((week, wIndex) => (
                        <View key={wIndex} style={styles.weekRow}>
                            {week.map((day, dIndex) => {
                                const data = day ? monthData[day] : null;
                                const isSelected = day === parseInt(selectedDate.split('-')[2]);
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
                                                isSelected && { color: c.main, fontWeight: 'bold' }
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
                    <ScrollView contentContainerStyle={styles.todoList}>
                        {selectedDate ? (
                            selectedTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    id={todo.id}
                                    text={todo.text}
                                    isCompleted={todo.isCompleted}
                                    onToggle={handleToggle}
                                    onMore={handleMore} // Restricted action
                                    theme={theme}
                                />
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', color: c.guideText, marginTop: 20 }}>날짜를 선택해주세요.</Text>
                        )}
                    </ScrollView>

                    {/* Write/Read Diary FAB */}
                    {selectedDate && (
                        <TouchableOpacity
                            style={styles.fab}
                            onPress={() => {
                                const selectedDay = parseInt(selectedDate.split('-')[2]);
                                const diary = monthData[selectedDay];
                                setDiaryInitialData(diary ? { content: diary.content, emotion: diary.mood } : null);
                                setIsDiaryModalVisible(true);
                            }}
                        >
                            {/* Check if diary exists for the selected date */}
                            {monthData[parseInt(selectedDate.split('-')[2])] ? (
                                <Ionicons name="book" size={24} color="#fff" /> // Read Icon
                            ) : (
                                <Ionicons name="pencil" size={24} color="#fff" /> // Write Icon
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Diary Popup Modal */}
                <DiaryModal
                    visible={isDiaryModalVisible}
                    date={selectedDate}
                    onClose={() => setIsDiaryModalVisible(false)}
                    onSaved={fetchMonthData}
                    initialData={diaryInitialData}
                    userId={user?.id}
                    apiUrl={API_URL}
                />

            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center', paddingHorizontal: 18 },

    monthNav: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 10,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, color: theme.colors.text },
    arrowBtn: { padding: 10 },
    arrowText: { fontSize: 14, color: theme.colors.guideText },

    calendarBox: { marginBottom: 10 },
    weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    weekText: { width: 40, textAlign: 'center', fontSize: 14, color: theme.colors.guideText, fontWeight: '500' },

    dayCell: {
        width: 40, alignItems: 'center', justifyContent: 'flex-start', height: 60,
        borderRadius: 20, paddingVertical: 2
    },
    selectedDayCell: {
        backgroundColor: theme.colors.body,
        borderWidth: 1,
        borderColor: theme.colors.main,
    },
    dayText: { fontSize: 13, color: theme.colors.text, marginBottom: 1 },
    statusCircle: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    emojiText: { fontSize: 24 },
    emojiImage: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    selectedEmoji: {
        transform: [{ scale: 1.1 }]
    },

    bottomSheet: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    todoList: { paddingBottom: 100 },

    fab: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.main,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        zIndex: 999
    }
});
