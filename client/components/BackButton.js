import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';

// The one back control for every header: ← icon, theme text color, 44pt touch target.
export default function BackButton({ onPress, label }) {
    const color = useTheme()?.theme?.colors?.text || '#222222';
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.btn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel={label || t('뒤로')}
        >
            <Ionicons name="arrow-back" size={22} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: { width: 44, height: 44, justifyContent: 'center', marginLeft: -10 },
});
