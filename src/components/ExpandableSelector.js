import React from 'react';

function ExpandableSelector(props) {
    return (
        <div style={expandableSelector}>
            :)
        </div>
    );
}

const expandableSelector = {
    backgroundColor: 'lightgray',
    border: '.1rem solid gray',
    borderRadius: '.25rem',
    display: 'inline-block',
    padding: '.2rem'
}

export default ExpandableSelector;