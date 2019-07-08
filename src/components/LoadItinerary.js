import React, {useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';

import ActionButton from './ActionButton';

import CONSTANTS from '../constants';
import fetchWithTimeout from '../fetchWithTimeout';

function LoadItinerary({theme, authProps, itinProps}) {
    
  const [feedbackType, setFeedbackType] = useState(CONSTANTS.feedback.none);
  const [feedback, setFeedback] = useState('');
  const [itinList, setItinList] = useState(null);

  function handleFeedbackClick() {
    setFeedback('');
    setFeedbackType(CONSTANTS.feedback.none);
  }

  useEffect(() => {
    cloudLoad();
  }, []);

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
            setFeedback(`Got DB response with ${resJSON.Items.length} itinerary items inside.`);
            setFeedbackType(CONSTANTS.feedback.success);
            return;
        }).catch((err) => {
            setFeedback(err);
            setFeedbackType(CONSTANTS.feedback.failure);
        })
  }
  
  return (
    <div style={getLoadItineraryTheme(theme)}>
      {
        feedback.indexOf('Problem authenticating') > -1 || authProps.user == null ?
        <Redirect to='/login/' /> : null
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
        itinList.map((itin) => {
          console.log(itin);
          console.log(itin.itineraryName);
          return <div>{itin.itineraryName}</div>;
        })
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

export default LoadItinerary;