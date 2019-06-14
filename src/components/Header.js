import React from 'react';

import CONSTANTS from './../constants';

function Header({theme, setTheme}) {

    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    function toggleTheme() {
        setTheme(theme === CONSTANTS.dark ? CONSTANTS.light : CONSTANTS.dark);
    }

    return(
        <div style={headerContainerStyle}>
            <img
                alt='A lovely header'
                style={headerImageStyle}
                src={theme === CONSTANTS.dark ?
                    CONSTANTS.images.dark.header :
                    CONSTANTS.images.light.header}
            />
            <span style={getTitleStyle(themeColors)}>Travelator</span>
            <button style={getThemeButtonStyle(themeColors)} onClick={toggleTheme}>Switch theme</button>
        </div>
    );
};

const headerContainerStyle = {
    height: '15em',
    left: '0',
    position: 'fixed',
    top: '0'
}
function getThemeButtonStyle(theme) {
    return {
        backgroundColor: theme.themeButtonBg,
        borderRadius: '0 0 0 1em',
        borderStyle: 'none',
        color: theme.themeButtonText,
        cursor: 'pointer',
        padding: '.2em .4em .3em .6em',
        position: 'fixed',
        right: '0',
        top: '0'
    };
}
const headerImageStyle = {
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0'
}
function getTitleStyle(theme) {
    return {
        backgroundColor: theme.titleBg,
        bottom: '.7em',
        color: theme.titleText,
        fontSize: '2em',
        fontWeight: '900',
        left: '.7em',
        padding: '.2em .5em',
        position: 'absolute'
    };
}

export default Header;