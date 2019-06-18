import React, {useState} from 'react';

import CONSTANTS from '../constants';

function ExpandableSelector(props) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpanded() {
        setExpanded(!expanded);
    }
    function noParentClick(event) {
        event.stopPropagation();
    }

    return (
        <div style={expandableSelectorStyle} onClick={toggleExpanded}>
            <img style={iconStyle} src='/img/food/bar.svg' />{' '}
            <img style={caretStyle} src={CONSTANTS.images.caretBlack} />{' '}
            <div style={getExpandedSelectorStyle(expanded)} onClick={noParentClick}>Expanded!</div>
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
function getExpandedSelectorStyle(expanded) {
    return {
        backgroundColor: 'white',
        border: '.1rem solid lightgray',
        borderRadius: '.25rem',
        cursor: 'pointer',
        display: expanded ? 'inline-block' : 'none',
        left: '8rem',
        margin: '-.25rem 0 0 0',
        padding: '.2rem .4rem',
        position: 'absolute',
        zIndex: '1'
    };
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