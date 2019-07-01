import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import CONSTANTS from '../constants';

import LoginButton from './LoginButton';
import InputHeader from './InputHeader';
import InputLogin from './InputLogin';
import LoginSwitcher from './LoginSwitcher';
import AddButton from './AddButton';

function Login({theme, authProps, history}) {
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passConf, setPassConf] = useState('');
    const [error, setError] = useState('');
    const [formType, setFormType] = useState('login');
    function setModeLogin() {
        setFormType('login');
    }
    function setModeRegister() {
        setFormType('register');
    }
    function handleEmailChange(newEmail) {
        setEmail(newEmail);
    }
    function handlePassChange(newPass) {
        setPass(newPass);
    }
    function handlePassConfChange(newPassConf) {
        setPassConf(newPassConf);
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

        if(formType === 'register') {
            if(!passConf) {
                errStr = (errStr ? errStr + '\n' : '') + 'Password confirmation is required.';
            }
            if(pass !== passConf) {
                errStr = (errStr ? errStr + '\n' : '') + 'Password and password confirmation must match!';
            }
        }

        if(errStr) {
            setError(errStr);
            return;
        }

        setError('');
        
        // Auth stuff uses Promise architecture
        if(formType === 'register') {
            Auth.signUp({
                username: email,
                password: pass
            })
            .then(() => {
                history.push('/');
            })
            .catch(caught => {
                setError(caught);
            });
        }
        if(formType === 'login') {
            Auth.signIn(email, pass)
            .then(user => {
                console.log(user);
                authProps.setUser(user);
                authProps.setAuthenticated(true);
                history.push('/');
            })
            .catch(caught => {
                setError(caught);
            });
        }
    }
    function forgotSubmit() {
        if(!email) {
            setError('Error: enter a valid email address to receive a password reset verification code!');
            return;
        }
        setError('');
        Auth.forgotPassword(email)
            .then(() => {
                history.push('/password-reset/');
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

            <LoginSwitcher
                theme={theme}
                callback={setModeLogin}
                phrase='Login'
                active={formType === 'login'} />
            <LoginSwitcher
                theme={theme}
                callback={setModeRegister}
                phrase='Register'
                active={formType === 'register'} />

            <div className='tiny-text'>All fields required</div>

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
                    placeholder='Password'
                    value={pass}
                    keyHandler={handleKeyPress}
                    valueModifier={handlePassChange} />{' '}
            </div>
            {
                formType === 'login' ?
                <div className='tiny-text'>
                    <button 
                        className={theme === CONSTANTS.dark ?
                            'white-link-button' :
                            'black-link-button'}
                        onClick={forgotSubmit}>
                        Password reset?
                    </button>
                </div>
                :
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
            }
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

export default Login;