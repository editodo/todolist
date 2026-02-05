import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import { API_URL } from '../config';

export default function JoinScreen({ navigation }) {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [phone, setPhone] = useState('');

    const handleJoin = async () => {
        if (password !== passwordConfirm) {
            Alert.alert('비밀번호 불일치', '비밀번호와 비밀번호 확인이 다릅니다.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userId,
                    email: email,
                    password: password,
                    phone_number: phone
                })
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('가입 성공', '회원가입이 완료되었습니다.');
                navigation.navigate('Login');
            } else {
                Alert.alert('가입 실패', data.error);
            }
        } catch (e) {
            Alert.alert('오류', '서버 연결에 실패했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>회원가입</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.formWrap} showsVerticalScrollIndicator={false}>
                    <Input
                        label="아이디"
                        placeholder="8-16 자리 영문, 숫자 조합"
                        value={userId}
                        onChangeText={setUserId}
                    />
                    <Input
                        label="이메일"
                        placeholder="email@emai.com"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label="비밀번호"
                        placeholder="8-16자리 영문,숫자 조합"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Input
                        label="비밀번호 확인"
                        placeholder=""
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry
                    />
                    <Input
                        label="휴대폰번호"
                        placeholder="휴대폰 번호 '-' 없이 입력"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    {/* Terms Checkbox Simplified */}
                    <View style={styles.saveId}>
                        <View style={styles.checkbox} />
                        <Text style={styles.termsText}>
                            이용약관과 개인정보처리방침에 동의합니다.
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.bottomBtnGroup}>
                    <Button
                        title="가입"
                        type="main"
                        onPress={handleJoin}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.body,
    },
    container: {
        flex: 1,
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 18,
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    backBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
    },
    formWrap: {
        flex: 1,
    },
    saveId: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 9,
        marginRight: 6,
    },
    termsText: {
        fontSize: 13,
        color: '#666',
    },
    bottomBtnGroup: {
        marginBottom: 20,
        paddingTop: 10,
    }
});
