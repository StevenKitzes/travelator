import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Auth } from 'aws-amplify';

import Header from './Header';
import Body from './Body';
import Login from './Login';
import Footer from './Footer';

function App() {
  const [theme, setTheme] = useState('light');
  const [itinerary, setItinerary] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const authProps = {
    authenticated, setAuthenticated, user, setUser
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
      <Header theme={theme} setTheme={setTheme} />
      <Router>
        <Route exact path='/' render={
          (routeProps) => { return (
            <Body
              {...routeProps}
              theme={theme}
              itinerary={itinerary}
              setItinerary={setItinerary}
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
      </Router>
      <Footer theme={theme} />
    </div>
  );
}

const appStyles = {
  textAlign: 'center'
};
  
export default App;