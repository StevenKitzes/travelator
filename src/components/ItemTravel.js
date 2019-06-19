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
import Cost from './Cost';
import ActionButton from './ActionButton';
import CustomSubtype from './CustomSubtype';

function ItemTravel({itemKey, theme, itinerary, setItinerary}) {
    const item = ItineraryHelper.getItineraryItemByKey(itemKey, itinerary);

    // internal handlers
    function handleCustomChange(event) {
        item.customType = event.target.value;
        setItinerary(Array.from(itinerary));
    }
    function handleDepartureChange(date) {
        item.typeDetails.departureDate = date;
        setItinerary(Array.from(itinerary));
    }
    function handleArrivalChange(date) {
        item.typeDetails.arrivalDate = date;
        setItinerary(Array.from(itinerary));
    }
    function handleCostChange(event) {
        if(isNaN(event.target.value)) {
            return;
        }
        item.cost = event.target.value;
        setItinerary(Array.from(itinerary));
    }

    // functions to be passed as props
    function changeSubtype(newType) {
        item.subtype = newType;
        setItinerary(Array.from(itinerary));
    }
    function changeCustom(newCustom) {
        item.customType = newCustom;
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
                {item.subtype === CONSTANTS.travelSubtypes.length - 1 ? 
                    <CustomSubtype
                        customType={item.customType}
                        changeCustom={changeCustom} /> :
                    null}{' '}
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
                <Cost
                    cost={item.cost}
                    handleCostChange={handleCostChange} />
            </ItineraryItem>
        </div>
    );
}

export default ItemTravel;