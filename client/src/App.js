import React from 'react';
import AppNavbar from './components/AppNavbar';
import Main from './components/Main';
import {Provider} from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {

  render() {
    return (
     
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <Main/>
        </div>
      </Provider>
    );
  }   
}

export default App;
