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
import Input from './Input';
import Notes from './Notes';
import Cost from './Cost';
import ActionButton from './ActionButton';
import CustomSubtype from './CustomSubtype';

function ItemTravel({itemKey, theme, itinerary, setItinerary}) {
    const item = ItineraryHelper.getItineraryItemByKey(itemKey, itinerary);

    // internal handlers
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
    function changeOrigin(newOrigin) {
        item.typeDetails.origin = newOrigin;
        setItinerary(Array.from(itinerary));
    }
    function changeDestination(newDestination) {
        item.typeDetails.destination = newDestination;
        setItinerary(Array.from(itinerary));
    }
    function changeNotes(newNotes) {
        item.notes = newNotes;
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
                Departing{' '}
                <Input
                    placeholder='From'
                    value={item.typeDetails.origin}
                    valueModifier={changeOrigin} />{' '}
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
                <Input
                    placeholder='To'
                    value={item.typeDetails.destination}
                    valueModifier={changeDestination} />{' '}
                <DatePicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.typeDetails.arrivalDate}
                    onChange={handleArrivalChange}
                    // onBlur={whatever}    this will trigger a resort
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />{' '}
                Notes:{' '}
                <Notes
                    notes={item.notes}
                    changeNotes={changeNotes} />{' '}
                <Cost
                    cost={item.cost}
                    handleCostChange={handleCostChange} />
                <ActionButton
                    src={CONSTANTS.images.iconClose}
                    onClick={removeItineraryItem} />
            </ItineraryItem>
        </div>
    );
}

export default ItemTravel;