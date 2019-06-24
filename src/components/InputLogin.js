import React from 'react';

import CONSTANTS from '../constants';

function InputLogin({placeholder, value, valueModifier, theme, password}) {
    function handleChange(event) {
        valueModifier(event.target.value);
    }
    return (
        <input
            type={password ? 'password' : 'text'}
            className={theme === CONSTANTS.dark ?
                'login-input input-dark' :
                'login-input input-light'}
            value={value}
            onChange={handleChange}
            placeholder={placeholder} />
    );
}

export default InputLogin;