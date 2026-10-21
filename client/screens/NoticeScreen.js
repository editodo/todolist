import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import { API_URL } from '../config';
import { t } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const NoticeItem = ({ title, date, content }) => {
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={toggleExpand} style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title} numberOfLines={expanded ? 0 : 1}>{title}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.body}>
                    <Text style={styles.content}>{content}</Text>
                </View>
            )}
        </View>
    );
};

export default function NoticeScreen({ navigation }) {
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
    const [notices, setNotices] = useState(null); // null = loading

    useEffect(() => {
        fetch(`${API_URL}/api/notices`)
            .then((r) => (r.ok ? r.json() : []))
            .then(setNotices)
            .catch(() => setNotices([]));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={t('공지사항')}
                leftButton={<BackButton onPress={() => navigation.goBack()} />}
            />
            <ScrollView style={styles.list}>
                {notices === null && <ActivityIndicator style={{ marginTop: 40 }} color={colors.main} />}
                {notices?.length === 0 && <Text style={styles.empty}>{t('등록된 공지사항이 없습니다.')}</Text>}
                {notices?.map((n) => (
                    <NoticeItem
                        key={n.id}
                        title={n.title}
                        date={new Date(n.created_at).toLocaleDateString('ko-KR')}
                        content={n.content}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.body,
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center',
    },
    back: { fontSize: 24, padding: 5, color: colors.text },
    list: { padding: 18 },
    itemContainer: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 15 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
    date: { fontSize: 12, color: colors.guideText },
    arrow: { fontSize: 12, color: colors.subText },
    body: { marginTop: 15, padding: 10, backgroundColor: colors.mypageColor, borderRadius: 5 },
    content: { fontSize: 14, color: colors.subText, lineHeight: 20 },
    empty: { marginTop: 40, textAlign: 'center', color: colors.subText }
});
