import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { Text } from './AppText';
import { t } from '../i18n';

const UNDO_MS = 4000;

// Delete with undo instead of a confirm dialog: the item leaves the list at once and the real
// delete runs after UNDO_MS unless the user taps 되돌리기. Leaving the screen, switching date
// (call flush first) or backgrounding the app commits the delete immediately so nothing is lost or resurrected.
export function useUndoDelete(setItems, commitDelete) {
    const [pending, setPending] = useState(null); // { item, index }
    const pendingRef = useRef(null);
    const timer = useRef(null);
    const commitRef = useRef(commitDelete);
    commitRef.current = commitDelete;

    const flush = async () => {
        clearTimeout(timer.current);
        const p = pendingRef.current;
        pendingRef.current = null;
        setPending(null);
        if (p) await commitRef.current(p.item);
    };

    const remove = (items, id) => {
        const index = items.findIndex((t) => t.id === id);
        if (index < 0) return;
        flush(); // only one undo at a time: an earlier pending delete is committed now
        const p = { item: items[index], index };
        pendingRef.current = p;
        setPending(p);
        setItems((prev) => prev.filter((t) => t.id !== id));
        timer.current = setTimeout(flush, UNDO_MS);
    };

    const undo = () => {
        clearTimeout(timer.current);
        const p = pendingRef.current;
        pendingRef.current = null;
        setPending(null);
        if (p) setItems((prev) => [...prev.slice(0, p.index), p.item, ...prev.slice(p.index)]);
    };

    useEffect(() => {
        const sub = AppState.addEventListener('change', (state) => {
            if (state !== 'active') flush();
        });
        return () => {
            sub.remove();
            flush();
        };
    }, []);

    return { pending, remove, undo, flush };
}

export default function UndoToast({ visible, message, onUndo, bottom = 16 }) {
    if (!visible) return null;
    return (
        <View style={[styles.toast, { bottom }]} accessibilityLiveRegion="polite">
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity onPress={onUndo} accessibilityRole="button" style={styles.undoBtn}>
                <Text style={styles.undoText}>{t('되돌리기')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    message: { color: '#fff', fontSize: 14 },
    undoBtn: { paddingLeft: 12, paddingVertical: 2 },
    undoText: { color: '#7fdbe4', fontSize: 14, fontWeight: 'bold' },
});
