import React from 'react';

import CONSTANTS from '../constants';

function ExpandableSelector(props) {
    return (
        <div style={expandableSelector}>
            thing <img src={CONSTANTS.images.caretBlack} />
        </div>
    );
}

const expandableSelector = {
    backgroundColor: 'lightgray',
    border: '.1rem solid gray',
    borderRadius: '.25rem',
    cursor: 'pointer',
    display: 'inline-block',
    margin: '-.2rem 0 0 0',
    padding: '.2rem .4rem'
}

export default ExpandableSelector;