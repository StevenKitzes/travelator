import React from 'react';

function Notes({notes, changeNotes}) {
    function handleChange(event) {
        changeNotes(event.target.value);
    }

    return (
        <div style={{float: 'right', marginRight: '.25rem'}}>
            Notes:{' '}
            <input
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