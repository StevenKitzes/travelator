const constants = {
    fileHeader: 'Travelator Itinerary',
    fileName: 'Travelator Itinerary.txt',
    fileSeparator:'+-----',
    badFileHeader: 'Error: unrecognized file header.',
    badFileSeparator: 'Error: unrecognized file format.',
    badFileContent: 'Error: unrecognized content formatting.',

    feedback: {
        none: 'none',
        success: 'success',
        failure: 'failure',
        warning: 'warning'
    },

    headerHeight: '15rem',

    colors: {
        light: {
            titleText: 'black',
            titleBg: 'rgba(255,255,255,.75)',
            footerBg: '#CFF',
            themeButtonText: 'white',
            themeButtonBg: 'rgba(0,0,0,.85)',
            text: 'black',
            darkText: 'black',
            object: '#CFF',
            heavy: '#AFF',
            bg: 'white',
            expandableBg: 'white',
            headerBg: '#EEE',
            headerText: 'black'
        },
        dark: {
            titleText: 'white',
            titleBg: 'rgba(0,0,0,.85)',
            footerBg: '#333',
            themeButtonText: 'black',
            themeButtonBg: 'rgba(255,255,255,.75)',
            text: 'white',
            darkText: 'black',
            object: '#333',
            heavy: '#111',
            bg: '#222',
            expandableBg: 'lightgray',
            headerBg: '#888',
            headerText: 'black'
        }
    },
    
    images: {
        light: {
            header: '/img/beach.jpg'
        },
        dark: {
            header: '/img/city.jpg'
        },
        caretBlack: '/img/caret-black.png',
        caretWhite: '/img/caret-white.png',
        iconClose: '/img/icon-close.png',
        iconUp: '/img/icon-up.png'
    },
    
    dark: 'dark',
    light: 'light',

    travelType: 'travel',
    travelSubtypes: [
        'airfare',
        'bicycle',
        'boat',
        'car',
        'motorcycle',
        'public',
        'rental',
        'rideshare',
        'taxi',
        'walk',
        'custom'
    ],
    
    lodgingType: 'lodging',
    lodgingSubtypes: [
        'camping',
        'couch',
        'hotel',
        'custom'
    ],
    
    activityType: 'activity',
    activitySubtypes: [
        'custom'
    ],
    
    foodType: 'food',
    foodSubtypes: [
        'bar',
        'cooking',
        'restaurant',
        'snacks',
        'custom'
    ]
};

export default constants;