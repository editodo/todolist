import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { colors, layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

// Design: 회원정보 수정 — email is shown read-only, nickname can be changed.
export default function UserModifyScreen({ navigation }) {
    const { user, updateProfile } = useAuth();
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const next = nickname.trim();
        if (!next) return Alert.alert('알림', '닉네임을 입력해주세요.');
        setSaving(true);
        const result = await updateProfile({ nickname: next, profile_image: user?.profile_image ?? null });
        setSaving(false);
        if (result.success) navigation.goBack();
        else Alert.alert('실패', '회원정보를 수정하지 못했습니다.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="회원정보 수정"
                leftButton={<TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="뒤로"><Text style={styles.back}>{'<'}</Text></TouchableOpacity>}
            />
            <View style={styles.body}>
                <Text style={styles.label}>{user?.email ? '이메일' : '아이디'}</Text>
                <TextInput style={[styles.input, styles.readonly]} value={user?.email || user?.username || ''} editable={false} />

                <Text style={[styles.label, { marginTop: 16 }]}>닉네임</Text>
                <TextInput
                    style={styles.input}
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={20}
                    autoCapitalize="none"
                    accessibilityLabel="닉네임"
                />

                <Button title={saving ? '저장 중...' : '수정'} onPress={saving ? undefined : handleSave} style={{ marginTop: 20 }} />
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
