const helper = {
    getItineraryItemByKey: function(key, itinerary) {
        for(let i = 0; i < itinerary.length; i++) {
            if(itinerary[i].key === key) return itinerary[i];
        }
    }
};

export default helper;