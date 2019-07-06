import React, {useState, useEffect} from 'react';

import ActionButton from './ActionButton';

import CONSTANTS from '../constants';
import fetchWithTimeout from '../fetchWithTimeout';

function LoadItinerary({theme, authProps, itinProps}) {
    
  const [feedbackType, setFeedbackType] = useState(CONSTANTS.feedback.none);
  const [feedback, setFeedback] = useState('');

  function handleFeedbackClick() {
    setFeedback('');
    setFeedbackType(CONSTANTS.feedback.none);
  }
  
  useEffect(() => {
    setFeedback('working');
    setFeedbackType(CONSTANTS.feedback.success);
  }, []);

  function cloudLoad() {
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
            setFeedback(resJSON.message);
            setFeedbackType(CONSTANTS.feedback.success);
            return;
        }).catch((err) => {
            setFeedback(err);
            setFeedbackType(CONSTANTS.feedback.failure);
        })
  }

  return (
    <div style={getLoadItineraryTheme(theme)}>
      <p>Itineraries to load</p>
      {/** feedback */}
      <div style={getFeedbackStyle(feedbackType)} onClick={handleFeedbackClick}>
          {feedback} <ActionButton src={CONSTANTS.images.iconClose} />
      </div>
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