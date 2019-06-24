import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import CONSTANTS from '../constants';

import LoginButton from './LoginButton';
import InputHeader from './InputHeader';
import InputLogin from './InputLogin';
import LoginSwitcher from './LoginSwitcher';
import AddButton from './AddButton';

function Login({theme}) {
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passConf, setPassConf] = useState('');
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

    function submit() {
        switch(formType) {
            case 'login':
                break;
            case 'register':
                break;
            default:
                console.log('Error: invalid form type detected.');
                return;
        }
    }

    return (
        <div style={getLoginStyle(themeColors)}>
            <Link to='/'>
                <LoginButton theme={theme} phrase='Nevermind' />
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

            <div style={requiredFieldsStyle}>All fields required</div>

            <div style={loginInputDivStyle}>
                <InputHeader id='email-header' theme={theme}>
                    Email
                </InputHeader>
                <InputLogin
                    theme={theme}
                    placeholder='Email'
                    value={email}
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
                    valueModifier={handlePassChange} />{' '}
            </div>
            {
                formType === 'login' ? null :
                <div style={loginInputDivStyle}>
                    <InputHeader id='password-confirm-header' theme={theme}>
                        Confirm
                    </InputHeader>
                    <InputLogin
                        password
                        theme={theme}
                        placeholder='Confirm password'
                        value={passConf}
                        valueModifier={handlePassConfChange} />{' '}
                </div>
            }
            <AddButton style={{margin: '.5rem 0 0 0'}} theme={theme} onClick={submit}>
                Submit
            </AddButton>
        </div>
    );
}

const requiredFieldsStyle = {
    fontSize: '.7rem',
    marginBottom: '.5rem',
    padding: '0'
};
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

export default Login;