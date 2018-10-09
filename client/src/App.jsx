import React from 'react';
import { Container, Segment, Divider } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import Nav from './Nav.jsx';
import Gallery from './Gallery.jsx';
import Details from './Details.jsx';
import icon from './icon.svg';
import * as images from './images.js';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'vehicles',
      filmFilter: {
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true,
        '7': true,
      },
      loading: true,
      getNext: false,
      selection: null,
      sortSelected: '',
      nextPg: '',
      allItems: [],
      colorOptions: ['red', 'blue', 'green'],
      dict: {
        name: 'name',
        capacity: 'cargo_capacity',
        price: 'cost_in_credits',
        speed: 'max_atmosphering_speed'
      },
      isLoading: false,
      value: '',
      results: [],
    }
    this.navClick = this.navClick.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.selectSort = this.selectSort.bind(this);
    this.loadData = this.loadData.bind(this);
    this.processResults = this.processResults.bind(this);
    this.fetchNextPg = this.fetchNextPg.bind(this);
    this.resetComponent = this.resetComponent.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.filterByFilm = this.filterByFilm.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  navClick(e, { name }) {
    this.setState({sortSelected: '', active: name, getNext: false}, this.loadData);
  }

  selectItem(item) {
    this.setState({selection: item})
  }

  selectSort(e) {
    this.setState({sortSelected: e.target.innerText})
  }

  loadData() {
    let requestUrl = this.state.active === 'vehicles' ? 'https://swapi.co/api/vehicles/' : 'https://swapi.co/api/starships/';
    axios(requestUrl)
    .then(res => this.processResults(res.data.results, this.state.active, res.data.next))
    .then(items => this.setState({allItems: items, loading: false}));
  }

  processResults(photos, endpoint, nextPg) {
    this.setState({nextPg});
    return Promise.all(photos.map(item => new Promise((resolve) => {
      const image = document.createElement('img');
      let id = item.url.match(/(\d*)\/$/)[1];
      item.id = id;
      item.color = this.state.colorOptions[Math.floor(Math.random() * this.state.colorOptions.length)];
      let movies = [];
      item.films.forEach(film => movies.push(film.match(/(\d*)\/$/)[1]));
      item.movies = movies;
      item.src = images[endpoint][id] || 'https://i.pinimg.com/originals/d8/80/86/d880861b92ddd3e1e4f5823fa801f8e9.jpg';
      image.src = images[endpoint][id] || 'https://i.pinimg.com/originals/d8/80/86/d880861b92ddd3e1e4f5823fa801f8e9.jpg';
      if (image.naturalWidth > 0 || image.complete) {
        item.height = image.height;
        item.width = image.width;
        resolve(item);
      } else {
        image.onload = () => {
          item.height = image.height;
          item.width = image.width;
          resolve(item);
        };
      }
    })));
  }

  handleScroll() {
    let element = document.getElementById('bottom-left');
    this.setState({getNext: true}, () => {
      if (element.scrollHeight - element.scrollTop === element.clientHeight && this.state.getNext && this.state.nextPg) {
        this.setState({sortSelected: '', getNext: false}, this.fetchNextPg());
      }
    })
  }

  fetchNextPg() {
    axios(this.state.nextPg)
    .then(res => this.processResults(res.data.results, this.state.active, res.data.next))
    .then(items => this.setState({getNext: false, allItems: this.state.allItems.concat(items)}));
  }

  filterByFilm(filterKey) {
    // let selectedButton = document.getElementById(`button-${filterKey}`);
    // selectedButton.classList.contains('active') ? selectedButton.classList.remove('active') : selectedButton.classList.add('active');
    let updatedFilter = this.state.filmFilter;
    updatedFilter[filterKey] = !updatedFilter[filterKey];
    this.setState({filmFilter: updatedFilter})
  }

  //SEARCH METHODS --------------------------------------------------------------------------
  resetComponent() {
    this.setState({ isLoading: false, results: [], value: '' });
  }

  handleResultSelect(e, { result }) {
    this.setState({ value: result.title, selection: result });
  }

  handleSearchChange(e, { value }) {
    this.setState({ isLoading: true, value })
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => {
        return re.test(result.name) || re.test(result.model) || re.test(result.manufacturer)
      }
      this.setState({
        isLoading: false,
        results: _.filter(this.state.allItems, isMatch).map(item => {
          item.title = item.name;
          item.description = `${item.model} manufactured by ${item.manufacturer}`;
          return item;
        }),
      })
    }, 300)
  }
  //-----------------------------------------------------------------------------------------

  //To find maximums for Gallery.jsx, run the following after setState in fetchNextPg
  // findMaximums() {
  //   function standardize(input) {
  //     console.log(input)
  //     console.log(isNaN(parseInt(input)) ? -1 : parseInt(input));
  //     return isNaN(parseInt(input)) ? -1 : parseInt(input);
  //   }
  //   let maxSpeed = this.state.allItems.sort((a, b) => standardize(a.max_atmosphering_speed) - standardize(b.max_atmosphering_speed)).map(x => x.max_atmosphering_speed);
  //   let maxPassengers = this.state.allItems.sort((a, b) => standardize(a.passengers) - standardize(b.passengers)).map(x => x.passengers);
  //   let maxCrew = this.state.allItems.sort((a, b) => standardize(a.crew) - standardize(b.crew)).map(x => x.crew);
  //   let maxConsumables = this.state.allItems.sort((a, b) => standardize(a.consumables) - standardize(b.consumables)).map(x => x.consumables);
  //   let maxCargo = this.state.allItems.sort((a, b) => standardize(a.cargo_capacity) - standardize(b.cargo_capacity)).map(x => x.cargo_capacity);
  //   console.log('maxSpeed: ', maxSpeed);
  //   console.log('maxPassengers: ', maxPassengers);
  //   console.log('maxCrew: ', maxCrew);
  //   console.log('maxConsumables: ', maxConsumables);
  //   console.log('maxCargo: ', maxCargo);
  // }

  render() {
    return (
      <Container id="outer-container">
        <Segment id="outer-segment" loading={this.state.loading}>
          <Nav active={this.state.active} navClick={this.navClick}/>
          <div id="flex-container" celled="internally">
            <div id="left-column">
              <Gallery loadData={this.loadData} selectItem={this.selectItem} allItems={this.state.allItems} isLoading={this.state.isLoading} value={this.state.value} results={this.state.results} resetComponent={this.resetComponent} handleResultSelect={this.handleResultSelect} handleSearchChange={this.handleSearchChange} sortSelected={this.state.sortSelected} selectSort={this.selectSort} filmFilter={this.state.filmFilter} filterByFilm={this.filterByFilm} handleScroll={this.handleScroll}/>
            </div>
            <div id="right-column" className={this.state.selection ? 'filled' : ''} centered>
            {!this.state.selection && <Divider horizontal id="logo"><img src={icon} height="100px"></img></Divider>}
            {this.state.selection && <Details selection={this.state.selection} active={this.state.active}/>}
            </div>
          </div>
        </Segment>
      </Container>
    );
  }
}