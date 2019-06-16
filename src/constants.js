const constants = {
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
            bg: 'white'
        },
        dark: {
            titleText: 'white',
            titleBg: 'rgba(0,0,0,.85)',
            footerBg: '#333',
            themeButtonText: 'black',
            themeButtonBg: 'rgba(255,255,255,.75)',
            text: 'white',
            darkText: 'black',
            object: 'white',
            heavy: '#111',
            bg: '#222'
        }
    },
    images: {
        light: {
            header: '/img/beach.jpg'
        },
        dark: {
            header: '/img/city.jpg'
        },
        iconClose: '/img/icon-close.png',
        iconUp: '/img/icon-up.png'
    },
    
    dark: 'dark',
    light: 'light',

    travelType: 'travelType',
    travelSubtypes: {
        airfare: 'airfare',
        bicycle: 'bicycle',
        car: 'car',
        motorcycle: 'motorcycle',
        rental: 'rental',
        rideshare: 'rideshare',
        walk: 'walk',
        custom: 'custom'
    },
    
    lodgingType: 'lodgingType',
    lodgingSubtypes: {
        camping: 'camping',
        couch: 'couch',
        hotel: 'hotel',
        custom: 'custom'
    },
    
    activityType: 'activityType',
    activitySubtypes: {
        custom: 'custom'
    },
    
    foodType: 'foodType',
    foodSubTypes: {
        bar: 'bar',
        cooking: 'cooking',
        restaurant: 'restaurant',
        snacks: 'snacks',
        custom: 'custom'
    }
};

export default constants;