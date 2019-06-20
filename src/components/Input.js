import React from 'react';

function Input({placeholder, value, valueModifier}) {
    function handleChange(event) {
        valueModifier(event.target.value);
    }

    return (
        <input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            style={{
                maxWidth: '10rem',
                minWidth: '3rem',
                width: 'calc('+value.length+'rem / 1.75)'
            }} />
    );
}

export default Input;