import React from 'react';
import {Modal, ModalHeader, ModalBody, ListGroupItem, ListGroup, Container} from 'reactstrap';
import {CSSTransition, TransitionGroup } from 'react-transition-group';
import {connect} from 'react-redux';
import {getItems} from '../actions/itemActions';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

class Llista extends React.Component {
    state = {
        modal: false,
        info: '',
        seleccionat: {},
        grauslat: "",
        grauslon: ""
    }

    toggle= () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    onSelectClick([informació1]) {
        const item = {info : [informació1]}
        this.setState({
            seleccionat: item,
            modal: !this.state.modal
        })
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
            this.setState({
              grauslat : grauslat,
              grauslon: grauslon
          })
            }
            if (prelon["0"].charAt(1)=== '4'){ 
            const grauslon = `${prelon["0"].substr(1,prelon["0"].length-2).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`  
            this.setState({
              grauslat : grauslat,
              grauslon: grauslon
          })
            }
          }
          
          if (prelat["0"].charAt(1) === '2' ){
          const grauslat = `${prelat["0"].substr(1,prelat["0"].length-2).valueOf()+ fpunlat() + ((prelat["1"].substr(0,prelat["1"].length-1).valueOf()/60)+(prelat["2"].substr(0,prelat["2"].length-2).valueOf()/3600))*1000000}`
            if (prelon["0"].charAt(1) === '2'){
            const grauslon = `${prelon["0"].substr(0,prelon["0"].length-1).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`  
             this.setState({
              grauslat : grauslat,
              grauslon: grauslon
          })
            
              }
            if (prelon["0"].charAt(1)=== '4'){
            const grauslon = `${prelon["0"].substr(1,prelon["0"].length-2).valueOf()+ fpunlon() + ((prelon["1"].substr(0,prelon["1"].length-1).valueOf()/60)+(prelon["2"].substr(0,prelon["2"].length-2).valueOf()/3600))*1000000}`  
            this.setState({
              grauslat : grauslat,
              grauslon: grauslon
          })
            }
          }
        }
        this.toggle()

        setTimeout(()=>{
            const anàlisis =[]
            const anys = []
            const límit = []
            const analítiques = this.state.seleccionat.info["0"].aigua.split('-')
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
          });})
    }
    
   

    componentDidMount() {
        this.props.getItems();
    }
    
    render(){
        const {items} = this.props.item;
        const municipis = ["Alpens", "Balenyà", "El Brull", "Calldetenes", "Centelles", "Collsuspina", "Espinelves", "L'Esquirol", "Folgueroles", "Gurb", "Lluçà", "Malla", "Manlleu", "Les Masies de Roda", "Les Masies de Voltregà", "Montesquiu", "Muntanyola", "Olost", "Orís", "Oristà", "Perafita", "Prats de Lluçanès", "Roda de Ter", "Rupit i Pruït", "Sant Agustí de Lluçanès", "Sant Bartomeu del Grau", "Sant Boi del Lluçanès", "Sant Hipòlit de Voltregà", "Sant Julià de Vilatorta", "Sant Martí d'Albars", "Sant Martí de Centelles", "Sant Pere de Torelló", "Sant Quirze de Besora", "Sant Sadurní d'Osomort", "Sant Viçens de Torelló", "Santa Cecília de Voltregà", "Santa Eugènia de Berga", "Santa Eulàlia de Riuprimer", "Santa Maria de Besora", "Seva", "Sobremunt", "Sora", "Taradell", "Tavèrnoles", "Tavertet", "Tona", "Torelló", "Vic", "Vidrà", "Viladrau", "Vilanova de Sau"];
        
        return(
            <div>
                <Container> 
                    <h5>Llista de Fonts</h5>
                    <hr style={{backgroundColor:'darkgrey'}}/>
                    <br/>
                {municipis.map(municipi => (
                        <ListGroup key={municipi}> <b style={{marginLeft:'3%'}}>{municipi}</b>
                            <TransitionGroup className="llista-fonts">
                                {items.filter(function(item){
                                    return item.info["0"].informació["0"].municipi.substr(0,municipi.length) === municipi}).map(({_id,info},) => (
                                <CSSTransition key={_id} timeout={500} classNames="fade">
                                    <ListGroupItem tag="button" onClick={this.onSelectClick.bind(this,info)}>
                                    {info["0"].informació["0"].nom} </ListGroupItem>
                                </CSSTransition>
                                ))}
                            </TransitionGroup>
                            <hr style={{backgroundColor:'lightgrey'}}/>
                            <br/>
                        </ListGroup> 
                        ))}
                </Container>
                
                {this.state.modal ? (
               
               <Modal
                isOpen={this.state.modal}
                toggle={this.modal}
                scrollable={true}
                returnFocusAfterClose={false}
                onDoubleClick={this.toggle}
                size = 'lg'
                >  
                    <ModalHeader toggle={this.toggle}>{this.state.seleccionat.info['0'].informació['0'].nom}</ModalHeader>
                    <ModalBody>
                        <Container>
                        <div class= "dreta" >
                        <ul id= "info" style={{fontSize:"1em", marginTop:"0px", marginBottom: '5%'}}> 
                        <li id="municipi"><b>{this.state.seleccionat.info["0"].informació["0"].municipi}</b></li> 
                        <li>Coordenades : </li>
                        <li id="coords">{this.state.grauslon.substr(0,5)}ºN , {this.state.grauslat.substr(0,5)}ºE</li>
                        {this.state.seleccionat.info["0"].informació["0"].alçada!="0" ? <li id="alt">Altura : {this.state.seleccionat.info["0"].informació["0"].alçada} m</li> : null}
                        <li style={{marginTop:'5px'}}>Analítiques Consell Comarcal:</li>
                        </ul>
                        <canvas id="myChart" width="100%" height="100%"></canvas>
                        </div>
                        {this.state.seleccionat.info["0"].informació["0"].recullhistòric!="-" ? <div class= "recullhist" style={{fontSize:"1em"}}> 
                        <p>{this.state.seleccionat.info["0"].informació["0"].recullhistòric} </p>
                        <p id="citació">{this.state.seleccionat.info["0"].informació["0"].citació} </p>
                        </div> : <p id="citació">No s'ha trobat informació</p>}
                        
                        
                        </Container>
                    </ModalBody>
                </Modal>
                ): null}
            </div>
        )
    }
}

Llista.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    item: state.item
});
export default connect(mapStateToProps, {getItems})(Llista);