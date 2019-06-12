import React, {useState} from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

function App() {
  let [theme, setTheme] = useState('light');
  let [itinerary, setItinerary] = useState([]);

  return (
    <div style={appStyles}>
      <Header theme={theme} setTheme={setTheme} />
      <Body theme={theme} itinerary={itinerary} setItinerary={setItinerary} />
      <Footer theme={theme} />
    </div>
  );
}

const appStyles = {
  textAlign: 'center'
};
  
export default App;