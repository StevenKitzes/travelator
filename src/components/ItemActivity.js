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
        item.typeDetails.date = date;
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
            <ItineraryItemHeader>Activity</ItineraryItemHeader>
            <ItineraryItem theme={theme}>
                <ExpandableSelector
                    theme={theme}
                    type={item.type}
                    subtype={item.subtype}
                    changeSubtype={changeSubtype}
                    typeList={CONSTANTS.activitySubtypes} />{' '}
                <CustomSubtype
                    customType={item.customType}
                    changeCustom={changeCustom} />{' '}
                Where:{' '}
                <Input
                    placeholder='Where'
                    value={item.typeDetails.venue}
                    valueModifier={changeVenue} />{' '}
                Date/time:{' '}
                <DatePicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    dateFormat="MMM d, HH:mm"
                    selected={item.typeDetails.date}
                    onChange={handleDateChange}
                    // onBlur={whatever}    this will trigger a resort
                    popperContainer={Portal}
                    popperPlacement='auto-right'
                    />{' '}
                <ActionButton
                    src={CONSTANTS.images.iconClose}
                    onClick={removeItineraryItem} />
                <Cost
                    cost={item.cost}
                    handleCostChange={handleCostChange} />
                <Notes
                    notes={item.notes}
                    changeNotes={changeNotes} />{' '}
            </ItineraryItem>
        </div>
    );
}

export default ItemActivity;