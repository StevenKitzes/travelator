import React from 'react';

import CONSTANTS from './../constants';
import Factory from '../factory';
import ItineraryHelper from '../itinerary-helper';
import capitalize from '../capitalize';

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
        const travelItem = Factory.simple(CONSTANTS.travelType, ItineraryHelper.getLatestDate(itinerary));
        itinerary.push(travelItem);
        setItinerary(Array.from(itinerary));
    }
    function addLodging() {
        const lodgingItem = Factory.simple(CONSTANTS.lodgingType, ItineraryHelper.getLatestDate(itinerary));
        itinerary.push(lodgingItem);
        setItinerary(Array.from(itinerary));
    }
    function addActivity() {
        const activityItem = Factory.simple(CONSTANTS.activityType, ItineraryHelper.getLatestDate(itinerary));
        itinerary.push(activityItem);
        setItinerary(Array.from(itinerary));
    }
    function addFood() {
        const foodItem = Factory.simple(CONSTANTS.foodType, ItineraryHelper.getLatestDate(itinerary));
        itinerary.push(foodItem);
        setItinerary(Array.from(itinerary));
    }

    function downloadItinerary() {
        // output array for all properties of all itinerary items
        const output = [CONSTANTS.fileHeader];

        // for each itinerary item
        for(let i = 0; i < itinerary.length; i++) {
            const item = itinerary[i];

            switch(item.type) {
                case CONSTANTS.travelType:
                    pushGenerics(output, item, CONSTANTS.travelSubtypes);
                    output.push(item.typeDetails.origin);
                    output.push(item.typeDetails.departureDate);
                    output.push(item.typeDetails.destination);
                    output.push(item.typeDetails.arrivalDate);
                    break;
                case CONSTANTS.lodgingType:
                    pushGenerics(output, item, CONSTANTS.lodgingSubtypes);
                    output.push(item.typeDetails.lodging);
                    output.push(item.typeDetails.arrivalDate);
                    output.push(item.typeDetails.departureDate);
                    break;
                case CONSTANTS.activityType:
                    pushGenerics(output, item, CONSTANTS.activitySubtypes);
                    output.push(item.typeDetails.venue);
                    output.push(item.typeDetails.date);
                    break;
                case CONSTANTS.foodType:
                    pushGenerics(output, item, CONSTANTS.foodSubtypes);
                    output.push(item.typeDetails.venue);
                    output.push(item.typeDetails.date);
                    break;
                default:
                    console.log('Skipping unrecognized itinerary item type ' + item.type);
                    break;
            }
        }

        // execute download
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output.join('\n')));
        element.setAttribute('download', CONSTANTS.fileName);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    function pushGenerics(output, item, subtypeSet) {
        output.push(CONSTANTS.fileSeparator);
        output.push(capitalize(item.type));
        output.push(capitalize(subtypeSet[item.subtype]));
        output.push(item.customType);
        output.push(item.notes);
        output.push(item.cost);
    }
    function uploadItinerary() {
        document.getElementById('upload-button').click();
    }
    function handleUpload(event) {
        const file = event.target.files[0], fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = (event) => {
            const input = event.target.result.split('\n');
            try {
                if(input.length < 3) {
                    throw new Error(CONSTANTS.badFileContent);
                }
                if(input[0] !== CONSTANTS.fileHeader) {
                    throw new Error(CONSTANTS.badFileHeader);
                }
                if(input[1] !== CONSTANTS.fileSeparator) {
                    throw new Error(CONSTANTS.badFileSeparator);
                }

                let line = 2;
                while(line < input.length) {
                    switch(input[line].toLowerCase()) {
                        case CONSTANTS.travelType:
                            if(input.length < line + 9) {
                                throw new Error(CONSTANTS.badFileContent);
                            }
                            // read and validate type of all travel type input
                            break;
                    }
                }
            } catch(err) {
                console.log(err);
            }
        };
    }

    return (
        <div style={getBodyStyle(themeColors)}>
            <input
                id='upload-button'
                style={getUploadButtonStyle(theme)}
                type='file'
                onChange={handleUpload} />
            <AddButton stretch theme={theme} onClick={downloadItinerary}>
                Download Itinerary as Text
            </AddButton>
            <AddButton stretch theme={theme} onClick={uploadItinerary}>
                Upload Itinerary from Text
            </AddButton>
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
                + Travel
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
function getUploadButtonStyle(theme) {
    return {
        display: 'none'
    };
}

export default Body;