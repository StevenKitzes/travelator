import React from 'react';

import { Link } from 'react-router-dom';

import CONSTANTS from '../constants';

import LoginButton from './LoginButton';

function PasswordResetComplete({theme}) {
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    return (
        <div style={getLoginStyle(themeColors)}>
            <Link to='/'>
                <LoginButton theme={theme}>
                    Cool! Take me back
                </LoginButton>
            </Link>
            <h3 className='top-gap'>Password reset successful!</h3>
        </div>
    );
}

function getLoginStyle(colors) {
    return {
        backgroundColor: colors.bg,
        border: 'none',
        color: colors.text,
        height: 'calc(100% - 18em)',
        overflowY: 'auto',
        position: 'fixed',
        textAlign: 'center',
        top: '15em',
        width: '100%'
    }
}

export default PasswordResetComplete;