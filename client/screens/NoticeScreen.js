import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { colors, layout } from '../theme';
import Header from '../components/Header';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const NoticeItem = ({ title, date, content }) => {
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
    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="공지사항"
                leftButton={<TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>{'<'}</Text></TouchableOpacity>}
            />
            <ScrollView style={styles.list}>
                <NoticeItem
                    title="[공지] 새로운 테마가 추가되었습니다."
                    date="2023/04/11"
                    content={`E-T를 사랑해주신 여러분들, 봄맞이\n테마 컬러가 새로 출시되었습니다.\n\n더 다양한 테마와 글꼴이 출시 예정이니 많은 관심 부탁드립니다 :)`}
                />
                <NoticeItem
                    title="[서비스] 서비스 장애로 불편을 드려 죄송합니다."
                    date="2023/04/11"
                    content={`2024.04.11 서비스 장애로 인해 불편을 드려 죄송합니다.\n복구 조치가 되었으나, 복구가 되지 않은 사용자분들은 문의하여 주세요^^`}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.body,
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center',
    },
    back: { fontSize: 24, padding: 5, color: colors.text },
    list: { padding: 18 },
    itemContainer: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 15 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
    date: { fontSize: 12, color: colors.guideText },
    arrow: { fontSize: 12, color: colors.subText },
    body: { marginTop: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
    content: { fontSize: 14, color: colors.subText, lineHeight: 20 }
});
