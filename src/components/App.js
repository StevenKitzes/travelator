import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { buildCurrentUser } from '../auth-helper';

import Header from './Header';
import Body from './Body';
import Login from './Login';
import PasswordReset from './PasswordReset';
import PasswordResetComplete from './PasswordResetComplete';
import LoadItinerary from './LoadItinerary';
import Footer from './Footer';

function App() {
  const [theme, setTheme] = useState('light');
  const [itineraryName, setItineraryName] = useState('');
  const [itinerary, setItinerary] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const authProps = {
    authenticated, setAuthenticated, user, setUser
  }
  const itinProps = {
    itinerary, setItinerary, itineraryName, setItineraryName
  }

  // auth session management
  useEffect(() => {
    buildCurrentUser()
    .then((user) => {
      const exp = user.signInUserSession.accessToken.payload.exp;
      if(exp) {
        const now = Math.floor(Date.now()/1000);
        if(now > exp) {
          setUser(null);
          setAuthenticated(false);
          return;
        }
      }
      setUser(user);
      setAuthenticated(true);
    })
    .catch((caught) => {
      console.log(caught);
    });
  }, []);

  return (
    <div style={appStyles}>
      <Header
        theme={theme}
        setTheme={setTheme}
        authProps={authProps} />
      <Router>
        <Routes>
          <Route path='/' element={
            <Body
              theme={theme}
              itinProps={itinProps}
              authProps={authProps} />
          } />
          <Route path='/login/' element={
            <Login
              theme={theme}
              authProps={authProps} />
          } />
          <Route path='/password-reset/' element={
            <PasswordReset
              theme={theme}
              authProps={authProps} />
          } />
          <Route path='/password-reset-complete/' element={
            <PasswordResetComplete
              theme={theme}
              authProps={authProps} />
          } />
          <Route path='/load-itinerary/' element={
            <LoadItinerary
              theme={theme}
              itinProps={itinProps}
              authProps={authProps} />
          } />
        </Routes>
      </Router>
      <Footer theme={theme} />
    </div>
  );
}

const appStyles = {
  textAlign: 'center'
};
  
export default App;