import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, TextInput } from '../components/AppText';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { t } from '../i18n';

// Design: 회원정보 수정 — email is shown read-only, nickname can be changed.
export default function UserModifyScreen({ navigation }) {
    const { user, updateProfile } = useAuth();
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const next = nickname.trim();
        if (!next) return Alert.alert(t('알림'), t('닉네임을 입력해주세요.'));
        setSaving(true);
        const result = await updateProfile({ nickname: next, profile_image: user?.profile_image ?? null });
        setSaving(false);
        if (result.success) navigation.goBack();
        else Alert.alert(t('실패'), t('회원정보를 수정하지 못했습니다.'));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={t('회원정보 수정')}
                leftButton={<TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel={t('뒤로')}><Text style={styles.back}>{'<'}</Text></TouchableOpacity>}
            />
            <View style={styles.body}>
                <Text style={styles.label}>{user?.email ? t('이메일') : t('아이디')}</Text>
                <TextInput style={[styles.input, styles.readonly]} value={user?.email || user?.username || ''} editable={false} />

                <Text style={[styles.label, { marginTop: 16 }]}>{t('닉네임')}</Text>
                <TextInput
                    style={styles.input}
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={20}
                    autoCapitalize="none"
                    accessibilityLabel={t('닉네임')}
                />

                <Button title={saving ? t('저장 중...') : t('수정')} onPress={saving ? undefined : handleSave} style={{ marginTop: 20 }} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },
    back: { fontSize: 24, padding: 5, color: colors.text },
    body: { paddingHorizontal: 18, paddingTop: 20 },
    label: { fontSize: 12, color: colors.subText, marginBottom: 5 },
    input: {
        height: 44, borderWidth: 1, borderColor: colors.lightGray, borderRadius: 5, paddingHorizontal: 16,
        fontSize: Platform.OS === 'web' ? 16 : 14, color: colors.text, backgroundColor: colors.white,
    },
    readonly: { backgroundColor: colors.lightGray, color: '#888888' },
});
