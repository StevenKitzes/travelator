import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import Header from './Header';
import Body from './Body';
import Login from './Login';
import PasswordReset from './PasswordReset';
import PasswordResetComplete from './PasswordResetComplete';
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
    Promise.all([
      Auth.currentSession(),
      Auth.currentAuthenticatedUser()])
    .then(([session, user]) => {
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
        <Route exact path='/' render={
          (routeProps) => { return (
            <Body
              {...routeProps}
              theme={theme}
              itinProps={itinProps}
              authProps={authProps} />
          ); }
        } />
        <Route exact path='/login/' render={
          (routeProps) => { return (
            <Login
              {...routeProps}
              theme={theme}
              authProps={authProps} />
          ); }
        } />
        <Route exact path='/password-reset/' render={
          (routeProps) => { return (
            <PasswordReset
              {...routeProps}
              theme={theme}
              authProps={authProps} />
          ); }
        } />
        <Route exact path='/password-reset-complete/' render={
          (routeProps) => { return (
            <PasswordResetComplete
              {...routeProps}
              theme={theme}
              authProps={authProps} />
          ); }
        } />
      </Router>
      <Footer theme={theme} />
    </div>
  );
}

const appStyles = {
  textAlign: 'center'
};
  
export default App;