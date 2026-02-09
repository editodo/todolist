import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Platform, Modal, TextInput, Image } from 'react-native';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({ title, onPress, value }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Text style={styles.menuText}>{title}</Text>
        <View style={styles.menuRight}>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <Text style={styles.arrow}>{'>'}</Text>
        </View>
    </TouchableOpacity>
);

export default function MyPageScreen({ navigation }) {
    const { mode, themeStyle, palette } = useTheme();
    const { user, logout, convertAccount } = useAuth();

    // Robust check for guest status
    const isGuest = user?.user_type === 'GUEST' || user?.username?.startsWith('guest_');
    const isExpired = user?.isExpired;
    // Conversion Modal State
    const [convertModalVisible, setConvertModalVisible] = useState(false);
    const [convertData, setConvertData] = useState({ username: '', password: '', email: '', nickname: '', phone_number: '' });

    // Expiration Calc
    const getDaysLeft = () => {
        if (!user?.expires_at) return null;
        const expiry = new Date(user.expires_at);
        const now = new Date();
        const diff = expiry - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };
    const daysLeft = getDaysLeft();

    const handleLogout = () => {
        const logoutAction = async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
        };

        if (Platform.OS === 'web') {
            if (window.confirm(isGuest ? '체험계정을 종료하시겠습니까? 데이터가 유실될 수 있습니다.' : '로그아웃 하시겠습니까?')) {
                logoutAction();
            }
        } else {
            Alert.alert('로그아웃', isGuest ? '체험계정을 종료하면 데이터가 삭제될 수 있습니다. 계속하시겠습니까?' : '로그아웃 하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                { text: '확인', style: 'destructive', onPress: logoutAction }
            ]);
        }
    };

    const handleConvert = async () => {
        if (!convertData.username || !convertData.password || !convertData.email) {
            Alert.alert('오류', '아이디, 비밀번호, 이메일은 필수입니다.');
            return;
        }

        const result = await convertAccount(convertData);
        if (result.success) {
            Alert.alert('성공', '정회원으로 전환되었습니다!');
            setConvertModalVisible(false);
        } else {
            Alert.alert('실패', result.error || '계정 전환에 실패했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="마이페이지" showMenu={true} />
            <ScrollView style={styles.content}>

                {/* Profile Section */}
                <View style={[styles.profileSection, isGuest && styles.guestProfile]}>
                    <View style={styles.profileRow}>
                        {/* Profile Image Placeholder */}
                        <TouchableOpacity style={styles.profileImageContainer}>
                            {user?.profile_image ? (
                                <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.profilePlaceholder}>
                                    <Ionicons name="person" size={30} color="#fff" />
                                </View>
                            )}
                            <View style={styles.editIconBadge}>
                                <Ionicons name="camera" size={12} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.nickname}>{user?.nickname || '닉네임 없음'}</Text>
                                {isGuest && <View style={styles.badge}><Text style={styles.badgeText}>체험중</Text></View>}
                            </View>
                            <Text style={styles.username}>@{user?.username}</Text>

                            {isGuest && (
                                <Text style={[styles.expiryText, daysLeft <= 0 ? styles.expired : null]}>
                                    {daysLeft > 0 ? `체험기간 ${daysLeft}일 남음` : '체험기간 만료됨'}
                                </Text>
                            )}
                        </View>
                    </View>

                    {isGuest && (
                        <TouchableOpacity style={styles.convertBtn} onPress={() => setConvertModalVisible(true)}>
                            <Text style={styles.convertBtnText}>정회원 전환하고 데이터 유지하기</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Settings */}
                <View style={styles.menuGroup}>
                    <MenuItem
                        title="테마 및 색상변경"
                        onPress={() => navigation.navigate('Step01')}
                    />
                    <MenuItem title="공지사항" onPress={() => navigation.navigate('Notice')} />
                    <MenuItem title="이용약관" onPress={() => Alert.alert('이용약관', '약관 내용...')} />
                    <MenuItem title="문의하기" onPress={() => navigation.navigate('Inquiry')} />
                </View>

                <View style={styles.menuGroup}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>버전정보</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>{isGuest ? '체험 종료 (로그아웃)' : '로그아웃'}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Conversion Modal */}
            <Modal
                visible={convertModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setConvertModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>정회원 전환</Text>
                        <Text style={styles.modalSubtitle}>체험 계정의 데이터를 그대로 유지합니다.</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="사용할 아이디"
                            value={convertData.username}
                            onChangeText={t => setConvertData({ ...convertData, username: t })}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="사용할 닉네임 (선택)"
                            value={convertData.nickname}
                            onChangeText={t => setConvertData({ ...convertData, nickname: t })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호"
                            secureTextEntry
                            value={convertData.password}
                            onChangeText={t => setConvertData({ ...convertData, password: t })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="이메일"
                            keyboardType="email-address"
                            value={convertData.email}
                            onChangeText={t => setConvertData({ ...convertData, email: t })}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="전화번호 (선택)"
                            keyboardType="phone-pad"
                            value={convertData.phone_number}
                            onChangeText={t => setConvertData({ ...convertData, phone_number: t })}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setConvertModalVisible(false)}>
                                <Text style={styles.cancelText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={handleConvert}>
                                <Text style={styles.confirmText}>전환하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    content: { flex: 1, padding: 20 },

    profileSection: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    guestProfile: {
        borderWidth: 1,
        borderColor: colors.main,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: 15,
    },
    profilePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.main,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    nickname: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginRight: 6,
    },
    username: {
        fontSize: 14,
        color: colors.subText,
        marginBottom: 4,
    },
    badge: {
        backgroundColor: '#FFE0E0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: '#FF4040',
        fontSize: 10,
        fontWeight: 'bold',
    },
    expiryText: {
        fontSize: 12,
        color: colors.main,
        fontWeight: '600',
    },
    expired: {
        color: 'red',
    },
    convertBtn: {
        marginTop: 15,
        backgroundColor: colors.main,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    convertBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    menuGroup: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuText: { fontSize: 15, color: colors.text },
    menuRight: { flexDirection: 'row', alignItems: 'center' },
    menuValue: { marginRight: 8, color: colors.subText, fontSize: 13 },
    arrow: { fontSize: 16, color: '#ccc' },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    infoLabel: { fontSize: 14, color: colors.subText },
    infoValue: { fontSize: 14, color: colors.text, fontWeight: 'bold' },

    logoutBtn: {
        padding: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    logoutText: { color: colors.subText, fontSize: 14 },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: colors.subText,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelBtn: { backgroundColor: '#f0f0f0' },
    confirmBtn: { backgroundColor: colors.main },
    cancelText: { color: '#666' },
    confirmText: { color: '#fff', fontWeight: 'bold' },
});
