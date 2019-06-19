import CONSTANTS from './constants';
import uuid from 'uuid/v4';

function getNewItineraryItem(type) {
    const itineraryItem = {
        type: type,
        subtype: 0,
        customType: '',
        cost: 0,
        notes: '',
        key: uuid(),

        typeDetails: null
    };

    switch(type) {
        case CONSTANTS.travelType:
            itineraryItem.typeDetails = {
                origin: '',
                departureDate: (new Date()).setMinutes(0),
                destination: '',
                arrivalDate: (new Date()).setMinutes(0)
            };
            break;
        case CONSTANTS.lodgingType:
            itineraryItem.typeDetails = {
                arrivalDate: (new Date()).setMinutes(0),
                departureDate: (new Date()).setMinutes(0)
            };
            break;
        case CONSTANTS.activityType:
            itineraryItem.typeDetails = {
                date: (new Date()).setMinutes(0),
                durationHours: 0
            };
            break;
        case CONSTANTS.foodType:
            itineraryItem.typeDetails = {
                date: (new Date()).setMinutes(0)
            };
            break;
        default:
            console.log('ERROR: whoops, invalid itinerary item type detected!');
            break;
    }

    return itineraryItem;
}

export default getNewItineraryItem;