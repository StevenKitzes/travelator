import CONSTANTS from './constants';
import uuid from 'uuid/v4';

function getNewItineraryItem(type) {
    const itineraryItem = {
        type: type,
        subtype: '',
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
                departureDate: new Date(),
                destination: '',
                arrivalDate: new Date()
            };
            break;
        case CONSTANTS.lodgingType:
            itineraryItem.typeDetails = {
                arrivalDate: new Date(),
                departureDate: new Date()
            };
            break;
        case CONSTANTS.activityType:
            itineraryItem.typeDetails = {
                date: new Date(),
                durationHours: 0
            };
            break;
        case CONSTANTS.foodType:
            itineraryItem.typeDetails = {
                date: new Date()
            };
            break;
        default:
            console.log('ERROR: whoops, invalid itinerary item type detected!');
            break;
    }

    return itineraryItem;
}

export default getNewItineraryItem;