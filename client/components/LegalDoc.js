import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, layout } from '../theme';
import Header from './Header';

// Shared layout for the privacy policy and terms: a back header plus titled sections.
export default function LegalDoc({ navigation, title, effectiveDate, sections }) {
    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={title}
                leftButton={navigation.canGoBack() ? (
                    <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>{'<'}</Text></TouchableOpacity>
                ) : null}
            />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.date}>시행일: {effectiveDate}</Text>
                {sections.map(([heading, body]) => (
                    <View key={heading || 'intro'}>
                        {heading ? <Text style={styles.sectionTitle}>{heading}</Text> : null}
                        <Text selectable style={styles.paragraph}>{body}</Text>
                    </View>
                ))}
                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        maxWidth: layout.maxWidth,
        width: '100%',
        alignSelf: 'center',
    },
    back: { fontSize: 24, padding: 5, color: colors.text },
    content: { padding: 20 },
    date: { fontSize: 13, color: '#666', marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: colors.main },
    paragraph: { fontSize: 14, lineHeight: 22, color: '#444' },
});
