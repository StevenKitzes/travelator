import React from 'react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // required by above
import ItineraryItem from './ItineraryItem';
import { Portal } from 'react-overlays';

import CONSTANTS from '../constants';
import ItineraryHelper from '../itinerary-helper';

import ActionButton from './ActionButton';

function ItemTravel({itemKey, theme, itinerary, setItinerary}) {
    const item = ItineraryHelper.getItineraryItemByKey(itemKey, itinerary);

    function handleDepartureChange(date) {
        item.typeDetails.departureDate = date;
        setItinerary(Array.from(itinerary));
    }
    function handleArrivalChange(date) {
        item.typeDetails.arrivalDate = date;
        setItinerary(Array.from(itinerary));
    }

    return (
        <ItineraryItem theme={theme}>
            Departing:{' '}
            <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              dateFormat="MMMM d, h:mm aa"
              selected={item.typeDetails.departureDate}
              onChange={handleDepartureChange}
              popperContainer={Portal}
              popperPlacement='auto-right'
              />{' '}
            Arriving:{' '}
            <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              dateFormat="MMMM d, h:mm aa"
              selected={item.typeDetails.arrivalDate}
              onChange={handleArrivalChange}
              popperContainer={Portal}
              popperPlacement='auto-right'
              />
            <ActionButton src={CONSTANTS.images.iconClose} />
            <ActionButton src={CONSTANTS.images.iconUp} verticalMirror />
            <ActionButton src={CONSTANTS.images.iconUp} />
        </ItineraryItem>
    );
}

export default ItemTravel;