import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { Text, TextInput } from '../components/AppText';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { SUPPORT_EMAIL } from '../config';
import { t } from '../i18n';

export default function InquiryScreen({ navigation }) {
    const [content, setContent] = useState('');

    // There is no inquiry backend: hand the message to the user's mail app so nothing is silently lost
    const handleSubmit = async () => {
        const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t('[EdiTodo 문의]'))}&body=${encodeURIComponent(content)}`;
        try {
            await Linking.openURL(url);
        } catch (e) {
            Alert.alert(t('메일 앱을 열 수 없습니다'), t('{email} 로 직접 메일을 보내주세요.', { email: SUPPORT_EMAIL }));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={t('문의하기')}
                leftButton={<TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>{'<'}</Text></TouchableOpacity>}
            />
            <ScrollView style={styles.content}>
                <Text style={styles.label}>{t('문의 메일 주소')}</Text>
                <Text selectable style={styles.email}>{SUPPORT_EMAIL}</Text>
                <Text style={styles.guide}>{t('아래 내용을 적고 버튼을 누르면 메일 앱이 열립니다. 답변은 보내신 메일 주소로 드립니다.')}</Text>

                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{t('문의 내용')}</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        placeholder={t('내용을 입력하세요.')}
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                    />
                </View>

                <View style={{ marginTop: 30 }}>
                    <Button title={t('메일로 문의하기')} onPress={handleSubmit} />
                </View>
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
    content: { flex: 1, padding: 18 },
    label: { fontSize: 12, color: colors.subText, marginBottom: 5 },
    email: { fontSize: 16, color: colors.text, fontWeight: 'bold', marginBottom: 8 },
    guide: { fontSize: 13, color: colors.subText, lineHeight: 19, marginBottom: 20 },
    textArea: {
        height: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 5,
        padding: 16, backgroundColor: colors.white, fontSize: 14
    }
});
