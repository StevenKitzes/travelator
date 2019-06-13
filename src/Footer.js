import React from 'react';

import CONSTANTS from './constants';

function Footer({theme}) {

    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    return (
        <div style={getFooterStyle(themeColors)}>
            <div style={getSeparatorStyle(themeColors)} />
            <p style={pStyle}>This spiffy travel planning helper brought to you free as Open Source Software under the MIT License!  :)  Yay!</p>
        </div>
    );
}

function getFooterStyle(colors) {
    return {
        backgroundColor: colors.footerBg,
        bottom: '0',
        color: colors.text,
        height: '3em',
        left: '0',
        position: 'fixed',
        width: '100%'
    };
}
function getSeparatorStyle(colors) {
    return {
        backgroundColor: colors.heavy,
        height: '.3em',
        left: '0',
        margin: '0'
    };
}
const pStyle = {
    marginTop: '.7em'
}

export default Footer;