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
                if(a.date < b.date) return -1;
                if(a.date > b.date) return 1;
                return 0;
            });
        } catch(err) {
            console.log(err.toString());
        }
    },

    getLatestDate: function(itinerary) {
        if(itinerary.length === 0) {
            let date = new Date();
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        }
        return itinerary[itinerary.length-1].date;
    },

    getTotalCost: function(itinerary) {
        let cost = 0;
        itinerary.forEach((item) => {
            cost += parseFloat(item.cost) || 0;
        });
        return cost;
    }
    
};

export default helper;