import React from 'react';

import CONSTANTS from '../constants';

function InputLogin({placeholder, value, valueModifier, theme, password, keyHandler}) {
    function handleChange(event) {
        valueModifier(event.target.value);
    }
    function handleKeyPress(event) {
        keyHandler(event);
    }
    return (
        <input
            type={password ? 'password' : 'text'}
            className={theme === CONSTANTS.dark ?
                'login-input input-dark' :
                'login-input input-light'}
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder} />
    );
}

export default InputLogin;