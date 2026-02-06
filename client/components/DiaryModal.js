import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
    ActivityIndicator, Alert, ScrollView, Image, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function DiaryModal({ visible, date, onClose, onSaved, initialData, userId, apiUrl }) {
    const { theme } = useTheme();
    const { colors } = theme;
    const [content, setContent] = useState('');
    const [emotion, setEmotion] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // New: Completed Todos
    const [completedTodos, setCompletedTodos] = useState([]);

    const textInputRef = useRef(null);
    const scrollRef = useRef(null);

    // Emoji List (Custom icons)
    const emojiItems = [
        { id: 'emoji_1', source: require('../assets/images/emoji/emoji_1.svg') },
        { id: 'emoji_2', source: require('../assets/images/emoji/emoji_2.svg') },
        { id: 'emoji_3', source: require('../assets/images/emoji/emoji_3.svg') },
        { id: 'emoji_4', source: require('../assets/images/emoji/emoji_4.svg') },
        { id: 'emoji_5', source: require('../assets/images/emoji/emoji_5.svg') },
        { id: 'emoji_6', source: require('../assets/images/emoji/emoji_6.svg') },
        { id: 'emoji_7', source: require('../assets/images/emoji/emoji_7.svg') },
        { id: 'emoji_8', source: require('../assets/images/emoji/emoji_8.svg') },
        { id: 'emoji_9', source: require('../assets/images/emoji/emoji_9.svg') },
        { id: 'emoji_10', source: require('../assets/images/emoji/emoji_10.svg') },
        { id: 'emoji_11', source: require('../assets/images/emoji/emoji_11.svg') },
        { id: 'emoji_12', source: require('../assets/images/emoji/emoji_12.svg') },
        { id: 'emoji_13', source: require('../assets/images/emoji/emoji_13.svg') },
        { id: 'emoji_14', source: require('../assets/images/emoji/emoji_14.svg') },
        { id: 'emoji_15', source: require('../assets/images/emoji/emoji_15.svg') },
        { id: 'emoji_16', source: require('../assets/images/emoji/emoji_16.svg') },
    ];

    useEffect(() => {
        if (visible) {
            setContent(initialData?.content || '');
            setEmotion(initialData?.emotion || '');

            // Fetch Todos if userId and date exist
            if (userId && date) {
                fetchCompletedTodos();
            } else {
                setCompletedTodos([]);
            }
        }
    }, [visible, initialData, date, userId]);

    const fetchCompletedTodos = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/todos/${userId}?date=${date}`);
            if (response.ok) {
                const todos = await response.json();
                const done = todos.filter(t => t.is_completed);
                setCompletedTodos(done);
            }
        } catch (e) {
            console.error('Failed to fetch todos:', e);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) return Alert.alert('알림', '오늘의 이야기를 들려주세요!');
        if (!emotion) return Alert.alert('알림', '기분을 선택해주세요!');

        setIsSaving(true);
        try {
            const response = await fetch(`${apiUrl}/api/diaries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    date: date,
                    content,
                    emotion: emotion
                })
            });

            const result = await response.json();
            if (response.ok) {
                onSaved();
                onClose();
            } else {
                throw new Error(result.error || 'Save failed');
            }
        } catch (e) {
            console.error('Save Diary Error:', e);
            Alert.alert('오류', `저장에 실패했습니다: ${e.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert('삭제 확인', '정말 이 기록을 지울까요?', [
            { text: '취소', style: 'cancel' },
            {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                    setIsDeleting(true);
                    try {
                        const response = await fetch(`${apiUrl}/api/diaries?user_id=${userId}&date=${date}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            onSaved();
                            onClose();
                        }
                    } catch (e) {
                        console.error('Delete Diary Error:', e);
                        Alert.alert('오류', '삭제에 실패했습니다.');
                    } finally {
                        setIsDeleting(false);
                    }
                }
            }
        ]);
    };


    // Web-specific drag-to-scroll logic
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e) => {
        if (Platform.OS !== 'web') return;
        isDragging.current = true;
        startX.current = e.pageX;
        scrollLeft.current = scrollRef.current?.getScrollableNode().scrollLeft || 0;
    };

    const onMouseMove = (e) => {
        if (!isDragging.current || Platform.OS !== 'web') return;
        const x = e.pageX;
        const walk = (x - startX.current) * 1.5; // Scroll speed
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: scrollLeft.current - walk, animated: false });
        }
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    const styles = getStyles(theme);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Background Dim - Close on Click */}
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => {
                        Keyboard.dismiss();
                        onClose();
                    }}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.card}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.dateText}>{date}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={colors.guideText} />
                            </TouchableOpacity>
                        </View>

                        {/* Emoji Section */}
                        <View style={styles.emojiSection}>
                            <Text style={styles.emojiLabel}>오늘 하루 요약 스티커</Text>
                            <View
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseUp}
                                style={{ cursor: Platform.OS === 'web' ? 'grab' : 'auto' }}
                            >
                                <ScrollView
                                    ref={scrollRef}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.emojiScrollContent}
                                    scrollEventThrottle={16}
                                >
                                    {emojiItems.map((item) => {
                                        const isSelected = emotion === item.id;
                                        return (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[styles.emojiItem, isSelected && styles.emojiItemSelected]}
                                                onPress={() => setEmotion(item.id)}
                                                activeOpacity={0.7}
                                            >
                                                <Image source={item.source} style={styles.emojiImage} />
                                                {isSelected && (
                                                    <View style={styles.badgeContainer}>
                                                        <View style={styles.badgeCircle}>
                                                            <Ionicons name="checkmark" size={12} color="#fff" />
                                                        </View>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </View>

                        {/* Text Input */}
                        <TextInput
                            ref={textInputRef}
                            style={styles.input}
                            multiline
                            placeholder="오늘의 이야기를 들려주세요 (내용)"
                            value={content}
                            onChangeText={setContent}
                            placeholderTextColor={colors.guideText}
                        />

                        {/* Completed Todos Section - NEW */}
                        {completedTodos.length > 0 && (
                            <View style={styles.todosSection}>
                                <Text style={styles.todosLabel}>오늘 완료한 일</Text>
                                <ScrollView style={{ maxHeight: 80 }} nestedScrollEnabled>
                                    {completedTodos.map((todo, idx) => (
                                        <Text key={idx} style={styles.todoItem}>
                                            • {todo.text}
                                        </Text>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.actions}>
                            {initialData?.content ? (
                                <TouchableOpacity
                                    style={[styles.btn, styles.deleteBtn]}
                                    onPress={handleDelete}
                                    disabled={isSaving || isDeleting}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                    <Text style={styles.deleteBtnText}>삭제</Text>
                                </TouchableOpacity>
                            ) : <View style={{ flex: 1 }} />}

                            <TouchableOpacity
                                style={[styles.btn, styles.saveBtn]}
                                onPress={handleSave}
                                disabled={isSaving || isDeleting}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark" size={20} color="#FFF" />
                                        <Text style={styles.saveBtnText}>저장하기</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const getStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.dim || 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 400,
    },
    card: {
        backgroundColor: theme.colors.body,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text
    },
    closeBtn: {
        padding: 4
    },

    emojiSection: {
        marginBottom: 20,
    },
    emojiLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
        marginBottom: 10
    },
    emojiScrollContent: {
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 5,
        minWidth: '100%'
    },
    emojiItem: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#eee',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 2,
        borderColor: 'transparent'
    },
    emojiItemSelected: {
        borderColor: theme.colors.main,
    },
    emojiImage: {
        width: 38,
        height: 38,
        borderRadius: 19
    },
    badgeContainer: {
        position: 'absolute',
        top: -8,
        left: -4,
        zIndex: 5
    },
    badgeCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.main,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    },

    input: {
        backgroundColor: theme.colors.base,
        borderRadius: 16,
        padding: 16,
        height: 120, // Reduced height slightly to fit todos
        textAlignVertical: 'top',
        fontSize: 15,
        color: theme.colors.text,
        marginBottom: 15, // Reduced margin
        borderWidth: 1,
        borderColor: theme.colors.border
    },

    todosSection: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: theme.colors.base,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    todosLabel: {
        fontSize: 12,
        color: theme.colors.subText,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    todoItem: {
        fontSize: 13,
        color: theme.colors.text,
        marginBottom: 4,
        paddingLeft: 4
    },

    actions: {
        flexDirection: 'row',
        gap: 12
    },
    btn: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    saveBtn: {
        backgroundColor: theme.colors.main,
        flex: 2
    },
    saveBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    deleteBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFE3E3',
        flex: 1
    },
    deleteBtnText: {
        color: '#FF6B6B',
        fontWeight: '600'
    }
});
