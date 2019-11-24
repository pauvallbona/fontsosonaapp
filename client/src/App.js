import React from 'react';
import AppNavbar from './components/AppNavbar';
import Map from './components/Map.js';
import {Provider} from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {

  state = {
    modal: false,
    infor: []
}

seleccionar = () => {
  
    console.log ('seleccionat')
}
  render() {
    return (
     
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <Map/>
        </div>
      </Provider>
    );
  }
  
 
}

export default App;
