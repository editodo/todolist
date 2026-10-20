import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { layout } from '../theme';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';
import ThemePreview from '../components/ThemePreview';
import { useAuth } from '../context/AuthContext';
import { API_URL, apiFetch } from '../config';
import { permissionUndetermined, requestPermission, getSettings, saveSettings } from '../notifications';

export default function Step04Screen({ navigation }) {
    const { theme, mode, themeStyle, palette } = useTheme();
    const { user } = useAuth();
    // Morning reminder offer, shown only before the permission was ever asked
    const [offerReminder, setOfferReminder] = useState(false);
    const [wantReminder, setWantReminder] = useState(true);

    useEffect(() => {
        permissionUndetermined().then(setOfferReminder).catch(() => {});
    }, []);

    const handleStart = async () => {
        if (offerReminder) {
            const granted = wantReminder && (await requestPermission());
            const current = await getSettings();
            await saveSettings({ ...current, morning: { ...current.morning, enabled: granted } }, user);
        }

        try {
            // Save preferences to DB
            if (user?.id) {
                await apiFetch(`${API_URL}/api/preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.id,
                        mode,
                        theme: themeStyle,
                        color_theme: palette
                    })
                });
            }
        } catch (e) {
            console.error('Failed to save preferences:', e);
        }

        // Reset navigation stack and go to MainTabs
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    }

    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StepIndicator step={3} />

                <View style={styles.content}>
                    <Text style={styles.title}>나만의 Todolist 생성 완료!{'\n'}아래의 테마가 맞는지 확인해 주세요.</Text>

                    {/* Final Preview */}
                    <View style={styles.previewContainer}>
                        <ThemePreview theme={theme} />
                    </View>
                </View>

                {offerReminder && (
                    <TouchableOpacity
                        style={styles.reminderRow}
                        onPress={() => setWantReminder(!wantReminder)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: wantReminder }}
                    >
                        <View style={[styles.reminderBox, wantReminder && styles.reminderBoxOn]} />
                        <Text style={styles.reminderText}>매일 아침 9시에 오늘 할 일을 알려드릴까요?</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.bottomBtnGroup}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Button title="이전" type="prev" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
                        <Button title="시작" onPress={handleStart} style={{ flex: 1 }} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.body },
    container: { flex: 1, padding: 18, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },

    content: { flex: 1, marginTop: 20 },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 30, color: theme.colors.text, lineHeight: 26, letterSpacing: -0.33 },

    previewContainer: { flex: 1 },

    reminderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    reminderBox: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
    reminderBoxOn: { backgroundColor: theme.colors.main, borderColor: theme.colors.main },
    reminderText: { flex: 1, fontSize: 13, color: theme.colors.text },
    bottomBtnGroup: { marginBottom: 20 }
});
