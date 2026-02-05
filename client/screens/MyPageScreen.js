import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const MenuItem = ({ title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Text style={styles.menuText}>{title}</Text>
        <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
);

export default function MyPageScreen({ navigation }) {
    const { mode, themeStyle, palette } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        const logoutAction = async () => {
            // Call logout from AuthContext
            await logout();

            // Reset to Login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        };

        if (Platform.OS === 'web') {
            if (window.confirm('로그아웃 하시겠습니까?')) {
                logoutAction();
            }
        } else {
            Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    style: 'destructive',
                    onPress: logoutAction
                }
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="마이페이지" showMenu={true} />
            <ScrollView style={styles.content}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileInfo}>
                        <Text style={styles.username}>{user?.username || '게스트'} 님</Text>
                        <Text style={styles.userId}>{user?.isGuest ? '게스트 모드' : user?.email}</Text>
                    </View>
                    {user?.isGuest && (
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginBtnText}>로그인하기</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Settings Group 1 */}
                <View style={styles.menuGroup}>
                    <MenuItem
                        title="테마 및 색상변경"
                        onPress={() => navigation.navigate('Step01')} // Re-enter onboarding flow or dedicated settings
                    />
                    <MenuItem
                        title="공지사항"
                        onPress={() => navigation.navigate('Notice')}
                    />
                    <MenuItem
                        title="이용약관"
                        onPress={() => Alert.alert('이용약관', '약관 내용...')}
                    />
                    <MenuItem
                        title="문의하기"
                        onPress={() => navigation.navigate('Inquiry')}
                    />
                </View>

                {/* Settings Group 2 (Info) */}
                <View style={styles.menuGroup}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>버전정보</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>언어</Text>
                        <Text style={styles.infoValue}>Kor</Text>
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>

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
    content: { flex: 1, padding: 18 },

    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    username: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    userId: { fontSize: 14, color: colors.subText },
    loginBtn: {
        backgroundColor: colors.main,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },

    menuGroup: { marginBottom: 30 },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    menuText: { fontSize: 16, color: colors.text },
    arrow: { fontSize: 18, color: '#ccc' },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    infoLabel: { fontSize: 14, color: colors.subText },
    infoValue: { fontSize: 14, color: colors.text, fontWeight: 'bold' },

    logoutBtn: {
        marginTop: 20,
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    logoutText: { color: colors.subText }
});
