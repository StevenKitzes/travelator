import React from 'react';

import CONSTANTS from './../constants';
import Factory from '../factory';

import AddButton from './AddButton';
import ItemTravel from './ItemTravel';

function Body({theme, itinerary, setItinerary}) {
    
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    function addTravel() {
        const travelItem = Factory(CONSTANTS.travelType);
        itinerary.push(travelItem);
        setItinerary(Array.from(itinerary));
    }

    return (
        <div style={getBodyStyle(themeColors)}>
            {itinerary.length > 0 ? null : <h3>Add itinerary items to see them here.</h3>}
            {itinerary.map((item) => {
                switch(item.type) {
                    case CONSTANTS.travelType:
                        return(
                            <ItemTravel details={item} key={item.key} />
                        );
                    default:
                        return (
                            <h4>Whoopsies!  Invalid itinerary object!</h4>
                        );
                }
            })}
            {itinerary.length > 0 ? <h3>Itinerary items above.</h3> : null}
            <AddButton theme={theme} onClick={addTravel}>
                + Transport
            </AddButton>
            <AddButton theme={theme} onClick={addTravel}>
                + Lodging
            </AddButton>
            <AddButton theme={theme} onClick={addTravel}>
                + Activity
            </AddButton>
            <AddButton theme={theme} onClick={addTravel}>
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
        textAlign: 'center',
        top: '15em',
        width: '100%'
    }
}

export default Body;