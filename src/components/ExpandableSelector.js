import React from 'react';

import CONSTANTS from '../constants';

function ExpandableSelector(props) {
    return (
        <div style={expandableSelectorStyle}>
            <img style={iconStyle} src='/img/activity/custom-by-egor-rumyantsev.svg' />{' '}
            <img style={caretStyle} src={CONSTANTS.images.caretBlack} />
        </div>
    );
}

const expandableSelectorStyle = {
    backgroundColor: 'white',
    border: '.1rem solid lightgray',
    borderRadius: '.25rem',
    cursor: 'pointer',
    display: 'inline-block',
    margin: '-.2rem 0 0 0',
    padding: '.2rem .4rem'
}
const iconStyle = {
    height: '1rem',
    margin: '-.3rem 0 0 0',
    width: '1rem'
}
const caretStyle = {
    margin: '-.3rem 0 0 0'
}

export default ExpandableSelector;