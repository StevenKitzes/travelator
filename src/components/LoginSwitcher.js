import React from 'react';

import CONSTANTS from '../constants';

function LoginSwitcher({theme, active, phrase, callback}) {
    function clickHandler() {
        callback();
    }
    return (
        <div onClick={clickHandler} style={getLoginSwitcherStyle(theme, active)}>
            {phrase}
        </div>
    );
}

function getLoginSwitcherStyle(theme, active) {
    return {
        backgroundColor: theme === CONSTANTS.dark ?
            (active ? CONSTANTS.colors.dark.object : '#111') :
            (active ? CONSTANTS.colors.light.object : 'lightgray'),
        borderStyle: 'solid',
        borderColor: theme === CONSTANTS.dark ?
            CONSTANTS.colors.dark.heavy :
            CONSTANTS.colors.light.heavy,
        borderRadius: '.3rem',
        color: theme === CONSTANTS.dark ?
            (active ? 'white' : 'gray') :
            (active ? 'black' : 'darkgray'),
        cursor: 'pointer',
        display: 'inline-block',
        fontSize: '1rem',
        fontWeight: '600',
        margin: '2rem .5rem .5rem .5rem',
        padding: '.3rem .6rem',
        width: '7rem'
    };
}

export default LoginSwitcher;