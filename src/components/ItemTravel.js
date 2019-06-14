import React, {useState} from 'react';

import CONSTANTS from './../constants';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // required by above
import ItineraryItem from './ItineraryItem';

function ItemTravel({notes, clickHandler}) {
    const [startDate, setStartDate] = useState(new Date());

    function handleChange(date) {
        setStartDate(date);
    }

    return (
        <ItineraryItem onClick={clickHandler}>
            Departing: <DatePicker
              selected={startDate}
              onChange={handleChange}
              />
            {notes}
        </ItineraryItem>
    );
}

export default ItemTravel;