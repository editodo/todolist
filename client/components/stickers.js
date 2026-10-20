// Daily-record stickers. The id (e.g. 'emoji_3') is what the server stores in diaries.emotion.
export const STICKERS = [
    { id: 'emoji_1', source: require('../assets/images/emoji/emoji_1.svg') },
    { id: 'emoji_2', source: require('../assets/images/emoji/emoji_2.svg') },
    { id: 'emoji_3', source: require('../assets/images/emoji/emoji_3.svg') },
    { id: 'emoji_4', source: require('../assets/images/emoji/emoji_4.svg') },
    { id: 'emoji_5', source: require('../assets/images/emoji/emoji_5.svg') },
    { id: 'emoji_6', source: require('../assets/images/emoji/emoji_6.svg') },
    { id: 'emoji_7', source: require('../assets/images/emoji/emoji_7.svg') },
    { id: 'emoji_8', source: require('../assets/images/emoji/emoji_8.svg') },
    { id: 'emoji_9', source: require('../assets/images/emoji/emoji_9.svg') },
    { id: 'emoji_10', source: require('../assets/images/emoji/emoji_10.svg') },
    { id: 'emoji_11', source: require('../assets/images/emoji/emoji_11.svg') },
    { id: 'emoji_12', source: require('../assets/images/emoji/emoji_12.svg') },
    { id: 'emoji_13', source: require('../assets/images/emoji/emoji_13.svg') },
    { id: 'emoji_14', source: require('../assets/images/emoji/emoji_14.svg') },
    { id: 'emoji_15', source: require('../assets/images/emoji/emoji_15.svg') },
    { id: 'emoji_16', source: require('../assets/images/emoji/emoji_16.svg') },
];

export const STICKER_MAP = Object.fromEntries(STICKERS.map((s) => [s.id, s.source]));
