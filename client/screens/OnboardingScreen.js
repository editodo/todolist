import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Animated, TouchableOpacity } from 'react-native';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import Svg, { Path } from 'react-native-svg';

// ET 에어리언 SVG 컴포넌트
const AlienIcon = () => (
    <Svg width="130" height="120" viewBox="0 0 130 120" fill="none">
        <Path d="M48.5666 95.8439C74.0162 95.8439 94.6472 74.9521 94.6472 49.1807C94.6472 23.4094 74.0162 2.51758 48.5666 2.51758C23.1171 2.51758 2.48613 23.4094 2.48613 49.1807C2.48613 74.9521 23.1171 95.8439 48.5666 95.8439Z" fill="#FBE2A8" stroke="#FBE2A8" strokeWidth="4" strokeMiterlimit="10" />
        <Path d="M27.7577 61.2651C29.2475 61.2651 30.4552 60.0421 30.4552 58.5335C30.4552 57.0249 29.2475 55.802 27.7577 55.802C26.2679 55.802 25.0602 57.0249 25.0602 58.5335C25.0602 60.0421 26.2679 61.2651 27.7577 61.2651Z" fill="#6D6A66" />
        <Path d="M56.1618 58.6342C57.6515 58.6342 58.8592 57.4112 58.8592 55.9026C58.8592 54.394 57.6515 53.1711 56.1618 53.1711C54.672 53.1711 53.4643 54.394 53.4643 55.9026C53.4643 57.4112 54.672 58.6342 56.1618 58.6342Z" fill="#6D6A66" />
        <Path d="M48.1937 64.0344C44.6758 66.6779 40.4618 67.2695 36.3721 65.6582C34.8805 65.0666 34.2341 67.5087 35.7133 68.0877C40.3251 69.9003 45.4838 69.1954 49.4492 66.2121C50.7171 65.2554 49.4741 63.0651 48.1937 64.0344Z" fill="#545256" />
        <Path d="M49.1758 116.727L32.9786 119.32C31.3004 119.585 29.7217 118.427 29.4607 116.727L24.4263 84.5022C24.1652 82.8029 25.3089 81.2042 26.987 80.9399L43.1842 78.3468C44.8623 78.0824 46.441 79.2405 46.702 80.9399L51.7365 113.165C52.0099 114.864 50.8663 116.463 49.1758 116.727Z" fill="#545256" stroke="#545256" strokeMiterlimit="10" />
        <Path d="M27.3226 62.0455C31.3253 62.0455 31.3253 55.7516 27.3226 55.7516C23.3199 55.7516 23.3075 62.0455 27.3226 62.0455Z" fill="#545256" />
        <Path d="M55.7889 59.2762C59.7915 59.2762 59.7915 52.9823 55.7889 52.9823C51.7862 52.9823 51.7738 59.2762 55.7889 59.2762Z" fill="#545256" />
        <Path d="M11.1876 78.5356C4.53719 82.4378 2.17536 91.7529 7.08548 98.0594C13.4127 106.191 26.266 107.337 35.3901 104.769C39.2436 103.686 37.6028 97.6062 33.7368 98.7013C27.6085 100.426 20.896 100.099 15.3022 96.8006C10.3299 93.8802 8.63932 87.2967 14.3326 83.9736C17.7883 81.9469 14.6682 76.509 11.1876 78.5356Z" fill="#FBE2A8" />
        <Path d="M69.5123 81.0532C72.7194 83.3568 77.2442 86.9569 75.0067 91.0228C73.2415 94.2453 68.0082 96.5992 64.8135 97.7447C59.0084 99.8217 48.9769 101.76 44.6013 95.8691C42.227 92.6718 36.8321 95.8062 39.2312 99.0412C46.6896 109.099 61.9296 106.783 71.6877 101.559C75.8893 99.3056 81.8187 95.0383 82.4278 89.8018C83.1115 83.8477 76.8713 78.6615 72.6449 75.6152C69.388 73.2739 66.2804 78.7244 69.5123 81.0532Z" fill="#FBE2A8" />
    </Svg>
);

// 체크 말풍선 SVG 컴포넌트
const CheckBubble = ({ animatedValue }) => {
    const animatedStyle = {
        opacity: animatedValue,
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            }
        ]
    };

    return (
        <Animated.View style={[styles.checkBubble, animatedStyle]}>
            <Svg width="58" height="52" viewBox="0 0 60 54" fill="none">
                <Path d="M44.2255 44.2329H5.08129C2.55786 44.2329 0.519226 42.1559 0.519226 39.6131V10.6988C0.519226 8.14351 2.57029 6.0791 5.08129 6.0791H44.2379C46.7613 6.0791 48.8 8.1561 48.8 10.6988V39.6131C48.8 42.1559 46.7489 44.2329 44.2255 44.2329Z" fill="#5AC1CC" stroke="#5AC1CC" strokeMiterlimit="10" />
                <Path d="M12.838 42.0426C12.751 44.1322 12.6391 47.9715 12.7883 50.0485C14.5286 48.626 16.1446 45.1266 17.2633 43.1629L12.838 42.0426Z" fill="#5AC1CC" />
                <Path d="M9.73034 42.0426C9.63089 44.6986 9.51901 47.3924 9.68061 50.0485C9.85464 52.843 12.9126 54.1018 14.9885 52.2765C17.2385 50.2876 18.5064 47.3421 19.9484 44.7616C20.9179 43.0244 20.0727 40.6453 18.0962 40.1418C16.6169 39.7642 15.1501 39.3866 13.6709 39.0089C9.79249 38.0145 8.13921 44.0944 12.0176 45.0763C13.4968 45.4539 14.9637 45.8315 16.4429 46.2092C15.8214 44.6734 15.1998 43.1251 14.5907 41.5894C13.4098 43.7042 12.4402 46.2092 10.6005 47.833C12.3656 48.5757 14.1432 49.3184 15.9084 50.0611C15.7344 47.405 15.8462 44.7112 15.9581 42.0552C16.0948 37.9893 9.8795 38.0019 9.73034 42.0426Z" fill="#5AC1CC" />
                <Path d="M58.1105 6.75883C58.4462 2.42861 55.1023 0.276087 51.2488 2.37826C46.6743 4.87065 42.9948 9.04982 39.6634 13.0024C38.7808 14.0472 30.8874 24.1175 29.9426 23.2993C25.4179 19.397 23.3171 15.671 17.3876 13.9843C12.4651 12.587 9.33256 18.5285 12.4154 22.8209C13.8698 24.8476 16.4802 26.635 18.3697 28.2966C30.0296 38.5432 30.0296 38.5432 37.227 32.3248C42.162 28.0575 47.1342 23.765 51.4353 18.818C54.1576 15.6836 57.402 11.6429 58.0484 7.38822C58.0732 7.17423 58.0981 6.96024 58.1105 6.75883Z" fill="white" stroke="#5AC1CC" strokeWidth="3" strokeMiterlimit="10" />
            </Svg>
        </Animated.View>
    );
};

export default function OnboardingScreen({ navigation }) {
    const { startGuestMode } = useAuth();
    const checkBubbleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 체크 말풍선 애니메이션 (fadeInUp 효과)
        Animated.timing(checkBubbleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleStartGuest = async () => {
        const result = await startGuestMode();
        if (result.success) {
            // New guests must go through Step 01-04
            if (result.isNew) {
                navigation.replace('Step01');
            } else {
                navigation.replace('MainTabs');
            }
        } else {
            Alert.alert('오류', '체험판 시작에 실패했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.picContainer}>
                        <AlienIcon />
                        <CheckBubble animatedValue={checkBubbleAnim} />
                    </View>

                    <Text style={styles.tit}>반가워요!</Text>

                    <Text style={styles.txt}>
                        쉽게 <Text style={styles.bold}>1분</Text>만 투자해서,{'\n'}
                        <Text style={styles.bold}>취향 저격</Text>인 <Text style={styles.mainColor}>나만의 EdiTodo</Text> 제작!
                    </Text>
                </View>

                <View style={styles.bottomBtnGroup}>
                    <Button
                        title="취향저격 투두리스트 체험판"
                        type="main"
                        onPress={handleStartGuest}
                    />
                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginLinkText}>아이디가 있다면? <Text style={styles.loginLinkActive}>로그인하기</Text></Text>
                    </TouchableOpacity>
                    <Text style={styles.copyright}>Copyright © 2026 Codemodo. All rights reserved.</Text>
                </View>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.body,
    },
    container: {
        flex: 1,
        paddingHorizontal: 18,
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center', // Center for Web
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    picContainer: {
        position: 'relative',
        marginBottom: 30,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBubble: {
        position: 'absolute',
        top: 15,
        right: 0,
        width: 58,
        height: 52,
    },
    tit: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    txt: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.subText,
        lineHeight: 24,
    },
    bold: {
        fontWeight: 'bold',
        color: colors.text,
    },
    mainColor: {
        color: colors.main,
        fontWeight: 'bold',
    },
    bottomBtnGroup: {
        width: '100%',
        alignItems: 'center',
    },
    loginLink: {
        marginTop: 15,
        padding: 5,
    },
    loginLinkText: {
        fontSize: 14,
        color: colors.subText,
    },
    loginLinkActive: {
        color: colors.main,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    copyright: {
        marginTop: 20,
        textAlign: 'center',
        color: '#ccc',
        fontSize: 10,
    }
});
