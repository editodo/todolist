import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import { layout } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { t, LANGUAGES } from '../i18n';
import BackButton from '../components/BackButton';

// 언어: follow the device, or force 한국어 / English. Applying redraws every screen in the new language.
export default function LanguageSettingsScreen({ navigation }) {
    const { theme, language, setLanguage } = useTheme();
    const styles = getStyles(theme);
    const [selected, setSelected] = useState(language); // null = device language
    const options = [{ id: null, label: t('휴대폰 설정 따르기') }, ...LANGUAGES];

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={t('언어')}
                leftButton={<BackButton onPress={() => navigation.goBack()} />}
            />
            <View style={styles.body}>
                {options.map((o) => {
                    const active = selected === o.id;
                    return (
                        <TouchableOpacity
                            key={String(o.id)}
                            style={styles.row}
                            onPress={() => setSelected(o.id)}
                            accessibilityRole="radio"
                            accessibilityState={{ selected: active }}
                        >
                            <Text style={styles.rowText}>{o.label}</Text>
                            <View style={[styles.radio, active && styles.radioOn]}>{active && <View style={styles.radioDot} />}</View>
                        </TouchableOpacity>
                    );
                })}
                <Button title={t('적용하기')} onPress={() => { navigation.goBack(); setLanguage(selected); }} style={{ marginTop: 30 }} />
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.body, maxWidth: layout.maxWidth, width: '100%', alignSelf: 'center' },
    back: { fontSize: 24, padding: 5, color: theme.colors.text },
    body: { paddingHorizontal: 18, paddingTop: 10 },
    row: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    rowText: { fontSize: 14, color: theme.colors.text },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.fnb, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    radioOn: { backgroundColor: theme.colors.main, borderColor: theme.colors.main },
    radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});
