import React from 'react';
import uuid from 'uuid/v4';

import CONSTANTS from './constants';

import AddButton from './AddButton';

function Body({theme, itinerary, setItinerary}) {
    
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    function addTravel() {
        itinerary.push('Travel item');
        setItinerary(Array.from(itinerary));
    }
    function addAccommodation() {
        itinerary.push('Accommodation item');
        setItinerary(Array.from(itinerary));
    }
    function addActivity() {
        itinerary.push('Activity item');
        setItinerary(Array.from(itinerary));
    }
    function addFood() {
        itinerary.push('Food item');
        setItinerary(Array.from(itinerary));
    }
    function popFromInv() {
        itinerary.pop();
        setItinerary(Array.from(itinerary));
    }

    return (
        <div style={getBodyStyle(themeColors)}>
            {itinerary.length > 0 ? null : <h1>Itinerary will display here once it has something in it.</h1>}
            {itinerary.map((item) => {
                return(
                    <p key={uuid()} onClick={popFromInv}>{item}</p>
                );
            })}
            {itinerary.length > 0 ? <h1>Itinerary summary displays when itinerary has items.</h1> : null}
            <AddButton theme={theme} onClick={addTravel}>
                + Travel
            </AddButton>
            <AddButton theme={theme} onClick={addAccommodation}>
                + Accommodation
            </AddButton>
            <AddButton theme={theme} onClick={addActivity}>
                + Activity
            </AddButton>
            <AddButton theme={theme} onClick={addFood}>
                + Food
            </AddButton>
        </div>
    );
}

function getBodyStyle(colors) {
    return {
        backgroundColor: colors.bg,
        color: colors.text,
        height: 'calc(100% - 18em)',
        overflowY: 'auto',
        position: 'fixed',
        top: '15em',
        width: '100%'
    }
}

export default Body;