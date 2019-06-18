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
    }
    
};

export default helper;