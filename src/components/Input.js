import React from 'react';

import CONSTANTS from '../constants';

function Input({placeholder, value, valueModifier, theme}) {
    function handleChange(event) {
        valueModifier(event.target.value);
    }
    return (
        <input
            className={theme === CONSTANTS.dark ?
                'input-dark' :
                'input-light'}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            style={{
                maxWidth: '10rem',
                minWidth: '3rem',
                width: 'calc(' + value.length +'rem / 1.75)'
            }} />
    );
}

export default Input;