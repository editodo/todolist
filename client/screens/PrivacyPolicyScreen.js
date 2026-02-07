import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.date}>Last updated: February 07, 2026</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
                Welcome to EditoTodo ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                This Privacy Policy explains how we collect, use, and share your information when you use our mobile application and website.
            </Text>

            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.paragraph}>
                We collect information that you voluntarily provide to us when you register on the application, such as:
                {'\n'}- User Account Data: Email address, encrypted password.
                {'\n'}- User Content: Diary entries, todo items, and other text/media you input.
            </Text>

            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
                We use your personal information to:
                {'\n'}- Provide and manage your account.
                {'\n'}- Sync your data across devices.
                {'\n'}- Respond to user inquiries/support requests.
                {'\n'}- Send administrative information (updates, security alerts).
            </Text>

            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.paragraph}>
                We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                However, please also remember that no method of transmission over the internet, or method of electronic storage, is 100% secure.
            </Text>

            <Text style={styles.sectionTitle}>5. Contact Us</Text>
            <Text style={styles.paragraph}>
                If you have questions or comments about this policy, you may email us at:
                {'\n'}admin@editodo.com
            </Text>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: colors.main,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        color: '#444',
    },
});
