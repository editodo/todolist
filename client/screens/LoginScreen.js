import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login, user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // TODO: Connect to API
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                const loggedInUser = data.user;

                // If the user was a guest, link their data
                if (user?.isGuest) {
                    try {
                        await fetch(`${API_URL}/api/auth/link`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                guest_id: user.id,
                                user_id: loggedInUser.id
                            })
                        });
                        console.log('Guest data linked successfully');
                    } catch (linkError) {
                        console.error('Failed to link guest data:', linkError);
                    }
                }

                login(loggedInUser); // Save user to context
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
                    <Input
                        placeholder="아이디"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <Input
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Utils: Save ID & Find ID/PW */}
                    <View style={styles.loginUtil}>
                        <TouchableOpacity style={styles.checkboxContainer}>
                            <View style={styles.checkbox} />
                            <Text style={styles.utilText}>아이디 저장</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
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
        marginTop: 20,
        flex: 1,
    },
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
        fontSize: 13,
        color: '#666', // var(--calendar-colr)
    },
    bottomBtnGroup: {
        marginBottom: 40,
    }
});
