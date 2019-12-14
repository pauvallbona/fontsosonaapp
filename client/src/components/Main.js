import React from 'react';
import Llista from './Llista.js';
import Map from './Map.js';

class Main extends React.Component {
 
  state = {
    llista: false,
    mapa: true,
}

  maintoggle= () => {
    this.setState({
        llista: !this.state.llista,
        mapa: !this.state.mapa
    });
    let nom = document.getElementById("maintoggle").innerHTML
    function cambiarnom (nom){
      if (nom === "Llista") {
        return "Mapa"}
      else { 
        return "Llista"}
    }
    document.getElementById("maintoggle").innerHTML = cambiarnom(nom)
}
  componentDidMount() {
    document.getElementById("maintoggle").addEventListener("click", this.maintoggle);
  }
  
  render() {
    return (
     
       <div>
          {this.state.mapa ? <Map/> : null}
          {this.state.llista ? <Llista/> : null}
      </div>
    );
  }
}

export default Main;
