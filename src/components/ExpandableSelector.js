import React, {useState} from 'react';

import CONSTANTS from '../constants';

function ExpandableSelector({theme}) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpanded() {
        setExpanded(!expanded);
    }
    function noParentClick(event) {
        event.stopPropagation();
    }

    return (
        <div style={getExpandableSelectorStyle(theme)} onClick={toggleExpanded}>
            <img style={iconStyle} src='/img/travel/airfare.svg' />{' '}
            <img style={caretStyle} src={CONSTANTS.images.caretBlack} />{' '}
            <div style={getExpandedSelectorStyle(expanded, theme)} onClick={noParentClick}>Expanded!</div>
        </div>
    );
}

function getExpandableSelectorStyle(theme) {
    return {
        backgroundColor: (theme === CONSTANTS.dark ?
            CONSTANTS.colors.dark.expandableBg :
            CONSTANTS.colors.light.expandableBg),
        border: '.1rem solid gray',
        borderRadius: '.25rem',
        cursor: 'pointer',
        display: 'inline-block',
        margin: '-.2rem 0 0 0',
        padding: '.2rem .4rem'
    };
}
function getExpandedSelectorStyle(expanded, theme) {
    return {
        backgroundColor: (theme === CONSTANTS.dark ?
            CONSTANTS.colors.dark.expandableBg :
            CONSTANTS.colors.light.expandableBg),
        border: '.1rem solid gray',
        borderRadius: '.25rem',
        cursor: 'pointer',
        display: expanded ? 'inline-block' : 'none',
        left: '16rem',
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