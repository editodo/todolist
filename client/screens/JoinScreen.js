import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import { API_URL } from '../config';
import { t } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { useAuth } from '../context/AuthContext';

// Signing up while using the app without an account keeps that account and its records (server /convert).
export default function JoinScreen({ navigation }) {
    const { convertAccount, isGuest: convert } = useAuth();
    const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleJoin = async () => {
        if (!agreed) {
            Alert.alert(t('약관 동의'), t('이용약관과 개인정보처리방침에 동의해주세요.'));
            return;
        }
        if (password !== passwordConfirm) {
            Alert.alert(t('비밀번호 불일치'), t('비밀번호와 비밀번호 확인이 다릅니다.'));
            return;
        }

        if (convert) {
            const result = await convertAccount({ username: userId, email, password, nickname: nickname.trim() || undefined });
            if (!result.success) return Alert.alert(t('가입 실패'), result.error || t('가입하지 못했습니다.'));
            goHome();
            return Alert.alert(t('가입 성공'), t('가입이 완료됐어요. 지금까지의 기록도 그대로 이어져요.'));
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userId,
                    email: email,
                    password: password,
                    nickname: nickname.trim() || undefined // empty → server picks a random one
                })
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert(t('가입 성공'), t('회원가입이 완료되었습니다.'));
                navigation.navigate('Login');
            } else {
                Alert.alert(t('가입 실패'), data.error);
            }
        } catch (e) {
            Alert.alert(t('오류'), t('서버 연결에 실패했습니다.'));
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>{t('회원가입')}</Text>
                    <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.formWrap} showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
                    {convert && <Text style={styles.convertNote}>{t('지금까지 쓴 기록이 새 계정으로 그대로 이어져요.')}</Text>}
                    <Input
                        label={t('아이디')}
                        placeholder={t('영문, 숫자, _ 조합 4~20자')}
                        value={userId}
                        onChangeText={setUserId}
                    />
                    <Input
                        label={t('이메일')}
                        placeholder="email@example.com"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label={t('비밀번호')}
                        placeholder={t('8자 이상')}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Input
                        label={t('비밀번호 확인')}
                        placeholder=""
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry
                    />
                    {/* Design: inline mismatch message under the confirm field */}
                    {passwordConfirm.length > 0 && password !== passwordConfirm && (
                        <Text style={styles.fieldError}>{t('비밀번호가 일치하지 않습니다.')}</Text>
                    )}
                    <Input
                        label={t('닉네임 (선택)')}
                        placeholder={t('비워두면 자동으로 만들어져요')}
                        value={nickname}
                        onChangeText={setNickname}
                    />

                    <View style={styles.saveId}>
                        <TouchableOpacity
                            onPress={() => setAgreed(!agreed)}
                            style={[styles.checkbox, agreed && styles.checkboxOn]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: agreed }}
                            accessibilityLabel={t('이용약관과 개인정보처리방침 동의')}
                        />
                        <Text style={styles.termsText}>
                            <Text style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>{t('이용약관')}</Text>{t('과')}{' '}
                            <Text style={styles.termsLink} onPress={() => navigation.navigate('PrivacyPolicy')}>{t('개인정보처리방침')}</Text>{t('에 동의합니다. (만 14세 이상)')}
                        </Text>
                    </View>

                    {/* SNS: the server sees the guest token and keeps this account's data */}
                    <View style={{ marginBottom: 20 }}>
                        <SocialLoginButtons onDone={goHome} />
                    </View>
                </ScrollView>

                <View style={styles.bottomBtnGroup}>
                    <Button
                        title={t('가입')}
                        type="main"
                        onPress={handleJoin}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (colors) => StyleSheet.create({
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
        borderColor: colors.fnb,
        borderRadius: 9,
        marginRight: 6,
    },
    convertNote: { fontSize: 13, color: colors.guideText, marginBottom: 16 },
    fieldError: { marginTop: -10, marginBottom: 14, fontSize: 12, color: colors.danger },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: colors.calendarColr,
    },
    checkboxOn: {
        backgroundColor: colors.main,
        borderColor: colors.main,
    },
    termsLink: {
        textDecorationLine: 'underline',
        color: colors.text,
    },
    bottomBtnGroup: {
        marginBottom: 20,
        paddingTop: 10,
    }
});
