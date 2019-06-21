import React from 'react';

import CONSTANTS from '../constants';

function Notes({notes, changeNotes, theme}) {
    function handleChange(event) {
        changeNotes(event.target.value);
    }

    return (
        <div style={{float: 'right', marginRight: '.25rem'}}>
            Notes:{' '}
            <input
                className={theme === CONSTANTS.dark ?
                    'input-dark' :
                    'input-light'}
                value={notes}
                onChange={handleChange}
                placeholder='Notes'
                style={{
                    maxWidth: '25rem',
                    minWidth: '6rem',
                    width: 'calc('+notes.length+'rem / 2)'
                }} />{' '}
        </div>
    );
}

export default Notes;