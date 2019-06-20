import CONSTANTS from './constants';

const helper = {

    getItineraryItemByKey: function(key, itinerary) {
        for(let i = 0; i < itinerary.length; i++) {
            if(itinerary[i].key === key) return itinerary[i];
        }
    },
    
    removeItineraryItemByKey: function(key, itinerary, setItinerary) {
        for(let index = 0; index < itinerary.length; index++) {
            if(itinerary[index].key === key) {
                itinerary.splice(index, 1);
                setItinerary(Array.from(itinerary));
                return;
            }
        }
    },

    sortItineraryByDate: function(itinerary) {
        try {
            itinerary.sort((a,b) => {
                let dateA, dateB;
                switch (a.type) {
                    case CONSTANTS.travelType:
                        dateA = a.typeDetails.departureDate;
                        break;
                    case CONSTANTS.lodgingType:
                        dateA = a.typeDetails.arrivalDate;
                        break;
                    case CONSTANTS.activityType:
                    case CONSTANTS.foodType:
                        dateA = a.typeDetails.date;
                        break;
                    default:
                        throw new TypeError('Unknown itinerary item type.');
                }
                switch (b.type) {
                    case CONSTANTS.travelType:
                        dateB = b.typeDetails.departureDate;
                        break;
                    case CONSTANTS.lodgingType:
                        dateB = b.typeDetails.arrivalDate;
                        break;
                    case CONSTANTS.activityType:
                    case CONSTANTS.foodType:
                        dateB = b.typeDetails.date;
                        break;
                    default:
                        throw new TypeError('Unknown itinerary item type.');
                }
                if(dateA < dateB) return -1;
                if(dateA > dateB) return 1;
                return 0;
            });
        } catch(err) {
            console.log(err.toString());
        }
    }
    
};

export default helper;