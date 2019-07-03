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

function ItemActivity({itemKey, theme, itinerary, setItinerary}) {
    const item = ItineraryHelper.getItineraryItemByKey(itemKey, itinerary);

    // internal handlers
    function handleDateChange(date) {
        item.date = date;
        sortAndSetItinerary();
    }
    function handleDateBlur() {
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
    function changeVenue(newVenue) {
        item.typeDetails.venue = newVenue;
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
            Activity
        </ItineraryItemHeader>
            <ItineraryItem theme={theme}>
                <ExpandableSelector
                    theme={theme}
                    type={item.type}
                    subtype={item.subtype}
                    changeSubtype={changeSubtype}
                    typeList={CONSTANTS.activitySubtypes} />{' '}
                <CustomSubtype
                    theme={theme}
                    customType={item.customType}
                    changeCustom={changeCustom} />{' '}
                Where:{' '}
                <Input
                    theme={theme}
                    placeholder='Where'
                    value={item.typeDetails.venue}
                    valueModifier={changeVenue} />{' '}
                When:{' '}
                <DatePicker
                    className={theme === CONSTANTS.dark ?
                        'input-dark' :
                        'input-light'}
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.date}
                    onChange={handleDateChange}
                    onBlur={handleDateBlur}
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

export default ItemActivity;