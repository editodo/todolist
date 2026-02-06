
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { layout } from '../theme';
import Header from '../components/Header';
import DiaryModal from '../components/DiaryModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';

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

export default function DailyScreen({ navigation }) {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { colors } = theme;

    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
    const [diaries, setDiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDiary, setSelectedDiary] = useState(null);

    const styles = getStyles(theme);

    useEffect(() => {
        if (user) fetchDiaries();
    }, [user, viewMode]);

    const fetchDiaries = async () => {
        setIsLoading(true);
        try {
            const now = new Date();
            let url = `${API_URL}/api/diaries?user_id=${user.id}`;

            // Just fetching for current month for simplicity in both views for now
            const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            url += `&month=${monthStr}`;

            const response = await fetch(url);
            if (response.ok) {
                let data = await response.json();
                // Sort by date string descending
                data.sort((a, b) => b.date.localeCompare(a.date));

                if (viewMode === 'week') {
                    setDiaries(data.slice(0, 7));
                } else {
                    setDiaries(data);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiaryClick = (diary) => {
        setSelectedDiary(diary);
        setIsModalVisible(true);
    };

    const handleWriteToday = () => {
        setSelectedDiary(null); // Clear selection implies "New" (or Today)
        setIsModalVisible(true);
    };

    // Calculate generic date for modal: Selected or Today (Local Time)
    const getTodayStr = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const modalDate = selectedDiary?.date
        ? selectedDiary.date.split('T')[0]
        : getTodayStr();

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="하루일기"
                showMenu={true}
                rightButton={
                    <TouchableOpacity onPress={handleWriteToday} style={{ padding: 4 }}>
                        <Ionicons name="create-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                }
            />

            {/* View Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleBtn, viewMode === 'week' && styles.toggleActive]}
                    onPress={() => setViewMode('week')}
                >
                    <Text style={[styles.toggleText, viewMode === 'week' && styles.textWhite]}>일주일</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, viewMode === 'month' && styles.toggleActive]}
                    onPress={() => setViewMode('month')}
                >
                    <Text style={[styles.toggleText, viewMode === 'month' && styles.textWhite]}>한달</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.main} style={{ marginTop: 50 }} />
                ) : diaries.length > 0 ? (
                    diaries.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.diaryCard}
                            onPress={() => handleDiaryClick(item)}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardDate}>{item.date}</Text>
                                <View style={styles.emojiWrapper}>
                                    {EMOJI_MAP[item.emotion] ? (
                                        <Image source={EMOJI_MAP[item.emotion]} style={styles.cardEmoji} />
                                    ) : (
                                        <Text style={styles.cardEmojiText}>{item.emotion}</Text>
                                    )}
                                </View>
                            </View>
                            <Text style={styles.cardSnippet} numberOfLines={2}>
                                {item.content}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.border} style={styles.cardArrow} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={60} color={colors.border} />
                        <Text style={styles.emptyText}>기록된 일기가 없어요.</Text>
                        <Text style={styles.emptySubText}>오늘의 이야기를 기록해보세요!</Text>
                        <TouchableOpacity style={styles.writeFloatBtn} onPress={handleWriteToday}>
                            <Text style={styles.writeFloatText}>일기 쓰기</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <DiaryModal
                visible={isModalVisible}
                date={modalDate}
                initialData={selectedDiary ? { content: selectedDiary.content, emotion: selectedDiary.emotion } : null}
                onClose={() => setIsModalVisible(false)}
                onSaved={fetchDiaries}
                userId={user?.id}
                apiUrl={API_URL}
            />
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
    toggleContainer: {
        flexDirection: 'row',
        padding: 18,
        justifyContent: 'center',
        gap: 12
    },
    toggleBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.body,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    toggleActive: {
        backgroundColor: theme.colors.main,
        borderColor: theme.colors.main,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.guideText
    },
    textWhite: { color: '#FFF' },

    listContent: { padding: 18, paddingBottom: 100 },
    diaryCard: {
        backgroundColor: theme.colors.base,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    cardDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.subText
    },
    cardEmoji: {
        width: 38,
        height: 38,
        borderRadius: 19
    },
    cardEmojiText: {
        fontSize: 28
    },
    cardSnippet: {
        fontSize: 15,
        color: theme.colors.guideText,
        lineHeight: 22,
        paddingRight: 20
    },
    cardArrow: {
        position: 'absolute',
        bottom: 20,
        right: 15
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: 100
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.guideText,
        marginTop: 20
    },
    emptySubText: {
        fontSize: 14,
        color: theme.colors.guideText,
        opacity: 0.8,
        marginTop: 8
    },
    writeFloatBtn: {
        marginTop: 20,
        backgroundColor: theme.colors.main,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    writeFloatText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
