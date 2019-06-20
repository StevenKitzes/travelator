import React from 'react';

import CONSTANTS from './../constants';
import Factory from '../factory';

import AddButton from './AddButton';
import ItemTravel from './ItemTravel';
import ItemLodging from './ItemLodging';
import ItemActivity from './ItemActivity';
import ItemFood from './ItemFood';

function Body({theme, itinerary, setItinerary}) {
    
    const themeColors = theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark :
        CONSTANTS.colors.light;

    function addTravel() {
        const travelItem = Factory(CONSTANTS.travelType);
        itinerary.push(travelItem);
        setItinerary(Array.from(itinerary));
    }
    function addLodging() {
        const lodgingItem = Factory(CONSTANTS.lodgingType);
        itinerary.push(lodgingItem);
        setItinerary(Array.from(itinerary));
    }
    function addActivity() {
        const activityItem = Factory(CONSTANTS.activityType);
        itinerary.push(activityItem);
        setItinerary(Array.from(itinerary));
    }
    function addFood() {
        const foodItem = Factory(CONSTANTS.foodType);
        itinerary.push(foodItem);
        setItinerary(Array.from(itinerary));
    }

    function reportItin() {
        alert(JSON.stringify(itinerary));
    }

    return (
        <div style={getBodyStyle(themeColors)}>
            {itinerary.length > 0 ? null : <h6>Add itinerary items to see them here.</h6>}
            {itinerary.map((item) => {
                switch(item.type) {
                    case CONSTANTS.travelType:
                        return(
                            <ItemTravel
                                itemKey={item.key}
                                theme={theme}
                                itinerary={itinerary}
                                setItinerary={setItinerary}
                                key={item.key} />
                        );
                    case CONSTANTS.lodgingType:
                        return(
                            <ItemLodging
                                itemKey={item.key}
                                theme={theme}
                                itinerary={itinerary}
                                setItinerary={setItinerary}
                                key={item.key} />
                        );
                    case CONSTANTS.activityType:
                        return(
                            <ItemActivity
                                itemKey={item.key}
                                theme={theme}
                                itinerary={itinerary}
                                setItinerary={setItinerary}
                                key={item.key} />
                        );
                    case CONSTANTS.foodType:
                        return(
                            <ItemFood
                                itemKey={item.key}
                                theme={theme}
                                itinerary={itinerary}
                                setItinerary={setItinerary}
                                key={item.key} />
                        );
                    default:
                        return (
                            <h4>Whoopsies!  Invalid itinerary object!</h4>
                        );
                }
            })}
            {itinerary.length > 0 ? <h6>Itinerary items above.</h6> : null}
            <AddButton theme={theme} onClick={addTravel}>
                + Transport
            </AddButton>
            <AddButton theme={theme} onClick={addLodging}>
                + Lodging
            </AddButton>
            <AddButton theme={theme} onClick={addActivity}>
                + Activity
            </AddButton>
            <AddButton theme={theme} onClick={addFood}>
                + Food
            </AddButton>
            <button onClick={reportItin}>check itin state</button>
        </div>
    );
}

function getBodyStyle(colors) {
    return {
        backgroundColor: colors.bg,
        color: colors.text,
        height: 'calc(100% - 18em)',
        overflowY: 'auto',
        paddingTop: '0.5em',
        position: 'fixed',
        textAlign: 'center',
        top: '15em',
        width: '100%'
    }
}

export default Body;