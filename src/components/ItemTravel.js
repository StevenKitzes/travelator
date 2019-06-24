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
        item.date = date;
        ItineraryHelper.sortItineraryByDate(itinerary);
        setItinerary(Array.from(itinerary));
    }
    function handleArrivalChange(date) {
        item.typeDetails.secondaryDate = date;
        setItinerary(Array.from(itinerary));
    }
    function handleDepartureBlur() {
        if(item.typeDetails.secondaryDate < item.date) {
            item.typeDetails.secondaryDate = new Date(item.date);
            setItinerary(Array.from(itinerary));
        }
    }
    function handleArrivalBlur() {
        if(item.typeDetails.secondaryDate < item.date) {
            item.date = new Date(item.typeDetails.secondaryDate);
            ItineraryHelper.sortItineraryByDate(itinerary);
            setItinerary(Array.from(itinerary));
        }
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
            <ItineraryItemHeader theme={theme}>
                Travel
            </ItineraryItemHeader>
            <ItineraryItem theme={theme}>
                <ExpandableSelector
                    theme={theme}
                    type={item.type}
                    subtype={item.subtype}
                    changeSubtype={changeSubtype}
                    typeList={CONSTANTS.travelSubtypes} />{' '}
                {item.subtype === CONSTANTS.travelSubtypes.length - 1 ? 
                    <CustomSubtype
                        theme={theme}
                        customType={item.customType}
                        changeCustom={changeCustom} /> :
                    null}{' '}
                Departing{' '}
                <Input
                    theme={theme}
                    placeholder='From'
                    value={item.typeDetails.origin}
                    valueModifier={changeOrigin} />{' '}
                <DatePicker
                    className={theme === CONSTANTS.dark ?
                        'input-dark' :
                        'input-light'}
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.date}
                    onChange={handleDepartureChange}
                    onBlur={handleDepartureBlur}
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />{' '}
                Arriving{' '}
                <Input
                    theme={theme}
                    placeholder='To'
                    value={item.typeDetails.destination}
                    valueModifier={changeDestination} />{' '}
                <DatePicker
                    className={theme === CONSTANTS.dark ?
                        'input-dark' :
                        'input-light'}
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.typeDetails.secondaryDate}
                    onChange={handleArrivalChange}
                    onBlur={handleArrivalBlur}
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />{' '}
                <ActionButton
                    src={CONSTANTS.images.iconClose}
                    onClick={removeItineraryItem} />
                <Cost
                    theme={theme}
                    cost={item.cost}
                    handleCostChange={handleCostChange} />
                <Notes
                    theme={theme}
                    notes={item.notes}
                    changeNotes={changeNotes} />{' '}
            </ItineraryItem>
        </div>
    );
}

export default ItemTravel;