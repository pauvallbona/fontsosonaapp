import React from 'react';
import L from 'leaflet';
import {connect} from 'react-redux';
import {getItems} from '../actions/itemActions';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import Chart from 'chart.js';

class Map extends React.Component {

  

  componentDidMount() {
    this.props.getItems();
    const mymap = L.map('mapa',{minZoom: 9}).setView([41.984650, 2.256159], 11)
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreet'
    })
    tiles.addTo(mymap);

    var myIcon = L.icon({
      iconUrl: 'marker.png',
      iconSize: [25,28],
      iconAnchor:[13,28],
      popupAnchor:[0,-15]})
    
    function info ({item}, grauslat, grauslon) {
      const popup = L.popup({maxWidth: '1000', maxHeight: '600', closeButton:false, minWidth: '850'})
      .setLatLng ([grauslon.substr(0,7),grauslat.substr(0,6)])
      .setContent (`
      <button class="trans" id="nom">${item.info["0"].informació["0"].nom} </button> 
      <div class= "dreta">
      <ul id= "info"> 
      <li id="municipi">${item.info["0"].informació["0"].municipi}</li> 
      <li id="alt">Altura : ${item.info["0"].informació["0"].alçada} m</li>
      <li id="coords">Coordenades: ${grauslon.substr(0,5)}ºN , ${grauslat.substr(0,5)}ºE</li> 
      </ul>
      <canvas id="myChart" width="100%" height="100%"></canvas>
      </div>
      <div class= "recullhist"> 
      <p>${item.info["0"].informació["0"].recullhistòric} </p>
      <p id="citació">${item.info["0"].informació["0"].citació} </p>
      </div>
      <div style="height: 300px"></div>
      `) 

      
      const popup1 = L.popup({closeButton:false})
      .setLatLng ([grauslon.substr(0,7),grauslat.substr(0,6)])
      .setContent (`<button class="trans" id="nom1">${item.info["0"].informació["0"].nom} </button>`)
      
      const anàlisis =[]
      const anys = []
      const límit = []
      const analitiques = item.info["0"].aigua.split('-')
      analitiques.forEach((anàlisi) => {
        const dades = anàlisi.split('	')
        if (dades['7']==="") {
          const any = dades['11']
          const nitrats = dades['13']
          if (nitrats != 0) {
            anàlisis.push(nitrats)
            anys.push (any.substr(3,9))
            límit.push(50)
          }
        }
        else{ 
          if (dades['2']!== undefined) {
            const any = dades['1']
            const nitrats = dades['3']
            if (nitrats != 0) {
              anàlisis.push(nitrats)
              anys.push(any.substr(3,9))
              límit.push(50)
            }
          }
        } 
        })

      L.marker([grauslon.substr(0,7),grauslat.substr(0,6)], {icon: myIcon}).addTo(mymap)
      .on("mouseover", function(e) {e.target.bindPopup(popup1).openPopup(); e.target.bindPopup(popup)})
      .on('mouseout', function(e){e.target.bindPopup(popup1).closePopup()})
      .on('click', function(){

        setTimeout(()=>{
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: anys,
              datasets: [
                {
                  label: 'Quantitat de Nitrats',
                  data: anàlisis,
                  backgroundColor: "transparent",
                  borderColor: "blue",
                  borderWidth: 1.5
                },
                {
                  label: 'Límit',
                  data: límit,
                  backgroundColor: "transparent",
                  borderColor: "red",
                  borderWidth: 2,
                  pointStyle: 'line'
                }
            ]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                        max: 450,
                          beginAtZero: true
                      }
                  }]
              }
          }
      });})})
      
    }

    setTimeout(()=>{
      const {items} = this.props.item;
      items.forEach((item) => {
        const prelat = item.info["0"].informació["0"].coordenades.lat.split(' ')
        const prelon = item.info["0"].informació["0"].coordenades.lon.split(' ')
        
          if (prelat["0"].substr(0,prelat["0"].length-1).valueOf() != 0 && prelon["0"].substr(0,prelon["0"].length-1).valueOf() != 0) {
            if (prelat["0"].charAt(0)!== '"'){
            function fpunlat () {
              if (prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60 < 0.1) {
              return '.0'}
              else {return '.'}
            }
            function fpunlon () {
              if (prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60 < 0.1) {
                return '.0'
              }
              else {return '.'}
              
            } 
            const grauslat = `${prelat["0"].substr(0,prelat["0"].length-1).valueOf()+ fpunlat() + ((prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60)+(prelat["2"].substr(0,prelat["2"].length-2).valueOf()/3600))*1000000}`
            const grauslon = `${prelon["0"].substr(0,prelon["0"].length-1).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`
            info({item}, grauslat, grauslon) 
              } 
              if (prelat["0"].charAt(0)=== '"' ){
                console.log(prelat,prelon)
                function fpunlat () {
                  if (prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60 < 0.1) {
                  return '.0'}
                  else {return '.'}
                }
                function fpunlon () {
                  if (prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60 < 0.1) {
                    return '.0'
                  }
                  else {return '.'}
                  
                } 
                if (prelat["0"].substr(1,prelat["0"].length-2).valueOf() > 0){
                const grauslat = `${prelat["0"].substr(1,prelat["0"].length-2).valueOf()+ fpunlat() + ((prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60)+(prelat["2"].substr(0,prelat["2"].length-2).valueOf()/3600))*1000000}`
                const grauslon = `${prelon["0"].substr(1,prelon["0"].length-2).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`
                console.log(item.info["0"].informació["0"].nom, grauslat,grauslon)
                info({item}, grauslat, grauslon) 
                }
                  }
          }
      }) 
    }, 1000); 
  }

  render() {
    return (
      <div id="mapa" style={{ position: 'absolute', top: '7.5%', height: '92.5%', width: '100%', zIndex:0}} ></div>)
  }
}

Map.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    item: state.item
});
export default connect(mapStateToProps, {getItems})(Map);
