import React, {useState} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './Header';
import Body from './Body';
import Login from './Login';
import Footer from './Footer';

function App() {
  let [theme, setTheme] = useState('light');
  let [itinerary, setItinerary] = useState([]);

  return (
    <div style={appStyles}>
      <Header theme={theme} setTheme={setTheme} />
      <Router>
        <Route exact path='/' render={
          (routeProps) => { return (
            <Body {...routeProps} theme={theme} itinerary={itinerary} setItinerary={setItinerary} />
          ); }
        } />
        <Route exact path='/login/' render={
          (routeProps) => { return (
            <Login {...routeProps} theme={theme} />
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