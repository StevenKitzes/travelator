import React from 'react';
import { Link } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import CONSTANTS from './../constants';
import Factory from '../factory';
import ItineraryHelper from '../itinerary-helper';
import capitalize from '../capitalize';

import LoginButton from './LoginButton';
import AddButton from './AddButton';
import ItemTravel from './ItemTravel';
import ItemLodging from './ItemLodging';
import ItemActivity from './ItemActivity';
import ItemFood from './ItemFood';

function Body({theme, itinerary, setItinerary, authProps}) {
    
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
        if(itinerary.length < 1) {
            const downloadButton = document.getElementById('download-button');
            downloadButton.innerHTML = 'No itinerary to download!';
            setTimeout(() => {
                downloadButton.innerHTML = 'Download Itinerary as Text';
            }, 2000);
            return;
        }

        // output array for all properties of all itinerary items
        const output = [CONSTANTS.fileHeader];

        // for each itinerary item
        for(let i = 0; i < itinerary.length; i++) {
            const item = itinerary[i];

            switch(item.type) {
                case CONSTANTS.travelType:
                    pushGenerics(output, item, CONSTANTS.travelSubtypes);
                    output.push(item.typeDetails.origin);
                    output.push(item.typeDetails.destination);
                    output.push(item.typeDetails.secondaryDate);
                    break;
                case CONSTANTS.lodgingType:
                    pushGenerics(output, item, CONSTANTS.lodgingSubtypes);
                    output.push(item.typeDetails.lodging);
                    output.push(item.typeDetails.secondaryDate);
                    break;
                case CONSTANTS.activityType:
                    pushGenerics(output, item, CONSTANTS.activitySubtypes);
                    output.push(item.typeDetails.venue);
                    break;
                case CONSTANTS.foodType:
                    pushGenerics(output, item, CONSTANTS.foodSubtypes);
                    output.push(item.typeDetails.venue);
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
        output.push(item.date);
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
                // basic file checks for size and header
                if(input.length < 3) {
                    throw new Error(CONSTANTS.badFileContent + ' (no items found in itinerary file)');
                }
                if(input[0] !== CONSTANTS.fileHeader) {
                    throw new Error(CONSTANTS.badFileHeader);
                }

                // file read and itin hydration setup
                let line = 0;
                const newItinerary = [];

                // as long as we have more lines to read
                while(++line < input.length) {
                    // check for separator
                    if(input[line] !== CONSTANTS.fileSeparator) {
                        throw new Error(CONSTANTS.badFileSeparator);
                    }
                    // check itin item type by type name
                    switch(input[++line].toLowerCase()) {
                        case CONSTANTS.travelType: {
                            // make sure there are enough lines to populate this type
                            if(input.length < line + 9) {
                                throw new Error(CONSTANTS.badFileContent + ' (invalid item composition)');
                            }
                            // read and validate type of all travel type input
                            const subtype = CONSTANTS.travelSubtypes.indexOf(input[++line].toLowerCase());
                            const customType = input[++line];
                            const date = new Date(input[++line]);
                            const notes = input[++line];
                            const cost = parseFloat(input[++line]);
                            const origin = input[++line];
                            const destination = input[++line];
                            const secondaryDate = new Date(input[++line]);
                            const travelItem = Factory.detailed(
                                CONSTANTS.travelType,
                                subtype,
                                customType,
                                notes,
                                cost,
                                date,
                                secondaryDate,
                                origin,
                                destination
                            );
                            newItinerary.push(travelItem);
                            break;
                        }
                        case CONSTANTS.lodgingType: {
                            // make sure there are enough lines to populate this type
                            if(input.length < line + 8) {
                                throw new Error(CONSTANTS.badFileContent + ' (invalid item composition)');
                            }
                            // read and validate type of all loding type input
                            const subtype = CONSTANTS.lodgingSubtypes.indexOf(input[++line].toLowerCase());
                            const customType = input[++line];
                            const date = new Date(input[++line]);
                            const notes = input[++line];
                            const cost = parseFloat(input[++line]);
                            const lodging = input[++line];
                            const secondaryDate = new Date(input[++line]);
                            const lodgingItem = Factory.detailed(
                                CONSTANTS.lodgingType,
                                subtype,
                                customType,
                                notes,
                                cost,
                                date,
                                secondaryDate,
                                null,
                                null,
                                lodging
                            );
                            newItinerary.push(lodgingItem);
                            break;
                        }
                        case CONSTANTS.activityType: {
                            // make sure there are enough lines to populate this type
                            if(input.length < line + 7) {
                                throw new Error(CONSTANTS.badFileContent + ' (invalid item composition)');
                            }
                            // read and validate type of all activity type input
                            const subtype = CONSTANTS.activitySubtypes.indexOf(input[++line].toLowerCase());
                            const customType = input[++line];
                            const date = new Date(input[++line]);
                            const notes = input[++line];
                            const cost = parseFloat(input[++line]);
                            const venue = input[++line];
                            const activityItem = Factory.detailed(
                                CONSTANTS.activityType,
                                subtype,
                                customType,
                                notes,
                                cost,
                                date,
                                null,
                                null,
                                null,
                                null,
                                venue
                            );
                            newItinerary.push(activityItem);
                            break;
                        }
                        case CONSTANTS.foodType: {
                            // make sure there are enough lines to populate this type
                            if(input.length < line + 7) {
                                throw new Error(CONSTANTS.badFileContent + ' (invalid item composition)');
                            }
                            // read and validate type of all food type input
                            const subtype = CONSTANTS.foodSubtypes.indexOf(input[++line].toLowerCase());
                            const customType = input[++line];
                            const date = new Date(input[++line]);
                            const notes = input[++line];
                            const cost = parseFloat(input[++line]);
                            const venue = input[++line];
                            const foodItem = Factory.detailed(
                                CONSTANTS.foodType,
                                subtype,
                                customType,
                                notes,
                                cost,
                                date,
                                null,
                                null,
                                null,
                                null,
                                venue
                            );
                            newItinerary.push(foodItem);
                            break;
                        }
                        default:
                            throw new Error(CONSTANTS.badFileContent + ' (unrecognized itinerary item type: ' + input[line] + ' at input line ' + line + ')');
                    }
                }
                setItinerary(Array.from(newItinerary));
            } catch(err) {
                console.log(err);
            }
        };
    }

    function handleLogOut() {
        Auth.signOut()
        .then(() => {
            authProps.setAuthenticated(false);
            authProps.setUser(null);
        })
        .catch(caught => console.log(caught));
    }

    return (
        <div style={getBodyStyle(themeColors)}>
            <div className='top-gap'>
                <input
                    id='upload-button'
                    style={getUploadButtonStyle(theme)}
                    type='file'
                    onChange={handleUpload} />
                <AddButton id='download-button' stretch theme={theme} onClick={downloadItinerary}>
                    Download Itinerary as Text
                </AddButton>
                <AddButton stretch theme={theme} onClick={uploadItinerary}>
                    Upload Itinerary from Text
                </AddButton>
            </div>
            {
                authProps.authenticated ?
                <LoginButton theme={theme} onClick={handleLogOut}>
                    Logout
                </LoginButton> :
                <Link to='/login/'>
                    <LoginButton theme={theme}>
                        Login / Register
                    </LoginButton>
                </Link>
            }
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
        border: 'none',
        color: colors.text,
        height: 'calc(100% - 18em)',
        overflowY: 'auto',
        // paddingTop: '0.5em',
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