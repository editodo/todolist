import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import { API_URL } from '../config';

// Two steps on one screen: 1) email → server mails the ID and a 6-digit code, 2) code + new password.
export default function PasswordResetScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    // Messages render inline: Alert.alert is a no-op on the web build
    const [notice, setNotice] = useState(null); // { text, error }

    const post = async (path, body) => {
        setBusy(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/password-reset/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json().catch(() => ({}));
            return { ok: response.ok, data };
        } catch (e) {
            return { ok: false, data: { error: '서버 연결에 실패했습니다.' } };
        } finally {
            setBusy(false);
        }
    };

    const handleRequest = async () => {
        if (!email.trim()) return setNotice({ text: '가입한 이메일을 입력해주세요.', error: true });
        const { ok, data } = await post('request', { email: email.trim() });
        if (!ok) return setNotice({ text: data.error, error: true });
        setCodeSent(true);
        setNotice({ text: data.message });
    };

    const handleConfirm = async () => {
        if (password !== passwordConfirm) return setNotice({ text: '비밀번호와 비밀번호 확인이 다릅니다.', error: true });
        const { ok, data } = await post('confirm', { email: email.trim(), code: code.trim(), password });
        if (!ok) return setNotice({ text: data.error, error: true });
        setDone(true);
        setNotice({ text: data.message });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>아이디/비밀번호 찾기</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.formWrap} showsVerticalScrollIndicator={false}>
                    <Text style={styles.guide}>
                        가입한 이메일로 아이디와 인증 코드를 보내드립니다. 코드를 입력하면 새 비밀번호를 정할 수 있습니다.
                    </Text>
                    {notice && <Text style={[styles.notice, notice.error && styles.noticeError]}>{notice.text}</Text>}
                    {done ? (
                        <Button title="로그인하러 가기" type="main" onPress={() => navigation.navigate('Login')} />
                    ) : (
                    <>
                    <Input label="이메일" placeholder="email@example.com" value={email} onChangeText={setEmail} />
                    {!codeSent ? (
                        <Button title={busy ? '보내는 중...' : '인증 코드 받기'} type="main" onPress={busy ? undefined : handleRequest} />
                    ) : (
                        <>
                            <Input label="인증 코드 (6자리)" placeholder="메일로 받은 숫자 6자리" value={code} onChangeText={setCode} />
                            <Input label="새 비밀번호" placeholder="8자 이상" value={password} onChangeText={setPassword} secureTextEntry />
                            <Input label="새 비밀번호 확인" placeholder="한 번 더 입력" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry />
                            <Button title={busy ? '변경 중...' : '비밀번호 변경'} type="main" onPress={busy ? undefined : handleConfirm} />
                            <TouchableOpacity onPress={busy ? undefined : handleRequest} style={styles.resend}>
                                <Text style={styles.resendText}>메일이 오지 않았나요? 코드 다시 받기</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    </>
                    )}
                    <TouchableOpacity onPress={() => navigation.navigate('Inquiry')} style={styles.resend}>
                        <Text style={styles.resendText}>가입한 이메일이 기억나지 않으면 문의하기</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.body },
    container: { flex: 1, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center', paddingHorizontal: 18 },
    header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    headerTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
    backBtn: { width: 30, height: 30, justifyContent: 'center' },
    formWrap: { flex: 1 },
    guide: { fontSize: 13, color: colors.subText, lineHeight: 19, marginBottom: 20 },
    notice: { fontSize: 14, color: colors.text, backgroundColor: '#f2f8f9', padding: 12, borderRadius: 5, marginBottom: 16, lineHeight: 20 },
    noticeError: { color: '#c0392b', backgroundColor: '#fdf0ef' },
    resend: { marginTop: 16, alignItems: 'center' },
    resendText: { fontSize: 13, color: colors.subText, textDecorationLine: 'underline' },
});
