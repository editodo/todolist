import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Sprite Sheet Configuration
// 4 Rows x 4 Columns
const TOTAL_COLS = 4;
const TOTAL_ROWS = 4;

// Mapping Mood Names to Grid Coordinates [Row, Col]
const MOOD_MAP = {
    'smile': [0, 0],
    'grin': [0, 1],
    'wink': [0, 2],
    'sad': [0, 3],

    'angry': [1, 0],
    'surprised': [1, 1], // or awkward
    'laugh': [1, 2],
    'love': [1, 3],

    'sleep': [2, 0],
    'tongue': [2, 1],
    'question': [2, 2],
    'worried': [2, 3],

    'thinking': [3, 0],
    'neutral': [3, 1],
    'tired': [3, 2],
    'shocked': [3, 3],
};

const EmotionIcon = ({ mood, size = 32 }) => {
    // Default to 'smile' if mood not found or index provided directly
    let coords = MOOD_MAP[mood] || MOOD_MAP['smile'];

    // Allow passing index directly [row, col]
    if (Array.isArray(mood)) {
        coords = mood;
    }

    const [row, col] = coords;

    // The logic involves shifting the image so the correct "window" is visible.
    // Window Size: 'size' (e.g., 32px)
    // Full Image Scaled Size should be: Width = size * TOTAL_COLS, Height = size * TOTAL_ROWS
    // Top Position: -(row * size)
    // Left Position: -(col * size)

    const imgWidth = size * TOTAL_COLS;
    const imgHeight = size * TOTAL_ROWS;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Image
                source={require('../assets/emotions.jpg')}
                style={{
                    width: imgWidth,
                    height: imgHeight,
                    position: 'absolute',
                    top: -(row * size), // row * size
                    left: -(col * size), // col * size
                }}
                resizeMode="stretch"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden', // Masking effect
        // borderRadius: 999, // Optional: if circular masking is needed
    }
});

export default EmotionIcon;
export { MOOD_MAP };
