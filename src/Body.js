import React from 'react';
import uuid from 'uuid/v4';

function Body(props) {
    let theme = props.theme;

    function addTravel() {
        props.itinerary.push('Travel item');
        props.setItinerary(Array.from(props.itinerary));
    }

    return (
        <div style={getBodyStyle(theme)}>
            <h1>Here is where the itinerary oughta get displayified.</h1>
            {props.itinerary.map((item) => {
                return(
                    <p key={uuid()}>Travel item</p>
                );
            })}
            <button onClick={addTravel} style={getButtonStyle(theme)}>+ Travel</button>
            <button style={getButtonStyle(theme)}>+ Accommodation</button>
            <button style={getButtonStyle(theme)}>+ Activity</button>
            <button style={getButtonStyle(theme)}>+ Food</button>
        </div>
    );
}

function getBodyStyle(theme) {
    return {
        backgroundColor: theme === 'dark' ? '#222' : 'white',
        color: theme === 'dark' ? 'white' : 'black',
        height: 'calc(100% - 18em)',
        overflowY: 'auto',
        position: 'fixed',
        top: '15em',
        width: '100%'
    }
}
function getButtonStyle(theme) {
    return {
        backgroundColor: theme === 'dark' ? 'white' : '#CFF',
        borderStyle: 'none',
        borderRadius: '.3em',
        color: 'black',
        cursor: 'pointer',
        margin: '.5em',
        padding: '.3em .6em'
    };
}

export default Body;