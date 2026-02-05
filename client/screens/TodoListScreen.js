
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors as staticColors, layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../context/DateContext';
import TodoItem from '../components/TodoItem';
import Header from '../components/Header';
import { API_URL } from '../config';

export default function TodoListScreen({ navigation }) {
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = getStyles(theme);
    const { user } = useAuth(); // Get logged-in user
    const { selectedDate, setSelectedDate } = useDate(); // Global Date

    const [todos, setTodos] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [newTodoText, setNewTodoText] = useState('');

    // Date Logic
    const dateObj = new Date(selectedDate);
    const formattedDate = selectedDate.replace(/-/g, '.');
    const weekMap = ['일', '월', '화', '수', '목', '금', '토'];

    // Initial Fetch
    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user, selectedDate]); // Refetch when date changes

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/todos/${user.id}?date=${selectedDate}`);
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
            await fetch(`${API_URL}/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_completed: newStatus })
            });
        } catch (e) {
            console.error('Update failed', e);
            // Revert on failure if needed
        }
    };

    const handleMore = (id) => {
        Alert.alert('설정', '', [
            { text: '삭제', style: 'destructive', onPress: () => handleDelete(id) },
            { text: '취소', style: 'cancel' }
        ]);
    };

    const handleDelete = async (id) => {
        // Optimistic UI Update
        setTodos(prev => prev.filter(t => t.id !== id));

        try {
            await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error('Delete failed', e);
        }
    };

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
            const response = await fetch(`${API_URL}/api/todos`, {
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
            Alert.alert('오류', '할 일을 저장하지 못했습니다.');
        }
    };

    const changeDate = (days) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        const nextDate = d.toISOString().split('T')[0];
        setSelectedDate(nextDate);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="투두리스트" showMenu={true} />

            {/* Date Navigation Sub-Header */}
            <View style={styles.dateNav}>
                <TouchableOpacity onPress={() => changeDate(-1)}><Text style={styles.arrow}>◀</Text></TouchableOpacity>
                <Text style={styles.dateText}>{formattedDate} ({weekMap[isNaN(dateObj.getDay()) ? 0 : dateObj.getDay()]})</Text>
                <TouchableOpacity onPress={() => changeDate(1)}><Text style={styles.arrow}>▶</Text></TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.contentInner}>
                    <FlatList
                        data={todos}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TodoItem
                                id={item.id}
                                text={item.text}
                                isCompleted={item.isCompleted}
                                onToggle={handleToggle}
                                onMore={handleMore}
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
                                        placeholder="할 일을 입력하세요"
                                        placeholderTextColor={theme.colors.dominant}
                                        autoFocus
                                        onSubmitEditing={handleAddSubmit}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity onPress={() => setIsWriting(false)} style={styles.cancelBtn}>
                                        <View style={styles.cancelIconCircle}>
                                            <Text style={styles.cancelIconText}>×</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : null
                        }
                    />
                </View>
            </View>

            {/* Floating Action Button (FAB) (Always visible) */}
            {!isWriting && (
                <TouchableOpacity style={styles.fab} onPress={handleAddStart}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: theme.colors.body,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: theme.colors.text,
    },
    arrow: {
        fontSize: 14,
        color: theme.colors.guideText,
        padding: 10
    },

    content: {
        flex: 1,
        paddingHorizontal: 18,
    },
    contentInner: {
        flex: 1,
        backgroundColor: theme.colors.base,
        borderRadius: theme.style.borderRadius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 70,
    },
    writeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginHorizontal: 15,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.dominant,
        backgroundColor: theme.colors.body,
        borderRadius: 8,
        paddingHorizontal: 10,
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
    },
    fabText: {
        fontSize: 32,
        color: '#fff',
        marginTop: -4
    }
});
