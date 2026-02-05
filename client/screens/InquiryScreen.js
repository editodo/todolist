import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';

export default function InquiryScreen({ navigation }) {
    const [email, setEmail] = useState('mine5959@email.com');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        Alert.alert('접수 완료', '소중한 문의가 접수되었습니다. 빠르게 답변드리겠습니다.');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="문의하기"
                leftButton={<TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>{'<'}</Text></TouchableOpacity>}
            />
            <ScrollView style={styles.content}>
                <Input
                    label="답변 받으실 이메일"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.label}>문의유형</Text>
                    <View style={styles.pickerBox}>
                        <Text>이용 문의 (Select Box Placeholder)</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>문의 내용</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        placeholder="내용을 입력하세요."
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                    />
                </View>

                <View style={{ marginTop: 30 }}>
                    <Button title="저장" onPress={handleSubmit} />
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
    pickerBox: {
        height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 5,
        justifyContent: 'center', paddingHorizontal: 16, backgroundColor: colors.white
    },
    textArea: {
        height: 200, borderWidth: 1, borderColor: colors.border, borderRadius: 5,
        padding: 16, backgroundColor: colors.white, fontSize: 14
    }
});
