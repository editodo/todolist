import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TodoItem({ id, text, isCompleted, onToggle, onMore }) {
    const { theme } = useTheme();
    const colors = theme.colors;

    // Determine Theme Styles
    const isRound = theme.themeName === 'round';
    const isSkitch = theme.themeName === 'skitch';
    const isKitsch = theme.themeName === 'kitsch';

    // Asset Map
    const assets = {
        skitch: {
            off: require('../assets/images/common/check_skitch.svg'),
            on: require('../assets/images/common/checked_skitch.svg'),
            line: require('../assets/images/common/line_skitch.svg')
        },
        kitsch: {
            off: require('../assets/images/common/check_kitsch.svg'),
            on: require('../assets/images/common/checked_kitsch.svg'),
            line: require('../assets/images/common/line_kitsch.svg')
        }
    };

    const renderCheckbox = () => {
        if (isSkitch || isKitsch) {
            const currentAssets = isSkitch ? assets.skitch : assets.kitsch;
            return (
                <Image
                    source={isCompleted ? currentAssets.on : currentAssets.off}
                    style={isKitsch ? styles.kitschIcon : styles.skitchIcon}
                    tintColor={colors.accent}
                />
            );
        }

        return (
            <View style={[
                styles.checkbox,
                { borderColor: colors.checkboxLabel || colors.border },
                isRound && { borderRadius: 10 },
                isCompleted && {
                    backgroundColor: colors.accent,
                    borderColor: colors.accent
                }
            ]}>
                {isCompleted && <Text style={[styles.checkMark, { color: colors.base }]}>✓</Text>}
            </View>
        );
    };

    return (
        <View style={[styles.container, { borderBottomColor: colors.border, backgroundColor: colors.base }]}>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onToggle(id ? id : null)}
                activeOpacity={0.8}
            >
                {renderCheckbox()}

                <View style={styles.textWrapper}>
                    <Text style={[
                        styles.text,
                        { color: colors.text },
                        isCompleted && { color: colors.checkboxCheckedLabel || colors.guideText, textDecorationLine: 'line-through' }
                    ]}>
                        {text}
                    </Text>

                    {/* Skitch/Kitsch Underline */}
                    {(isSkitch || isKitsch) && isCompleted && (
                        <Image
                            source={isSkitch ? assets.skitch.line : assets.kitsch.line}
                            style={styles.underlineImage}
                            resizeMode="repeat"
                            tintColor={colors.accent}
                        />
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreBtn} onPress={() => onMore(id)}>
                <View style={[styles.moreDot, { backgroundColor: colors.guideText }]} />
                <View style={[styles.moreDot, { backgroundColor: colors.guideText }]} />
                <View style={[styles.moreDot, { backgroundColor: colors.guideText }]} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    checkboxContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skitchIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    kitschIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    checkMark: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    textWrapper: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
        zIndex: 1,
    },
    underlineImage: {
        position: 'absolute',
        bottom: -5,
        left: 0,
        width: '100%',
        height: 4,
        zIndex: 0,
    },
    moreBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
        gap: 2
    },
    moreDot: {
        width: 3, height: 3, borderRadius: 1.5,
    }
});
