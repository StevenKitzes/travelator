import React, {useState} from 'react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // required by above
import ItineraryItem from './ItineraryItem';
import { Portal } from 'react-overlays';

function ItemTravel({notes, clickHandler}) {
    const [startDate, setStartDate] = useState(new Date());

    function handleChange(date) {
        setStartDate(date);
    }

    return (
        <ItineraryItem onClick={clickHandler}>
            Departing: 
            <DatePicker
              selected={startDate}
              onChange={handleChange}
              popperContainer={Portal}
              />
            {notes}
        </ItineraryItem>
    );
}

export default ItemTravel;