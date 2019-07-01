import React from 'react';

import CONSTANTS from '../constants';

function Cost({cost, handleCostChange, theme}) {

    return (
        <div style={{display: 'inline-block', float: 'right', marginRight: '.25rem'}}>
            $<input
                className={theme === CONSTANTS.dark ?
                    'input-dark' :
                    'input-light'}
                value={cost}
                onChange={handleCostChange}
                placeholder='0.00'
                style={{width: '4rem'}} />
        </div>
    );
}

export default Cost;