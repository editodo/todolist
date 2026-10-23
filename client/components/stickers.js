// Daily-record stickers. The id (e.g. 'emoji_3') is what the server stores in diaries.emotion.
export const STICKERS = [
    { id: 'emoji_1', source: require('../assets/images/emoji/emoji_1.png') },
    { id: 'emoji_2', source: require('../assets/images/emoji/emoji_2.png') },
    { id: 'emoji_3', source: require('../assets/images/emoji/emoji_3.png') },
    { id: 'emoji_4', source: require('../assets/images/emoji/emoji_4.png') },
    { id: 'emoji_5', source: require('../assets/images/emoji/emoji_5.png') },
    { id: 'emoji_6', source: require('../assets/images/emoji/emoji_6.png') },
    { id: 'emoji_7', source: require('../assets/images/emoji/emoji_7.png') },
    { id: 'emoji_8', source: require('../assets/images/emoji/emoji_8.png') },
    { id: 'emoji_9', source: require('../assets/images/emoji/emoji_9.png') },
    { id: 'emoji_10', source: require('../assets/images/emoji/emoji_10.png') },
    { id: 'emoji_11', source: require('../assets/images/emoji/emoji_11.png') },
    { id: 'emoji_12', source: require('../assets/images/emoji/emoji_12.png') },
    { id: 'emoji_13', source: require('../assets/images/emoji/emoji_13.png') },
    { id: 'emoji_14', source: require('../assets/images/emoji/emoji_14.png') },
    { id: 'emoji_15', source: require('../assets/images/emoji/emoji_15.png') },
    { id: 'emoji_16', source: require('../assets/images/emoji/emoji_16.png') },
];

export const STICKER_MAP = Object.fromEntries(STICKERS.map((s) => [s.id, s.source]));
