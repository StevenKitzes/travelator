import React, {useState} from 'react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // required by above
import ItineraryItem from './ItineraryItem';
import { Portal } from 'react-overlays';

function ItemTravel({details}) {
    const [startDate, setStartDate] = useState(details.typeDetails.departureDate);

    function handleChange(date) {
        setStartDate(date);
    }

    return (
        <ItineraryItem>
            Departing: 
            <DatePicker
              selected={startDate}
              onChange={handleChange}   // TODO: this should be a drill-down from itinerary item
              popperContainer={Portal}
              />
        </ItineraryItem>
    );
}

export default ItemTravel;