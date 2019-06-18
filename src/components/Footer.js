import React from 'react';

import CONSTANTS from './../constants';

function Footer({theme}) {

    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    return (
        <div style={getFooterStyle(themeColors)}>
            <div style={getSeparatorStyle(themeColors)} />
            <span>
                This spiffy travel planning helper brought to you free as Open Source Software under the MIT License!  :)  Yay!
            </span><br />
            <span>
                Icons made by Egor Rumyantsev, Gregor Cresnar, Google, and Freepik from <a target="_blank" href='https://www.flaticon.com'>www.flaticon.com</a>
            </span>
        </div>
    );
}

function getFooterStyle(colors) {
    return {
        backgroundColor: colors.footerBg,
        bottom: '0',
        color: colors.text,
        fontSize: '.6rem',
        // height: '3em',
        left: '0',
        lineHeight: '.75rem',
        paddingBottom: '.25rem',
        position: 'fixed',
        width: '100%'
    };
}
function getSeparatorStyle(colors) {
    return {
        backgroundColor: colors.heavy,
        height: '.3em',
        left: '0',
        margin: '0 0 .25rem 0'
    };
}

export default Footer;