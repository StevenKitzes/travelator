import React from 'react';

import CONSTANTS from '../constants';

function InputLogin({placeholder, value, valueModifier, theme}) {
    function handleChange(event) {
        valueModifier(event.target.value);
    }
    return (
        <input
            className={theme === CONSTANTS.dark ?
                'login-input input-dark' :
                'login-input input-light'}
            value={value}
            onChange={handleChange}
            placeholder={placeholder} />
    );
}

export default InputLogin;