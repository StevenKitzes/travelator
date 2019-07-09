import React, {useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';

import ItineraryListItem from './ItineraryListItem';
import ActionButton from './ActionButton';
import DeleteButton from './DeleteButton';

import CONSTANTS from '../constants';
import fetchWithTimeout from '../fetchWithTimeout';

function LoadItinerary({theme, authProps, itinProps}) {
  const colors = theme === CONSTANTS.dark ?
    CONSTANTS.colors.dark :
    CONSTANTS.colors.light;
  
  const [feedbackType, setFeedbackType] = useState(CONSTANTS.feedback.none);
  const [feedback, setFeedback] = useState('');
  const [itinList, setItinList] = useState(null);
  const [sendHome, setSendHome] = useState(false);
  
  useEffect(cloudLoad, []);
  
  function cloudLoad() {
    // interrupt by returning to index if someone tried to reach itinerary loading without being logged in
    if(!authProps.user) {
      console.log('no user, cancelling cloud load');
      return;
    }
    
    const options = {
      method: 'post',
      headers: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        token: authProps.user.signInUserSession.accessToken.jwtToken,
        username: authProps.user.username
      })
    };
    fetchWithTimeout('http://localhost:8080/load-itinerary/', options, 3000)
    .then((res) => {
      return res.json();
    }).then((resJSON) => {
      if(resJSON.error) {
        setFeedback(resJSON.error);
        setFeedbackType(CONSTANTS.feedback.failure);
        return;
      }
      setItinList(resJSON.Items);
      return;
    }).catch((err) => {
      setFeedback(err);
      setFeedbackType(CONSTANTS.feedback.failure);
    })
  }
  
  function cloudDelete(itineraryName) {
    // interrupt by returning to index if someone tried to reach itinerary loading without being logged in
    if(!authProps.user) {
      console.log('no user, cancelling cloud load');
      return;
    }
    
    const options = {
      method: 'post',
      headers: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        token: authProps.user.signInUserSession.accessToken.jwtToken,
        username: authProps.user.username,
        itineraryName
      })
    };
    fetchWithTimeout('http://localhost:8080/delete-itinerary/', options, 3000)
    .then((res) => {
      return res.json();
    }).then((resJSON) => {
      if(resJSON.error) {
        setFeedback(resJSON.error);
        setFeedbackType(CONSTANTS.feedback.failure);
        return;
      }
      cloudLoad();
      setFeedback('Deleted ' + itineraryName);
      setFeedbackType(CONSTANTS.feedback.failure);
      return;
    }).catch((err) => {
      setFeedback(err.toString());
      setFeedbackType(CONSTANTS.feedback.failure);
    })
  }
  
  function handleFeedbackClick() {
    setFeedback('');
    setFeedbackType(CONSTANTS.feedback.none);
  }

  function handleItinerarySelection(event) {
    const clickedName = event.target.id;
    for(let i = 0; i < itinList.length; i++) {
      if(clickedName === itinList[i].itineraryName) {
        const itinerary = JSON.parse(itinList[i].itinerary);
        for(let item = 0; item < itinerary.length; item++) {
          itinerary[item].date = new Date(itinerary[item].date);
          if(itinerary[item].typeDetails) {
            itinerary[item].typeDetails.secondaryDate = new Date(itinerary[item].typeDetails.secondaryDate);
          }
        }
        itinProps.setItinerary(itinerary);
        itinProps.setItineraryName(clickedName);
        setSendHome(true);
        return;
      }
    }
  }

  function handleDeleteItineraryItem(event) {
    event.stopPropagation();
    const clickedName = event.target.id;
    for(let i = 0; i < itinList.length; i++) {
      if(clickedName === itinList[i].itineraryName) {
        setFeedback('Attempting to delete ' + clickedName + ' . . .');
        setFeedbackType(CONSTANTS.feedback.warning);
        cloudDelete(clickedName);
        return;
      }
    }
  }
  
  return (
    <div style={getLoadItineraryTheme(colors)}>
      {
        authProps.user == null ?
        <Redirect to='/login/' /> : null
      }
      {
        sendHome ?
        <Redirect to='/' /> : null
      }
      { /** itineraries received */
        itinList && Array.isArray(itinList) && itinList.length > 0 ?
        <h3 style={titleStyle}>Your itineraries:</h3>
        : null
      }
      {/** feedback */}
      <div style={getFeedbackStyle(feedbackType)} onClick={handleFeedbackClick}>
          {feedback} <ActionButton src={CONSTANTS.images.iconClose} />
      </div>
      { /** itinList not yet populated/no server response */
        itinList === null ? <h6>Itineraries loading...</h6> : null
      }
      { /** empty list returned */
        itinList && Array.isArray(itinList) && itinList.length < 1 ? <h6>This account has no associated itineraries.</h6> : null
      }
      { /** itineraries received */
        itinList && Array.isArray(itinList) && itinList.length > 0 ?
        <div>
          {
            itinList.map((itin) => {
              const id = itin.itineraryName;
              return (
                <div key={id}>
                  <ItineraryListItem
                    id={id}
                    theme={theme}
                    onClick={handleItinerarySelection}>
                    {itin.itineraryName}
                  </ItineraryListItem>
                  <DeleteButton
                    id={id}
                    onClick={handleDeleteItineraryItem}
                    title='Warning: this cannot be undone!'>
                      Delete
                  </DeleteButton>
                </div>
              );
            })
          }
        </div>
        : null
      }
    </div>
  );
}

function getLoadItineraryTheme(colors) {
  return {
    backgroundColor: colors.bg,
    border: 'none',
    color: colors.text,
    height: 'calc(100% - 18em)',
    overflowY: 'auto',
    position: 'fixed',
    textAlign: 'center',
    top: CONSTANTS.headerHeight,
    width: '100%'
  }
}
function getFeedbackStyle(feedbackType) {
    const style = {
        borderStyle: 'solid',
        borderRadius: '.3rem',
        color: 'black',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        margin: '.5rem',
        padding: '.3rem .6rem'
    };
    switch(feedbackType) {
        case CONSTANTS.feedback.success:
            style.display = 'inline-block';
            style.backgroundColor = 'lightgreen';
            style.borderStyle = 'solid';
            style.borderColor = 'green';
            break;
        case CONSTANTS.feedback.warning:
            style.display = 'inline-block';
            style.backgroundColor = 'lightyellow';
            style.borderStyle = 'solid';
            style.borderColor = 'goldenrod';
            break;
        case CONSTANTS.feedback.failure:
            style.display = 'inline-block';
            style.backgroundColor = 'lightpink';
            style.borderStyle = 'solid';
            style.borderColor = 'red';
            break;
        case CONSTANTS.feedback.none:
        default:
            style.display = 'none';
            break;
    }
    return style;
}
const titleStyle = {
  margin: '.5rem'
}

export default LoadItinerary;