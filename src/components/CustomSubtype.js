import React from 'react';

function CustomSubtype({customType, changeCustom}) {
    function handleCustomChange(event) {
        changeCustom(event.target.value);
    }

    return (
        <input
            value={customType}
            onChange={handleCustomChange}
            placeholder='Custom'
            style={{width: '7rem'}} />
    );
}

export default CustomSubtype;