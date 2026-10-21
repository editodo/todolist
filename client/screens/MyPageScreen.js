import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import { colors, layout } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { isSupported as remindersSupported } from '../notifications';
import { t, LANGUAGES } from '../i18n';

const MenuItem = ({ title, onPress, value }) => {
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
    return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Text style={styles.menuText}>{title}</Text>
        <View style={styles.menuRight}>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <Ionicons name="chevron-forward" size={12} color="#cccccc" />
        </View>
    </TouchableOpacity>
    );
};

export default function MyPageScreen({ navigation }) {
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
    const { mode, themeStyle, palette, language } = useTheme();
    const { user, logout, deleteAccount } = useAuth();

    // Robust check for guest status
    const isGuest = user?.user_type === 'GUEST' || user?.username?.startsWith('guest_');
    const isExpired = user?.isExpired;

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
            if (window.confirm(isGuest ? t('체험계정을 종료하시겠습니까? 데이터가 유실될 수 있습니다.') : t('로그아웃 하시겠습니까?'))) {
                logoutAction();
            }
        } else {
            Alert.alert(t('로그아웃'), isGuest ? t('체험계정을 종료하면 데이터가 삭제될 수 있습니다. 계속하시겠습니까?') : t('로그아웃 하시겠습니까?'), [
                { text: t('취소'), style: 'cancel' },
                { text: t('확인'), style: 'destructive', onPress: logoutAction }
            ]);
        }
    };

    const handleDeleteAccount = () => {
        const message = t('계정과 모든 할 일, 일기, 설정이 즉시 삭제되며 복구할 수 없습니다. 탈퇴하시겠습니까?');
        const deleteAction = async () => {
            const result = await deleteAccount();
            if (result.success) {
                navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
            } else if (Platform.OS === 'web') {
                window.alert(result.error);
            } else {
                Alert.alert(t('실패'), result.error);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(message)) deleteAction();
        } else {
            Alert.alert(t('회원 탈퇴'), message, [
                { text: t('취소'), style: 'cancel' },
                { text: t('탈퇴'), style: 'destructive', onPress: deleteAction }
            ]);
        }
    };

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Design: name header. Member → edit profile; guest → keep data by converting */}
                <TouchableOpacity
                    style={styles.infoBar}
                    onPress={() => (isGuest ? navigation.navigate('Join', { convert: true }) : navigation.navigate('UserModify'))}
                    accessibilityRole="button"
                >
                    <Text style={styles.infoName}>{isGuest ? t('로그인/회원가입') : (user?.nickname || user?.username)}</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.text} />
                </TouchableOpacity>

                {isGuest && (
                    <TouchableOpacity style={styles.trialBox} onPress={() => navigation.navigate('Join', { convert: true })}>
                        <Text style={[styles.trialText, daysLeft <= 0 && styles.expired]}>
                            {daysLeft > 0 ? t('체험 기간 {n}일 남음', { n: daysLeft }) : t('체험 기간이 끝났어요')}
                        </Text>
                        <Text style={styles.trialSub}>{t('정회원으로 전환하면 지금까지의 기록이 그대로 유지돼요')}</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.menuGroup}>
                    <MenuItem title={t('테마 및 색상 변경')} onPress={() => navigation.navigate('Step01', { fromSettings: true, snapshot: { mode, themeStyle, palette } })} />
                    <MenuItem title={t('글꼴 변경')} onPress={() => navigation.navigate('FontSettings')} />
                    <MenuItem
                        title={t('언어')}
                        value={(LANGUAGES.find((l) => l.id === language) || {}).label || t('휴대폰 설정 따르기')}
                        onPress={() => navigation.navigate('LanguageSettings')}
                    />
                    {remindersSupported && <MenuItem title={t('알림 설정')} onPress={() => navigation.navigate('NotificationSettings')} />}
                </View>

                <View style={styles.menuGroup}>
                    <MenuItem title={t('공지사항')} onPress={() => navigation.navigate('Notice')} />
                    <MenuItem title={t('이용약관')} onPress={() => navigation.navigate('Terms')} />
                    <MenuItem title={t('개인정보 정책')} onPress={() => navigation.navigate('PrivacyPolicy')} />
                    <MenuItem title={t('문의하기')} onPress={() => navigation.navigate('Inquiry')} />
                </View>

                <View style={styles.menuGroup}>
                    <View style={styles.menuItem}>
                        <Text style={styles.menuText}>{t('버전 정보')}</Text>
                        <Text style={styles.menuValue}>{Constants.expoConfig?.version}</Text>
                    </View>
                </View>

                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <Text style={styles.menuText}>{isGuest ? t('체험 종료 (로그아웃)') : t('로그아웃')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Store rule: account deletion must stay reachable (static design: small underlined link) */}
                <TouchableOpacity style={styles.leaveBtn} onPress={handleDeleteAccount}>
                    <Text style={styles.withdrawText}>{t('회원 탈퇴')}</Text>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
}

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mypageColor, // design: mypage gray between groups
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center',
    },
    content: { flex: 1 },
    infoBar: {
        height: 60, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16,
        backgroundColor: colors.body, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    infoName: { fontSize: 20, fontWeight: '600', color: colors.text, letterSpacing: -0.33 },
    trialBox: { backgroundColor: colors.body, paddingHorizontal: 16, paddingBottom: 14 },
    trialText: { fontSize: 13, fontWeight: '600', color: colors.main },
    trialSub: { fontSize: 12, color: colors.guideText, marginTop: 2 },
    leaveBtn: { alignSelf: 'flex-end', marginTop: 14, marginRight: 18, marginBottom: 24, padding: 4 },

    profileSection: {
        backgroundColor: colors.body,
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
        backgroundColor: colors.border,
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
        borderColor: colors.body,
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
        color: colors.body,
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Design: white groups separated by 10px of gray, rows 45 high
    menuGroup: {
        marginTop: 10,
        backgroundColor: colors.body,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItem: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    menuText: { fontSize: 14, color: colors.subText },
    menuRight: { flexDirection: 'row', alignItems: 'center' },
    menuValue: { marginRight: 8, color: colors.guideText, fontSize: 13 },
    arrow: { fontSize: 16, color: colors.fnb },

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
        borderTopColor: colors.border,
    },
    logoutText: { color: colors.subText, fontSize: 14 },
    withdrawText: { color: colors.guideText, fontSize: 12, textDecorationLine: 'underline' },

});
