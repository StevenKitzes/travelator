import React from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';    // required by DatePicker
import '../react-datepicker-override.css';
import { Portal } from 'react-overlays';                // required by DatePicker

import CONSTANTS from '../constants';
import ItineraryHelper from '../itinerary-helper';

import ItineraryItemHeader from './ItineraryItemHeader';
import ItineraryItem from './ItineraryItem';
import ExpandableSelector from './ExpandableSelector';
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
    function changeSubtype(newType) {
        item.subtype = newType;
        setItinerary(Array.from(itinerary));
    }
    function removeItineraryItem() {
        ItineraryHelper.removeItineraryItemByKey(itemKey, itinerary, setItinerary);
    }

    return (
        <div>
            <ItineraryItemHeader>Travel</ItineraryItemHeader>
            <ItineraryItem theme={theme}>
                <ExpandableSelector
                    theme={theme}
                    type={item.type}
                    subtype={item.subtype}
                    changeSubtype={changeSubtype}
                    typeList={CONSTANTS.travelSubtypes} />{' '}
                Departing:{' '}
                <DatePicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.typeDetails.departureDate}
                    onChange={handleDepartureChange}
                    // onBlur={whatever}    this will trigger a resort
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />{' '}
                Arriving:{' '}
                <DatePicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.typeDetails.arrivalDate}
                    onChange={handleArrivalChange}
                    // onBlur={whatever}    this will trigger a resort
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />
                <ActionButton
                    src={CONSTANTS.images.iconClose}
                    onClick={removeItineraryItem} />
            </ItineraryItem>
        </div>
    );
}

export default ItemTravel;