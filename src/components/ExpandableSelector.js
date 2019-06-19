import React, {useState} from 'react';

import CONSTANTS from '../constants';

import ExpandableIcon from './ExpandableIcon';
import ExpandedSelector from './ExpandedSelector';

function ExpandableSelector({theme, type, subtype, changeSubtype, typeList}) {
    const [expanded, setExpanded] = useState(false);

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    return (
        <div style={getExpandableStyle(theme)} onClick={toggleExpanded}>
            <ExpandableIcon src={`/img/${type}/${CONSTANTS[type+'Subtypes'][subtype]}.svg`} />{' '}
            <img style={caretStyle} src={CONSTANTS.images.caretBlack} />{' '}
            <ExpandedSelector
                expanded={expanded}
                theme={theme}
                type={type}
                changeSubtype={changeSubtype}
                toggleExpanded={toggleExpanded}
                typeList={typeList} />
        </div>
    );
}

function getExpandableStyle(theme) {
    return {
        backgroundColor: (theme === CONSTANTS.dark ?
            CONSTANTS.colors.dark.expandableBg :
            CONSTANTS.colors.light.expandableBg),
        border: '.1rem solid gray',
        borderRadius: '.25rem',
        cursor: 'pointer',
        display: 'inline-block',
        margin: '-.2rem 0 0 0',
        padding: '.2rem .4rem',
        position: 'relative'
    };
}
const caretStyle = {
    margin: '-.3rem 0 0 0'
}

export default ExpandableSelector;