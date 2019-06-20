import React from 'react';

function Cost({cost, handleCostChange}) {
    return (
        <div style={{display: 'inline-block', float: 'right', marginRight: '.25rem'}}>
            $<input
                value={cost}
                onChange={handleCostChange}
                placeholder='0.00'
                style={{width: '4rem'}} />
        </div>
    );
}

export default Cost;