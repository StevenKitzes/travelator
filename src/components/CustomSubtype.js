import React from 'react';

import CONSTANTS from '../constants';

function CustomSubtype({customType, changeCustom, theme}) {
    function handleCustomChange(event) {
        changeCustom(event.target.value);
    }

    return (
        <input
            className={theme === CONSTANTS.dark ?
                'input-dark' :
                'input-light'}
            value={customType}
            onChange={handleCustomChange}
            placeholder='Custom'
            style={{width: '7rem'}} />
    );
}

export default CustomSubtype;