import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ThemePreview({ theme }) {
    // theme object comes from ThemeContext structure:
    // { mode, colors: {...}, style: {...}, paletteName, themeName }

    // Mock Data for Preview
    const previewItems = [
        { text: "하루에 4번 사랑을 말하기", completed: true },
        { text: "밥 먹고 30분 산책 다녀오기", completed: false },
        { text: "8번 웃기", completed: true },
        { text: "키스 6번 하기", completed: false }
    ];

    const styles = getStyles(theme);
    const isSkitch = theme.themeName === 'skitch';
    const isKitsch = theme.themeName === 'kitsch';
    const isRound = theme.themeName === 'round';

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

    return (
        <View style={styles.container}>
            {previewItems.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                    {/* Checkbox */}
                    {(isSkitch || isKitsch) ? (
                        <Image
                            source={item.completed ? (isSkitch ? assets.skitch.on : assets.kitsch.on) : (isSkitch ? assets.skitch.off : assets.kitsch.off)}
                            style={isKitsch ? styles.kitschIcon : styles.skitchIcon}
                            resizeMode="contain"
                            tintColor={theme.colors.accent}
                        />
                    ) : (
                        <View style={[
                            styles.circle,
                            isRound && { borderRadius: 10 },
                            item.completed && { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }
                        ]}>
                            {item.completed && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                    )}

                    {/* Text Area */}
                    <View style={styles.textWrapper}>
                        <Text style={[
                            styles.text,
                            item.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
                        ]}>
                            {item.text}
                        </Text>

                        {(isSkitch || isKitsch) && !item.completed && (
                            <Image
                                source={isSkitch ? assets.skitch.line : assets.kitsch.line}
                                style={styles.underlineImage}
                                resizeMode="repeat"
                                tintColor={theme.colors.accent}
                            />
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
}

const getStyles = (theme) => {
    const c = theme.colors;
    const s = theme.style || {};

    return StyleSheet.create({
        container: {
            backgroundColor: c.base,
            borderRadius: s.borderRadius !== undefined ? s.borderRadius : 20,
            padding: 20,
            width: '100%',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
        },
        itemRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        circle: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#D9D9D9',
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkMark: {
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
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
        textWrapper: {
            flex: 1,
            position: 'relative',
        },
        text: {
            fontSize: 14,
            color: c.text,
            fontWeight: '500',
        },
        underlineImage: {
            position: 'absolute',
            bottom: -4,
            left: 0,
            width: '100%',
            height: 3,
            zIndex: -1,
        }
    });
};
