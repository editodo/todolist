import React from 'react';
import { FlexWidget, TextWidget, ListWidget, SvgWidget } from 'react-native-android-widget';
import { t } from '../i18n';

// Android home-screen widget: today's to-dos. Tap a row to check it off, the header to open the app.
// state: { status: 'signedOut' } | { status: 'ok', date: 'YYYY-MM-DD', items: [{ id, text, isCompleted, repeat }] }

const PALETTES = {
    light: { bg: '#FFFFFF', text: '#222222', sub: '#888888', done: '#AAAAAA', accent: '#5FBECA', line: '#EEEEEE' },
    dark: { bg: '#1E1E1E', text: '#F2F2F2', sub: '#9A9A9A', done: '#666666', accent: '#5FBECA', line: '#333333' },
};
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const box = (checked, c) => (checked
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="5" fill="${c.accent}"/><path d="M5.5 10.5l3 3 6-7" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="1.5" y="1.5" width="17" height="17" rx="5" fill="none" stroke="${c.sub}" stroke-width="1.6"/></svg>`);

function Header({ c, state }) {
    let right = '';
    if (state.status === 'ok') {
        const [y, m, d] = state.date.split('-').map(Number);
        const day = WEEK[new Date(y, m - 1, d).getDay()];
        const done = state.items.filter((i) => i.isCompleted).length;
        right = `${m}.${d}(${t(day)})  ${done}/${state.items.length}`;
    }
    return (
        <FlexWidget
            clickAction="OPEN_APP"
            style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: c.line }}
        >
            <TextWidget text={t('오늘 할 일')} style={{ fontSize: 15, fontWeight: 'bold', color: c.text }} />
            <TextWidget text={right} style={{ fontSize: 12, color: c.sub }} />
        </FlexWidget>
    );
}

function Message({ c, text }) {
    return (
        <FlexWidget clickAction="OPEN_APP" style={{ width: 'match_parent', height: 'match_parent', justifyContent: 'center', alignItems: 'center' }}>
            <TextWidget text={text} style={{ fontSize: 13, color: c.sub }} />
        </FlexWidget>
    );
}

function Body({ c, state }) {
    if (state.status !== 'ok') return <Message c={c} text={t('EdiTodo를 열어 시작해 주세요')} />;
    if (state.items.length === 0) return <Message c={c} text={t('오늘 할 일이 없어요 · 눌러서 추가')} />;
    return (
        <ListWidget style={{ width: 'match_parent', height: 'match_parent' }}>
            {state.items.map((item) => (
                <FlexWidget
                    key={String(item.id)}
                    clickAction="TOGGLE"
                    clickActionData={{ id: item.id }}
                    style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', paddingVertical: 7 }}
                >
                    <SvgWidget svg={box(item.isCompleted, c)} style={{ width: 18, height: 18, marginRight: 10 }} />
                    <TextWidget
                        text={item.text + (item.repeat ? '  ↻' : '')}
                        maxLines={1}
                        truncate="END"
                        style={{ fontSize: 14, color: item.isCompleted ? c.done : c.text }}
                    />
                </FlexWidget>
            ))}
        </ListWidget>
    );
}

function Widget({ c, state }) {
    return (
        <FlexWidget style={{ width: 'match_parent', height: 'match_parent', backgroundColor: c.bg, borderRadius: 18, padding: 14 }}>
            <Header c={c} state={state} />
            <FlexWidget style={{ width: 'match_parent', flex: 1, paddingTop: 4 }}>
                <Body c={c} state={state} />
            </FlexWidget>
        </FlexWidget>
    );
}

export function TodayWidget(state) {
    return { light: <Widget c={PALETTES.light} state={state} />, dark: <Widget c={PALETTES.dark} state={state} /> };
}
