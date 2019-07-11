import React, {useState} from 'react';

function DeleteButton({stretch, handler, id, prompt, confirmPrompt, timer}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    function handleConfirm(event) {
        handler(event);
    }
    function handleFirstClick() {
        setConfirmDelete(true);
        setTimeout(function() { setConfirmDelete(0); }, timer || 1500);
    }

    return (
        confirmDelete ?
        <button id={id} style={deleteButtonStyles(stretch)} onClick={handleConfirm}>
            {confirmPrompt}
        </button>
        :
        <button id={id} style={deleteButtonStyles(stretch)} onClick={handleFirstClick}>
            {prompt}
        </button>
    )
}

function deleteButtonStyles(stretch) {
    return {
        backgroundColor: 'lightpink',
        borderStyle: 'solid',
        borderColor: 'red',
        borderRadius: '.3rem',
        color: 'black',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        margin: '.5rem',
        padding: '.3rem .6rem',
        width: stretch ? 'auto' : '7rem'
    };
}

export default DeleteButton;