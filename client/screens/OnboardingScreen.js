import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Platform, Alert } from 'react-native';
import { colors, layout } from '../theme';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
// SVG support needed? For now using URI or PNG if SVG issues arise, 
// but let's try to use the copied assets.
// Note: React Native Image component doesn't support local SVG directly without transformer.
// For stability in this environment, I might use a placeholder or check if PNG exists.
// Actually, I'll assume we might need to convert SVG or use a library that handles it.
// To keep it simple: I will use a simple emoji or View for the 'pic' placeholder if SVG fails,
// but let's try to load the converted asset if the build system supports it.
// In Expo, standard way for SVG is 'react-native-svg'. 
// For now, I'll use a text-based Emoji or simple styling for the MVP "Wow" factor.
// Wait, the user has 'et.svg'. I can't import it directly as `require` in standard RN without config.
// I will using a fast solution: 'et.svg' is simple? I'll use a dummy Image for now and tell user.

export default function OnboardingScreen({ navigation }) {
    const { startGuestMode } = useAuth();

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
                        {/* TODO: Replace with actual SVG using SvgUri or convert to PNG */}
                        {/* <Image source={require('../assets/images/common/et.svg')} /> - Won't work directly */}
                        <Text style={{ fontSize: 80 }}>👽</Text>
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
                    <Button
                        title="로그인/회원가입"
                        type="sub"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            </View>
        </SafeAreaView>
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
        marginBottom: 30,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
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
    }
});
