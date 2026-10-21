import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from '../components/AppText';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { t } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

// Design: 회원정보 수정 — email is shown read-only, nickname can be changed.
export default function UserModifyScreen({ navigation }) {
    const { colors } = useTheme().theme;
    const styles = getStyles(colors);
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
                leftButton={<BackButton onPress={() => navigation.goBack()} />}
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

const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.body, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },
    back: { fontSize: 24, padding: 5, color: colors.text },
    body: { paddingHorizontal: 18, paddingTop: 20 },
    label: { fontSize: 12, color: colors.subText, marginBottom: 5 },
    input: {
        height: 44, borderWidth: 1, borderColor: colors.border, borderRadius: 5, paddingHorizontal: 16,
        fontSize: Platform.OS === 'web' ? 16 : 14, color: colors.text, backgroundColor: colors.body,
    },
    readonly: { backgroundColor: colors.border, color: colors.guideText },
});
