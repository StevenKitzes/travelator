import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import CONSTANTS from '../constants';

import LoginButton from './LoginButton';
import InputHeader from './InputHeader';
import InputLogin from './InputLogin';
import AddButton from './AddButton';

function PasswordReset({theme, authProps, history}) {
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passConf, setPassConf] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    function handleEmailChange(newEmail) {
        setEmail(newEmail);
    }
    function handlePassChange(newPass) {
        setPass(newPass);
    }
    function handlePassConfChange(newPassConf) {
        setPassConf(newPassConf);
    }
    function handleCodeChange(newCode) {
        setCode(newCode);
    }

    function handleKeyPress(event) {
        if(event.key === 'Enter') {
            submit();
        }
    }

    function submit() {
        // validation
        let errStr = '';

        if(!email) {
            errStr = (errStr ? errStr + '\n' : '') + 'Email is required.';
        }
        if(!pass) {
            errStr = (errStr ? errStr + '\n' : '') + 'Password is required.';
        }
        if(!passConf) {
            errStr = (errStr ? errStr + '\n' : '') + 'Password confirmation is required.';
        }
        if(!code) {
            errStr = (errStr ? errStr + '\n' : '') + 'Code is required.';
        }

        if(pass !== passConf) {
            errStr = (errStr ? errStr + '\n' : '') + 'Password and password confirmation must match!';
        }

        if(errStr) {
            setError(errStr);
            return;
        }

        setError('');
        
        // Auth stuff uses Promise architecture
        Auth.forgotPasswordSubmit(email, code, pass)
        .then(() => {
            history.push('/password-reset-complete/');
        })
        .catch(caught => {
            setError(caught);
        });
    }

    return (
        authProps.authenticated ?
        <div style={getLoginStyle(themeColors)}>
            <Link to='/'>
                <LoginButton theme={theme}>
                    Nevermind
                </LoginButton>
            </Link>
            <h6 className='top-gap'><strong>{authProps.user.attributes.email}</strong> is already logged in!</h6>
        </div>
        :
        <div style={getLoginStyle(themeColors)}>
            <Link to='/'>
                <LoginButton theme={theme}>
                    Nevermind
                </LoginButton>
            </Link>

            <h3 className='top-gap'>Password reset</h3>

            <h6 className='top-gap-half'>Check your email for a Travelator verification code.</h6>

            <div className='tiny-text top-gap-half'>All fields required; check your email for the required verification code!</div>

            <div style={loginInputDivStyle}>
                <InputHeader id='email-header' theme={theme}>
                    Email
                </InputHeader>
                <InputLogin
                    theme={theme}
                    placeholder='Email'
                    value={email}
                    keyHandler={handleKeyPress}
                    valueModifier={handleEmailChange} /><br />
            </div>
            <div style={loginInputDivStyle}>
                <InputHeader id='password-header' theme={theme}>
                    Password
                </InputHeader>
                <InputLogin
                    password
                    theme={theme}
                    placeholder='New password'
                    value={pass}
                    keyHandler={handleKeyPress}
                    valueModifier={handlePassChange} />{' '}
            </div>
            <div style={loginInputDivStyle}>
                <InputHeader id='password-confirm-header' theme={theme}>
                    Confirm
                </InputHeader>
                <InputLogin
                    password
                    theme={theme}
                    placeholder='Confirm password'
                    value={passConf}
                    keyHandler={handleKeyPress}
                    valueModifier={handlePassConfChange} />{' '}
            </div>
            <div style={loginInputDivStyle}>
                <InputHeader id='code-header' theme={theme}>
                    Code
                </InputHeader>
                <InputLogin
                    theme={theme}
                    placeholder='Verification code'
                    value={code}
                    keyHandler={handleKeyPress}
                    valueModifier={handleCodeChange} />{' '}
            </div>
            {
                error ? <div><div style={errorStyle}>{error.message ? error.message : error}</div></div>
                : null
            }
            <AddButton style={{margin: '.5rem 0 1rem 0'}} theme={theme} onClick={submit}>
                Submit
            </AddButton>
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
const loginInputDivStyle = {
    height: '1.5rem',
    lineHeight: '1.5rem',
    margin: '0 0 1rem 0',
    position: 'relative'
};
const errorStyle = {
    backgroundColor: 'palevioletred',
    borderStyle: 'solid',
    borderColor: 'red',
    borderRadius: '.3rem',
    color: 'black',
    display: 'inline-block',
    fontSize: '1rem',
    fontWeight: '600',
    margin: '.5rem',
    padding: '.3rem .6rem',
    whiteSpace: 'pre-wrap'
}

export default PasswordReset;