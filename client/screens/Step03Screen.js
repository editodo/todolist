import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { layout } from '../theme';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import StepIndicator from '../components/StepIndicator';
import ThemePreview from '../components/ThemePreview';

export default function Step03Screen({ navigation }) {
    const { palette, setPalette, theme } = useTheme();

    const handleNext = () => {
        navigation.navigate('Step04');
    }

    const palettes = [
        { id: 'simple', label: '심플', c1: '#f5f5f5', c2: '#222' },
        { id: 'mincho', label: '민초', c1: '#D8F0EF', c2: '#997B6A' },
        { id: 'lemon', label: '레몬', c1: '#FFF3CA', c2: '#F3637D' },
        { id: 'green', label: '그린', c1: '#E9FFDF', c2: '#228262' },
        { id: 'pinky', label: '핑키', c1: '#FFD8E7', c2: '#FA6EA5' },
    ];

    const currentPaletteLabel = palettes.find(p => p.id === palette)?.label;

    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StepIndicator step={3} />

                <View style={styles.content}>
                    <Text style={styles.title}>
                        <Text style={{ color: theme.colors.main }}>{currentPaletteLabel}</Text> 테마의 추천 색상!{'\n'}
                        좋아하는 색상으로 골라봐요 :)
                    </Text>
                    <Text style={styles.subtitle}>
                        나중에 마이페이지에서 수정할 수 있어요.{'\n'}
                        [배경색/포인트색] 원하는 색상을 아래에서 골라봐요!
                    </Text>

                    <View style={styles.optionsRow}>
                        {palettes.map((p) => (
                            <TouchableOpacity
                                key={p.id}
                                style={[styles.itemBtn, palette === p.id && styles.itemBtnActive]}
                                onPress={() => setPalette(p.id)}
                            >
                                <View style={[styles.halfLeft, { backgroundColor: p.c1 }]} />
                                <View style={[styles.halfRight, { backgroundColor: p.c2 }]} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Preview Area */}
                    <View style={styles.previewContainer}>
                        <Text style={styles.caption}>테마 미리보기</Text>
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
                            title="다음"
                            onPress={handleNext}
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
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: theme.colors.text, lineHeight: 30 },
    subtitle: { fontSize: 13, color: theme.colors.guideText, marginBottom: 30, lineHeight: 18 },

    optionsRow: { flexDirection: 'row', gap: 8, marginBottom: 30 },
    itemBtn: {
        width: 60,
        height: 30,
        borderRadius: 6,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#BBB'
    },
    itemBtnActive: {
        borderWidth: 2,
        borderColor: theme.colors.main,
    },
    halfLeft: { flex: 1 },
    halfRight: { flex: 1 },


    previewContainer: { flex: 1 },
    caption: { fontSize: 12, color: theme.colors.subText, marginBottom: 5, fontWeight: '400' },

    bottomBtnGroup: { marginBottom: 20 }
});
