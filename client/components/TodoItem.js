import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Standard to-do row: checkbox toggles done, tapping the text edits it in place, ✕ deletes
// (the screen shows an undo toast instead of a confirm dialog). No menus, modals or dimmed backdrops.
export default function TodoItem({ id, text, isCompleted, onToggle, onEdit, onDelete }) {
    const { theme } = useTheme();
    const colors = theme.colors;
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(text);
    const editing = useRef(false); // Enter and blur both fire saveEdit; save once

    const startEdit = () => {
        setDraft(text);
        editing.current = true;
        setIsEditing(true);
    };

    const saveEdit = () => {
        if (!editing.current) return;
        editing.current = false;
        setIsEditing(false);
        const next = draft.trim();
        if (next && next !== text) onEdit(id, next); // emptied → keep the original text
    };

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
                    resizeMode="contain"
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
                style={styles.checkboxHit}
                onPress={() => onToggle(id)}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isCompleted }}
                accessibilityLabel={text}
            >
                {renderCheckbox()}
            </TouchableOpacity>

            {isEditing ? (
                <TextInput
                    style={[styles.editInput, { color: colors.text, borderColor: colors.accent }]}
                    value={draft}
                    onChangeText={setDraft}
                    onSubmitEditing={saveEdit}
                    onBlur={saveEdit}
                    autoFocus
                    returnKeyType="done"
                    maxLength={500}
                    accessibilityLabel="할 일 수정"
                />
            ) : (
                <TouchableOpacity style={styles.textWrapper} onPress={startEdit} activeOpacity={0.6} accessibilityHint="눌러서 수정">
                    <Text style={[
                        styles.text,
                        { color: colors.text },
                        isCompleted && { color: colors.checkboxCheckedLabel || colors.guideText, textDecorationLine: 'line-through' }
                    ]}>
                        {text}
                    </Text>

                    {/* Skitch/Kitsch Underline */}
                    {(isSkitch || isKitsch) && !isCompleted && (
                        <Image
                            source={isSkitch ? assets.skitch.line : assets.kitsch.line}
                            style={styles.underlineImage}
                            resizeMode="repeat"
                            tintColor={colors.accent}
                        />
                    )}
                </TouchableOpacity>
            )}

            {!isEditing && (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(id)} accessibilityRole="button" accessibilityLabel={`${text} 삭제`}>
                    <Text style={[styles.deleteText, { color: colors.guideText }]}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    checkboxHit: {
        paddingVertical: 4,
        paddingRight: 2,
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
        height: 3,
        zIndex: 0,
    },
    deleteBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    deleteText: { fontSize: 14 },
    editInput: { flex: 1, fontSize: 15, borderBottomWidth: 1, paddingVertical: 4, marginRight: 8 }
});
