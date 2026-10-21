import { API_URL, KAKAO_REST_API_KEY } from './config';

export const kakaoEnabled = Boolean(KAKAO_REST_API_KEY);

const base64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const kakaoAuthorizeUrl = (state, challenge) => 'https://kauth.kakao.com/oauth/authorize?' + new URLSearchParams({
    response_type: 'code',
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: `${API_URL}/api/auth/kakao/callback`,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
});

// Web: Kakao login in a popup, so the page (and a guest's session) stays put. The server callback page
// posts the one-time code back to this window. Resolves { code, codeVerifier }, or null when closed.
export function kakaoAuthorize() {
    const popup = window.open('', 'kakao_login', 'width=480,height=720'); // opened synchronously so it isn't blocked
    if (!popup) return Promise.reject(new Error('popup blocked'));
    const codeVerifier = `${crypto.randomUUID()}${crypto.randomUUID()}`;
    const state = `${crypto.randomUUID()}.web`;
    return new Promise((resolve, reject) => {
        const done = (fn, value) => { window.removeEventListener('message', onMessage); clearInterval(timer); fn(value); };
        const onMessage = (e) => {
            if (e.origin !== new URL(API_URL).origin || e.data?.type !== 'kakao') return;
            if (e.data.state !== state) return done(reject, new Error('state mismatch'));
            if (!e.data.code) return e.data.error === 'access_denied' ? done(resolve, null) : done(reject, new Error(e.data.error || 'no code'));
            done(resolve, { code: e.data.code, codeVerifier });
        };
        window.addEventListener('message', onMessage);
        const timer = setInterval(() => { if (popup.closed) done(resolve, null); }, 500);
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
            .then((hash) => { popup.location.href = kakaoAuthorizeUrl(state, base64url(hash)); })
            .catch((err) => { popup.close(); done(reject, err); });
    });
}
