import CONSTANTS from './constants';
import uuid from 'uuid/v4';

const Factory = {};

Factory.detailed = function(
    // generics
    type, subtype = 0, customType = '', notes = '', cost = 0,
    // specifics
    date = null, secondaryDate = null, origin = '', destination = '',
    lodging = '', venue = ''
) {
    if(!date) {
        date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    }
    const itineraryItem = {
        type: type,
        subtype: subtype,
        customType: customType,
        date: new Date(date),
        notes: notes,
        cost: cost,
        key: uuid(),

        typeDetails: null
    };

    switch(type) {
        case CONSTANTS.travelType: {
            if(!secondaryDate) {
                secondaryDate = new Date();
                secondaryDate.setMinutes(0);
                secondaryDate.setSeconds(0);
                secondaryDate.setMilliseconds(0);
            }
            itineraryItem.typeDetails = {
                origin: origin,
                destination: destination,
                secondaryDate: new Date(secondaryDate)
            };
            break;
        }
        case CONSTANTS.lodgingType: {
            if(!secondaryDate) {
                secondaryDate = new Date();
                secondaryDate.setMinutes(0);
                secondaryDate.setSeconds(0);
                secondaryDate.setMilliseconds(0);
            }
            itineraryItem.typeDetails = {
                lodging: lodging,
                secondaryDate: new Date(secondaryDate)
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
                date: new Date(date)
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
                date: new Date(date)
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
Factory.simple = function(type, date) {
    return Factory.detailed(type, undefined, undefined, undefined, undefined, date);
}

export default Factory;