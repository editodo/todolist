import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput } from './AppText';
import { colors } from '../theme';

// Admin (web only): manage the 글꼴 변경 catalog — register a web font URL, upload a font file, delete.
export default function AdminFonts() {
    const [fonts, setFonts] = useState([]);
    const [webName, setWebName] = useState('');
    const [webUrl, setWebUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [notice, setNotice] = useState(null); // { text, error }
    const [busy, setBusy] = useState(false);

    const load = () => fetch('/api/fonts').then((r) => r.json()).then(setFonts).catch(() => setFonts([]));
    useEffect(() => { load(); }, []);

    const done = async (res, okText) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok) { setNotice({ text: okText }); load(); return true; }
        setNotice({ text: data.error || `실패 (${res.status})`, error: true });
        return false;
    };

    const addWeb = async () => {
        setBusy(true);
        const res = await fetch('/api/admin/fonts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: webName.trim(), url: webUrl.trim() }),
        });
        if (await done(res, '웹폰트를 추가했어요.')) { setWebName(''); setWebUrl(''); }
        setBusy(false);
    };

    const upload = async () => {
        if (!file) return setNotice({ text: '글꼴 파일을 선택해주세요.', error: true });
        setBusy(true);
        const res = await fetch('/api/admin/fonts/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'x-font-name': encodeURIComponent(fileName.trim()),
                'x-file-name': encodeURIComponent(file.name),
            },
            body: file,
        });
        if (await done(res, '글꼴 파일을 올렸어요.')) { setFileName(''); setFile(null); }
        setBusy(false);
    };

    const remove = async (f) => {
        if (!window.confirm(`'${f.name}' 글꼴을 삭제할까요? 이 글꼴을 쓰던 사용자는 기본 글씨체로 바뀝니다.`)) return;
        await done(await fetch(`/api/admin/fonts/${f.id}`, { method: 'DELETE' }), '삭제했어요.');
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {notice && <Text style={[styles.notice, notice.error && styles.noticeError]}>{notice.text}</Text>}

            <Text style={styles.section}>웹폰트 추가</Text>
            <Text style={styles.help}>글꼴 파일(.ttf .otf .woff .woff2)로 바로 연결되는 https 주소. 예: https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/jua/Jua-Regular.ttf (Google Fonts CSS 주소는 안 됩니다)</Text>
            <TextInput style={styles.input} placeholder="표시 이름 (예: 주아)" value={webName} onChangeText={setWebName} />
            <TextInput style={styles.input} placeholder="https://..../Font.ttf" value={webUrl} onChangeText={setWebUrl} autoCapitalize="none" />
            <TouchableOpacity style={styles.btn} onPress={busy ? undefined : addWeb}><Text style={styles.btnText}>웹폰트 추가</Text></TouchableOpacity>

            <Text style={styles.section}>글꼴 파일 업로드</Text>
            <Text style={styles.help}>.ttf .otf .woff .woff2, 15MB 이하. 상업적 이용·앱 배포가 허용된 글꼴만 올려주세요.</Text>
            <TextInput style={styles.input} placeholder="표시 이름 (예: 미네 주인체)" value={fileName} onChangeText={setFileName} />
            {/* Admin is web-only, so a plain browser file input is fine here */}
            <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ margin: '6px 0 10px' }} />
            <TouchableOpacity style={styles.btn} onPress={busy ? undefined : upload}><Text style={styles.btnText}>업로드</Text></TouchableOpacity>

            <Text style={styles.section}>등록된 글꼴 ({fonts.length})</Text>
            {fonts.map((f) => (
                <View key={f.id} style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.rowName}>{f.name} <Text style={styles.badge}>{f.source === 'upload' ? '업로드' : '웹폰트'}</Text></Text>
                        <Text style={styles.rowUrl} numberOfLines={1}>{f.url}</Text>
                    </View>
                    <TouchableOpacity onPress={() => remove(f)}><Text style={styles.del}>삭제</Text></TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    notice: { padding: 10, borderRadius: 6, backgroundColor: '#eef8f9', color: colors.text, marginBottom: 10 },
    noticeError: { backgroundColor: '#fdf0ef', color: '#c0392b' },
    section: { marginTop: 18, marginBottom: 6, fontSize: 15, fontWeight: '700', color: colors.text },
    help: { fontSize: 12, color: '#888', marginBottom: 8, lineHeight: 18 },
    input: { height: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, paddingHorizontal: 12, marginBottom: 8, backgroundColor: '#fff' },
    btn: { height: 40, borderRadius: 5, backgroundColor: colors.main, justifyContent: 'center', alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee', gap: 10 },
    rowName: { fontSize: 14, color: colors.text },
    badge: { fontSize: 11, color: '#888' },
    rowUrl: { fontSize: 11, color: '#999', marginTop: 2 },
    del: { color: '#e05555', fontSize: 13 },
});
