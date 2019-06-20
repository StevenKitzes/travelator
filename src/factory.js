import CONSTANTS from './constants';
import uuid from 'uuid/v4';

function getNewItineraryItem(
    // generics
    type, subtype = 0, customType = '', notes = '', cost = 0,
    // specifics
    dDate = null, aDate = null, origin = '', destination = '',
    date = null, lodging = '', venue = ''
) {
    const itineraryItem = {
        type: type,
        subtype: subtype,
        customType: customType,
        notes: notes,
        cost: cost,
        key: uuid(),

        typeDetails: null
    };

    switch(type) {
        case CONSTANTS.travelType: {
            if(!dDate) {
                dDate = new Date();
                dDate.setMinutes(0);
                dDate.setSeconds(0);
                dDate.setMilliseconds(0);
            }
            if(!aDate) {
                aDate = new Date();
                aDate.setMinutes(0);
                aDate.setSeconds(0);
                aDate.setMilliseconds(0);
            }
            itineraryItem.typeDetails = {
                origin: origin,
                departureDate: dDate,
                destination: destination,
                arrivalDate: aDate
            };
            break;
        }
        case CONSTANTS.lodgingType: {
            if(!dDate) {
                dDate = new Date();
                dDate.setMinutes(0);
                dDate.setSeconds(0);
                dDate.setMilliseconds(0);
            }
            if(!aDate) {
                aDate = new Date();
                aDate.setMinutes(0);
                aDate.setSeconds(0);
                aDate.setMilliseconds(0);
            }
            itineraryItem.typeDetails = {
                lodging: lodging,
                arrivalDate: aDate,
                departureDate: dDate
            };
            break;
        }
        case CONSTANTS.activityType: {
            if(!date) {
                date = new Date();
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
            }
            itineraryItem.typeDetails = {
                venue: venue,
                date: date
            };
            break;
        }
        case CONSTANTS.foodType: {
            if(!date) {
                date = new Date();
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
            }
            itineraryItem.typeDetails = {
                venue: venue,
                date: date
            };
            break;
        }
        default: {
            console.log('ERROR: whoops, invalid itinerary item type detected!');
            break;
        }
    }

    return itineraryItem;
}

export default getNewItineraryItem;