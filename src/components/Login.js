import React from 'react';
import { Link } from 'react-router-dom';

import CONSTANTS from '../constants';

import LoginButton from './LoginButton';
import InputHeader from './InputHeader';
import InputLogin from './InputLogin';

function Login({theme}) {
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    return (
        <div style={getLoginStyle(themeColors)}>
            <Link to='/'>
                <LoginButton theme={theme} phrase='Nevermind' />
            </Link>

            <div style={{margin: '1rem 0 0 0', position: 'relative'}}>
                <InputHeader id='email-header' theme={theme}>
                    Email
                </InputHeader>
                <InputLogin
                    theme={theme}
                    placeholder='Email'
                    value={''}
                    valueModifier={null} /><br />
            </div>
            <div style={{margin: '1rem 0 0 0', position: 'relative'}}>
                <InputHeader id='password-header' theme={theme}>
                    Password
                </InputHeader>
                <InputLogin
                    theme={theme}
                    placeholder='Password'
                    value={''}
                    valueModifier={null} />{' '}
            </div>
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

export default Login;