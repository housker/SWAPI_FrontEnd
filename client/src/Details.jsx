import React from 'react';
import { Container, Image, Sidebar, Menu } from 'semantic-ui-react';
import credit from './credit.jpg';
import sbicon from './sbicon.svg';

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      colors: [
        '#8FC0DA',
        '#ab87b7',
        '#aa3206',
        '#a86303',
        '#dbd141',
        '#187a28'
      ],
      maxSpeed: {
        vehicles: 20000,
        starships: 8000,
      },
      maxPassengers: {
        vehicles: 500,
        starships: 843342,
      },
      maxCrew: {
        vehicles: 140,
        starships: 342953,
      },
      maxConsumables: {
        vehicles: 60,
        starships: 2190,
      },
      maxCargo: {
        vehicles: 2000000,
        starships: 1000000000000,
      },
      bars: [],
      sidebarVisible: false,
    }
    this.drawGuage = this.drawGuage.bind(this);
    this.drawBars = this.drawBars.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  componentDidMount() {
    this.drawGuage();
    this.drawBars();
  }

  drawGuage() {
    var opts = {
      angle: 0.15,
      lineWidth: 0.44,
      radiusScale: 1,
      pointer: {
        length: 0.6,
        strokeWidth: 0.035,
        color: '#000000'
      },
      limitMax: false,
      limitMin: false,
      colorStop: '#aa3206',
      generateGradient: true,
      highDpiSupport: true,

    };
    var target = document.getElementById('guage');
    var gauge = new Gauge(target).setOptions(opts);
    gauge.maxValue = this.state.maxSpeed[this.props.active];
    gauge.setMinValue(0);
    gauge.animationSpeed = 32;
    gauge.set(this.props.selection.max_atmosphering_speed);
  }

  drawBars() {
    let bars = document.getElementsByClassName('bar');
    for(let i = 0; i < bars.length; i++) {
      setTimeout(() => {
      bars[i].style.width = `${Math.round(bars[i].getAttribute('percent') * 100)}%`;
      }, i*100);
    }
  }

  toggleSidebar() {
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
  }

  render() {
    return (
      <div id="right-container">
        <Sidebar.Pushable style={{'overflow': 'hidden'}}>
          <Sidebar id="sidebar"
            as={Menu}
            size='huge'
            fluid widths={2}
            animation='overlay'
            icon='labeled'
            inverted
            direction='bottom'
            visible={this.state.sidebarVisible}
            width='very wide'
          >
            <Menu.Item>
              <span id="cost" style={{'color': 'black', 'background-color': 'white', 'margin': '5px', 'padding': '4px 4px 3px 4px', 'border-radius': '8px'}}>
                <Image id="credit" height="15px" src={credit} />
                <span id="price">{this.props.selection.cost_in_credits}</span>
              </span>
              <h3 style={{'margin': '5px', 'font': 'bold 22px'}}>{this.props.selection.name}</h3>
              <div>A {this.props.selection.model} manufactured by {this.props.selection.manufacturer}</div>
              <Container id="guage-container">
                <canvas id="guage" />
                <span id="guage-caption">Maximum speed {this.props.selection.max_atmosphering_speed}</span>
              </Container>
            </Menu.Item>
            <Menu.Item position='right'>
              <h4 id="captitle">Capacity</h4>
              <div className="holder">passengers: <strong>{this.props.selection.passengers}</strong>
                <div id="passengers" className="bar" style={{'width': `${Math.round(this.props.selection.passengers / this.state.maxPassengers[this.props.active]) * 100}%`}} percent={this.props.selection.passengers / this.state.maxPassengers[this.props.active]} style={{background: this.state.colors[0]}}></div>
              </div>
              <div className="holder">crew: <strong>{this.props.selection.crew}</strong>
                <div id="crew" className="bar" percent={this.props.selection.crew / this.state.maxCrew[this.props.active]}></div>
              </div>
              <div className="holder">consumables: <strong>{this.props.selection.consumables}</strong>
                <div id="consumables" className="bar" percent={this.props.selection.consumables.match(/\d*/) / this.state.maxConsumables[this.props.active]}></div>
              </div>
              <div className="holder">cargo: <strong>{this.props.selection.cargo_capacity}</strong>
                <div id="cargo" className="bar" percent={this.props.selection.cargo_capacity / this.state.maxCargo[this.props.active]}></div>
              </div>
            </Menu.Item>
          </Sidebar>
        <Sidebar.Pusher>
          <img id="closeup" src={this.props.selection.src} style={{'max-width': '90%', 'padding': '0', 'max-height': '95%', 'flex-basis': 'calc(100% - 255px)', 'flex-shrink': '0', 'margin-left': '5px', 'margin': '0 auto', 'position': 'absolute', 'top': '50%', 'left': '50%', 'margin-right': '-50%', 'transform': 'translate(-50%, -50%)', 'border': 'solid pink'}} />
          <span id="sbicon"><img src={sbicon} height="30px" onClick={this.toggleSidebar} style={{'position': 'absolute', 'right': '0', 'margin': '8px', 'cursor': 'pointer'}}/></span>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      </div>
    );
  }
}
