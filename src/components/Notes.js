import React from 'react';

function Notes({notes, changeNotes}) {
    function handleChange(event) {
        changeNotes(event.target.value);
    }

    return (
        <input
            value={notes}
            onChange={handleChange}
            placeholder='Notes'
            style={{
                maxWidth: '25rem',
                minWidth: '3rem',
                width: 'calc('+notes.length+'rem / 1.5)'
            }} />
    );
}

export default Notes;