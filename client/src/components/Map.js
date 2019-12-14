import React from 'react';
import L from 'leaflet';
import {connect} from 'react-redux';
import {getItems} from '../actions/itemActions';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import Chart from 'chart.js';
import LeafletSearch from 'leaflet-search'
import 'leaflet-search/src/leaflet-search.css';

class Map extends React.Component {

  componentDidMount() {
    this.props.getItems();
    const mapa = L.map('mapa',{minZoom: 10}).setView([41.974650, 2.256159], 11)
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreet'
    })
    tiles.addTo(mapa);
    
    const markersLayer = new L.LayerGroup();
    mapa.addLayer(markersLayer);

    var controlSearch = new LeafletSearch({
      position:'topleft',
      layer: markersLayer,
      intial: false,
      zoom: 17,
      marker: false,
      textPlaceholder: 'Buscar...',
      firstTipSubmit: true,
      
    });
    mapa.addControl(controlSearch);
    
    controlSearch.on('search:collapsed', function(e) {
      mapa.setView([41.974650, 2.256159], 11)
    })

    var myIcon = L.icon({
      iconUrl: 'marker.png',
      iconSize: [25,28],
      iconAnchor:[13,28],
      popupAnchor:[0,-15]})

      const popupwidth = window.screen.width * 73 / 100
      const popupheight = window.screen.height - window.screen.height/3.5
    
   

    
    function info ({item}, grauslat, grauslon) {
      function alça (alçada){
        if (alçada > 0) {
          return `<li id="alt">Altura : ${alçada} m</li>`
        }
        else {
          return " "
        }
      }
      function recullhist (recull){
        if (recull !== "-") {
          return recull
        }
        else {
          return `<p id="citació">No s'ha trobat informació</p>`
        }
      }
      function citar (citació){
        if (citació !== "-") {
          return citació
        }
        else {
          return " "
        }
      }
  
      const recullhistòric = recullhist(item.info["0"].informació["0"].recullhistòric)
      const alçada = alça(item.info["0"].informació["0"].alçada)
      const citació = citar(item.info["0"].informació["0"].citació)
        
      const popup = L.popup({maxWidth: `${popupwidth}`, maxHeight: `${popupheight}`, closeButton:false, minWidth: '850'})
      .setLatLng ([grauslon.substr(0,7),grauslat.substr(0,6)])
      .setContent (`
      <button class="trans" id="nom">${item.info["0"].informació["0"].nom} </button> 
      <div class= "dreta">
      <ul id= "info"> 
      <li id="municipi"><b>${item.info["0"].informació["0"].municipi}</b></li> 
      <li id="coords">Coordenades: ${grauslon.substr(0,5)}ºN , ${grauslat.substr(0,5)}ºE</li> 
      ${alçada} 
      <li style="margin-top:15px;">Analítiques del Consell Comarcal d'Osona:</li>
      </ul>
        <canvas id="myChart" width="100%" height="95%"></canvas>
      </div>
      <div class= "recullhist"> 
      <p>${recullhistòric}</p>
      <p id="citació">${citació} </p>
      </div>
      </br>
      </br>
      <div style="height:${window.screen.height/2.2}px"></div>
      `) 

      
      const popup1 = L.popup({closeButton:false})
      .setLatLng ([grauslon.substr(0,7),grauslat.substr(0,6)])
      .setContent (`<button class="trans" id="nom1">${item.info["0"].informació["0"].nom} </button>`)
      
      const anàlisis =[]
      const anys = []
      const límit = []
      const analítiques = item.info["0"].aigua.split('-')
      analítiques.forEach((anàlisi) => {
        const dades = anàlisi.split('	')

        if (dades['7']==="") {
          const any = dades['12']
          const nitrats = dades['14']
          if (nitrats != 0) {
            anàlisis.push(nitrats)
            anys.push (any.substr(3,9))
            límit.push(50)
          }
        }
        else{ 
          if (dades['3']!== "" && dades['3']!== undefined) {
            const any = dades['1']
            const nitrats = dades['3']
            const ph = dades['4']
            if (nitrats !== "0") {
              anàlisis.push(nitrats)
              anys.push(any.substr(3,9))
              límit.push(50)
            }
            else {
              if (nitrats == 0 && ph !== 0) {
                anàlisis.push(nitrats)
                anys.push(any.substr(3,9))
                límit.push(50)
              }
            } 
          }
        } 
      })

      const marker = new L.marker(new L.latLng([grauslon.substr(0,7),grauslat.substr(0,6)]), {title: item.info["0"].informació["0"].nom, icon: myIcon})
      .on("mouseover", function(e) {e.target.bindPopup(popup1).openPopup(); e.target.bindPopup(popup)})
      .on('mouseout', function(e){e.target.bindPopup(popup1).closePopup()})
      .on('click', function(){

        setTimeout(()=>{
        var ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
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

      markersLayer.addLayer(marker)
    }

    function crearpunts (item) {
      const prelat = item.info["0"].informació["0"].coordenades.lat.split(' ')
      const prelon = item.info["0"].informació["0"].coordenades.lon.split(' ')
      
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
        if (prelat["0"] !== "-") {
          if (prelat["0"].charAt(1)=== 'º' || prelat["0"].charAt(1)=== '°'){
          const grauslat = `${prelat["0"].substr(0,prelat["0"].length-1).valueOf()+ fpunlat() + ((prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60)+(prelat["2"].substr(0,prelat["2"].length-2).valueOf()/3600))*1000000}`
            if (prelon["0"].charAt(1)!== '4'){ 
            const grauslon = `${prelon["0"].substr(0,prelon["0"].length-1).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`
            info({item}, grauslat, grauslon)
            }
            if (prelon["0"].charAt(1)=== '4'){ 
            const grauslon = `${prelon["0"].substr(1,prelon["0"].length-2).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`  
            info({item}, grauslat, grauslon)
            }
          }
          
          if (prelat["0"].charAt(1) === '2' ){
          const grauslat = `${prelat["0"].substr(1,prelat["0"].length-2).valueOf()+ fpunlat() + ((prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60)+(prelat["2"].substr(0,prelat["2"].length-2).valueOf()/3600))*1000000}`
            if (prelon["0"].charAt(1) === '2'){
            const grauslon = `${prelon["0"].substr(0,prelon["0"].length-1).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`  
            info({item}, grauslat, grauslon) 
            
              }
            if (prelon["0"].charAt(1)=== '4'){
            const grauslon = `${prelon["0"].substr(1,prelon["0"].length-2).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`  
            info({item}, grauslat, grauslon) 
            }
          }
        }
    }
    setTimeout(()=>{
      const {items} = this.props.item;
      items.forEach((item) => {
        crearpunts(item)
      }) 
    }, 1500); 
  }

  render() {
    return (
      <div id="mapa" style={{ position: 'absolute', top: '7%', height: '93%', width: '100%', zIndex:0}} ></div>)
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
