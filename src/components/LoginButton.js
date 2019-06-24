import React from 'react';

import CONSTANTS from '../constants';

function LoginButton({theme, phrase}) {
    return (
        <div style={getLoginStyle(theme)}>{phrase}</div>
    );
}

function getLoginStyle(theme) {
    return {
        backgroundColor: theme === CONSTANTS.dark ?
            CONSTANTS.colors.dark.heavy :
            CONSTANTS.colors.light.object,
        borderBottom: `.15rem solid ${theme === CONSTANTS.dark ?
            'gray' :
            'black'}`,
        borderLeft: `.15rem solid ${theme === CONSTANTS.dark ?
            'gray' :
            'black'}`,
        borderRadius: '0 0 0 1rem',
        color: theme === CONSTANTS.dark ?
            'white' :
            CONSTANTS.colors.light.headerText,
        cursor: 'pointer',
        display: 'inline-block',
        fontSize: '1.1rem',
        fontWeight: '600',
        margin: '0',
        padding: '0 .5rem .25rem .75rem',
        position: 'absolute',
        right: '0',
        top: '0',
        zIndex: '1'
    };
}

export default LoginButton;