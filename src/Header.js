import React from 'react';

function Header(props) {
    let theme = props.theme;

    function toggleTheme() {
        props.setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return(
        <div style={headerContainerStyle}>
            <img alt='A lovely header' style={headerImageStyle} src={theme === 'dark' ? '/img/city.jpg' : '/img/beach.jpg'} />
            <span style={getTitleStyle(theme)}>Travelator</span>
            <button style={getThemeButtonStyle(theme)} onClick={toggleTheme}>Switch theme</button>
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
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,.75)': 'rgba(0,0,0,.85)',
        borderStyle: 'none',
        color: theme === 'dark' ? 'black' : 'white',
        cursor: 'pointer',
        padding: '.2em .4em',
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
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,.75)',
        bottom: '.7em',
        color: theme === 'dark' ? 'white' : 'black',
        fontSize: '2em',
        fontWeight: '900',
        left: '.7em',
        padding: '.2em .5em',
        position: 'absolute'
    };
}

export default Header;