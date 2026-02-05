import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { layout } from '../theme';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';
import ThemePreview from '../components/ThemePreview';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function Step04Screen({ navigation }) {
    const { theme, mode, themeStyle, palette } = useTheme();
    const { user } = useAuth();

    const handleStart = async () => {
        try {
            // Save preferences to DB
            if (user?.id) {
                await fetch(`${API_URL}/api/preferences`, {
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
                <StepIndicator step={4} />

                <View style={styles.content}>
                    <Text style={styles.title}>나만의 Todolist 생성 완료!{'\n'}아래의 테마가 맞는지 확인해 주세요.</Text>

                    {/* Final Preview */}
                    <View style={styles.previewContainer}>
                        <ThemePreview theme={theme} />
                    </View>
                </View>

                <View style={styles.bottomBtnGroup}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Button
                            title="이전"
                            type="sub"
                            onPress={() => navigation.goBack()}
                            style={{ flex: 1, backgroundColor: '#EEEEEE', borderColor: '#EEE' }}
                            textStyle={{ color: '#888' }}
                        />
                        <Button
                            title="시작"
                            onPress={handleStart}
                            style={{ flex: 2 }}
                        />
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
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, color: theme.colors.text, lineHeight: 30 },

    previewContainer: { flex: 1 },

    bottomBtnGroup: { marginBottom: 20 }
});
