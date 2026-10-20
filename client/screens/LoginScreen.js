import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, TextInput, Platform } from 'react-native';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                const loggedInUser = data.user;

                await login({ ...loggedInUser, token: data.token }); // Save user + token to context
                Alert.alert('로그인 성공', `환영합니다 ${loggedInUser.username}님!`);
                navigation.navigate('MainTabs'); // Navigate to main app
            } else {
                Alert.alert('로그인 실패', data.error);
            }
        } catch (e) {
            Alert.alert('오류', '서버 연결에 실패했습니다.');
            console.log(e);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header Area */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>로그인</Text>
                    <View style={{ width: 30 }} />
                </View>

                {/* Form Area */}
                <View style={styles.formWrap}>
                    {/* Design: ID and password joined into one box */}
                    <TextInput
                        style={[styles.input, styles.inputTop]}
                        placeholder="아이디"
                        placeholderTextColor={colors.guideText}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        accessibilityLabel="아이디"
                    />
                    <TextInput
                        style={[styles.input, styles.inputBottom]}
                        placeholder="비밀번호"
                        placeholderTextColor={colors.guideText}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onSubmitEditing={handleLogin}
                        accessibilityLabel="비밀번호"
                    />

                    {/* Find ID/PW by emailed code (login already persists on the device, so no 'save ID') */}
                    <View style={[styles.loginUtil, { justifyContent: 'flex-end' }]}>
                        <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
                            <Text style={styles.utilText}>아이디/비밀번호 찾기</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottomBtnGroup}>
                    <Button
                        title="로그인"
                        type="main"
                        onPress={handleLogin}
                    />
                    <Button
                        title="회원가입"
                        type="sub"
                        onPress={() => navigation.navigate('Join')}
                    />
                    {/* New SNS accounts go through theme setup (Step01) like new guests */}
                    <SocialLoginButtons
                        onDone={({ isNew }) => navigation.reset({ index: 0, routes: [{ name: isNew ? 'Step01' : 'MainTabs' }] })}
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
        marginBottom: 20,
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
        paddingTop: 20,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: colors.lightGray,
        paddingHorizontal: 16,
        fontSize: Platform.OS === 'web' ? 16 : 14,
        color: colors.text,
        backgroundColor: colors.white,
    },
    inputTop: { borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    inputBottom: { marginTop: -1, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 },
    loginUtil: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#ccc', // var(--fnb)
        borderRadius: 9, // Circle
        marginRight: 6,
    },
    utilText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.guideText,
    },
    bottomBtnGroup: {
        marginTop: 20,
        marginBottom: 40,
    }
});
