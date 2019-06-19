import React from 'react';

import CONSTANTS from '../constants';

import ExpandableIcon from './ExpandableIcon';

function ExpandedSelector({expanded, theme, type, typeList}) {
    function noParentClick(event) {
        event.stopPropagation();
    }

    return (
        <div style={getExpandedStyle(expanded, theme)} onClick={noParentClick}>
            {typeList.map((subtype) => {
                return (
                    <div style={{display: 'inline-block', marginRight: '.25rem'}}>
                        <ExpandableIcon gap title={subtype.charAt(0).toUpperCase() + subtype.slice(1)} src={`/img/${type}/${subtype}.svg`} />
                    </div>
                );
            })}
        </div>
    );
}

function getExpandedStyle(expanded, theme) {
    return {
        backgroundColor: (theme === CONSTANTS.dark ?
            CONSTANTS.colors.dark.expandableBg :
            CONSTANTS.colors.light.expandableBg),
        border: '.1rem solid gray',
        borderRadius: '.25rem',
        cursor: 'pointer',
        display: expanded ? 'inline-block' : 'none',
        left: '2.5rem',
        margin: '-.25rem 0 0 0',
        padding: '.2rem .4rem',
        position: 'absolute',
        whiteSpace: 'nowrap',
        zIndex: '1'
    };
}
export default ExpandedSelector;