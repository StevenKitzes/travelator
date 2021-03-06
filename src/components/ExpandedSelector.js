import React from 'react';
import uuid from 'uuid/v4';

import CONSTANTS from '../constants';

import ExpandableIcon from './ExpandableIcon';

function ExpandedSelector({expanded, theme, type, changeSubtype, toggleExpanded, typeList}) {
    function handleIconClick(event) {
        changeSubtype(typeList.indexOf(event.target.title.toLowerCase()));
        toggleExpanded();
    }
    function noParentClick(event) {
        event.stopPropagation();
    }

    return (
        <div style={getExpandedStyle(expanded, theme)} onClick={noParentClick}>
            {typeList.map((subtype) => {
                return (
                    <div style={{display: 'inline-block', marginRight: '.25rem'}} key={uuid()}>
                        <ExpandableIcon
                            gap
                            title={subtype.charAt(0).toUpperCase() + subtype.slice(1)}
                            src={`/img/${type}/${subtype}.svg`}
                            onClick={handleIconClick} />
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