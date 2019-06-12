import React from 'react';

function Body(props) {
    return (
        <div style={getBodyStyle(props.theme)}>
            <p>Some kinda body content loreum ipsum.</p>
            <p>Some kinda body content loreum ipsum.</p>
            <p>Some kinda body content loreum ipsum.</p>
            <p>Some kinda body content loreum ipsum.</p>
            <p>Some kinda body content loreum ipsum.</p>
            <p>Some kinda body content loreum ipsum.</p>
        </div>
    );
}

function getBodyStyle(theme) {
    return {
        backgroundColor: theme === 'dark' ? '#222' : 'white',
        color: theme === 'dark' ? 'white' : 'black',
        height: 'calc(100% - 18em)',
        overflowY: 'auto',
        position: 'fixed',
        top: '15em',
        width: '100%'
    }
}

export default Body;