import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { API_URL, KAKAO_REST_API_KEY } from './config';

export const kakaoEnabled = Boolean(KAKAO_REST_API_KEY);

const base64url = (b64) => b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const kakaoAuthorizeUrl = (state, challenge) => 'https://kauth.kakao.com/oauth/authorize?' + [
    ['response_type', 'code'],
    ['client_id', KAKAO_REST_API_KEY],
    ['redirect_uri', `${API_URL}/api/auth/kakao/callback`],
    ['state', state],
    ['code_challenge', challenge],
    ['code_challenge_method', 'S256'],
].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

// Kakao login in an in-app browser. The server bounces the one-time code to editodo://auth/kakao.
// Resolves { code, codeVerifier }, or null when the user closed the window.
export async function kakaoAuthorize() {
    const codeVerifier = `${Crypto.randomUUID()}${Crypto.randomUUID()}`;
    const challenge = base64url(await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, codeVerifier, { encoding: Crypto.CryptoEncoding.BASE64 }));
    const state = `${Crypto.randomUUID()}.app`; // ".app" tells the server callback to redirect to the app scheme
    const result = await WebBrowser.openAuthSessionAsync(kakaoAuthorizeUrl(state, challenge), 'editodo://auth/kakao');
    if (result.type !== 'success') return null;
    const query = Object.fromEntries((result.url.split('?')[1] || '').split('&').filter(Boolean)
        .map((p) => p.split('=').map((x) => decodeURIComponent(x.replace(/\+/g, ' ')))));
    if (query.state !== state) throw new Error('state mismatch');
    if (query.error === 'access_denied') return null;
    if (!query.code) throw new Error(query.error || 'no code');
    return { code: query.code, codeVerifier };
}
