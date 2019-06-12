import React from 'react';

function Footer(props) {
    return (
        <div style={getFooterStyle(props.theme)}>
            <div style={getSeparatorStyle(props.theme)} />
            <p style={pStyle}>This spiffy travel planning helper brought to you free as Open Source Software under the MIT License!  :)  Yay!</p>
        </div>
    );
}

function getFooterStyle(theme) {
    return {
        backgroundColor: theme === 'dark' ? '#111' : '#CCFFFF',
        bottom: '0',
        color: theme === 'dark' ? 'white' : 'black',
        height: '3em',
        left: '0',
        position: 'fixed',
        width: '100%'
    };
}
function getSeparatorStyle(theme) {
    return {
        backgroundColor: theme === 'dark' ? 'black' : '#A0F8FF',
        height: '.3em',
        left: '0',
        margin: '0'
    };
}
const pStyle = {
    marginTop: '.7em'
}

export default Footer;