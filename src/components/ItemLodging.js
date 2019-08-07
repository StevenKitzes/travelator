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

function ItemLodging({itemKey, theme, itinerary, setItinerary}) {
    const item = ItineraryHelper.getItineraryItemByKey(itemKey, itinerary);

    // internal handlers
    function handleArrivalChange(date) {
        item.date = date;
        checkArrivalExceedsDeparture();
    }
    function handleDepartureChange(date) {
        item.typeDetails.secondaryDate = date;
        checkDeparturePrecedesArrival();
    }
    function handleArrivalBlur() {
        checkArrivalExceedsDeparture();
    }
    function handleDepartureBlur() {
        checkDeparturePrecedesArrival();
    }

    function checkArrivalExceedsDeparture() {
        if(item.typeDetails.secondaryDate < item.date) {
            item.typeDetails.secondaryDate = new Date(item.date);
        }
        sortAndSetItinerary();
    }
    function checkDeparturePrecedesArrival() {
        if(item.typeDetails.secondaryDate < item.date) {
            item.date = new Date(item.typeDetails.secondaryDate);
        }
        sortAndSetItinerary();
    }

    function sortAndSetItinerary() {
        ItineraryHelper.sortItineraryByDate(itinerary);
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
    function changeLodging(newLodging) {
        item.typeDetails.lodging = newLodging;
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
        <ItineraryItemHeader theme={theme} day={item.date.getDay()}>
            Lodging
        </ItineraryItemHeader>
            <ItineraryItem theme={theme}>
                <ExpandableSelector
                    theme={theme}
                    type={item.type}
                    subtype={item.subtype}
                    changeSubtype={changeSubtype}
                    typeList={CONSTANTS.lodgingSubtypes} />{' '}
                {item.subtype === CONSTANTS.lodgingSubtypes.length - 1 ? 
                    <CustomSubtype
                        theme={theme}
                        customType={item.customType}
                        changeCustom={changeCustom} /> :
                    null}{' '}
                At:{' '}
                <Input
                    theme={theme}
                    placeholder='Where'
                    value={item.typeDetails.lodging}
                    valueModifier={changeLodging} />{' '}
                Arriving:{' '}
                <DatePicker
                    className={theme === CONSTANTS.dark ?
                        'input-dark' :
                        'input-light'}
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={Date.parse(item.date)}
                    onChange={handleArrivalChange}
                    onBlur={handleArrivalBlur}
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />{' '}
                Departing:{' '}
                <DatePicker
                    className={theme === CONSTANTS.dark ?
                        'input-dark' :
                        'input-light'}
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={Date.parse(item.typeDetails.secondaryDate)}
                    onChange={handleDepartureChange}
                    onBlur={handleDepartureBlur}
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

export default ItemLodging;