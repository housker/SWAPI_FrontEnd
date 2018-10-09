import React from 'react';
import { Container, Grid, Search, Button, Dropdown, Label } from 'semantic-ui-react';
import Shuffle from 'shufflejs';
import _ from 'lodash';

export default class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sortOptions: [
        { text: 'name', value: 'name' },
        { text: 'capacity', value: 'capacity' },
        { text: 'price', value: 'price' },
        { text: 'speed', value: 'speed' }
      ],
    }
  }

  componentWillMount() {
    this.props.resetComponent();
  }

  componentDidMount() {
    this.shuffle = new Shuffle(this.element, {
      itemSelector: '.photo-item',
      sizer: this.sizer,
    });
    this.props.loadData();
  }

  componentDidUpdate() {
    if(this.props.sortSelected) {
      if(this.props.sortSelected === 'name') {
        this.shuffle.sort({by: (el) => el.getAttribute(`data-${this.props.sortSelected}`)})
      } else {
        this.shuffle.sort({compare: (a, b) =>
          {
            var numA = isNaN(parseInt(a.element.getAttribute(`data-${this.props.sortSelected}`), 10)) ? -1 : parseInt(a.element.getAttribute(`data-${this.props.sortSelected}`), 10);
            var numB = isNaN(parseInt(b.element.getAttribute(`data-${this.props.sortSelected}`), 10)) ? -1 : parseInt(b.element.getAttribute(`data-${this.props.sortSelected}`), 10);
            return numB - numA;
          }
        });
      }
    } else {
      this.shuffle.resetItems();
      this.shuffle.filter((element) => {
        return element.getAttribute('data-movies').split(',').reduce((a, b) => { return a || Object.entries(this.props.filmFilter).filter(entry => entry[1]).map(entry => entry[0]).indexOf(b) > -1 }, false);
      });
    }
  }

  componentWillUnmount() {
    this.shuffle.destroy();
    this.shuffle = null;
  }

  render() {
    const { isLoading, value, results } = this.props;
    return (
      <Container>
      <Container id="top-left">
        <Grid id="gallery-grid">
          <Grid.Row centered>
          </Grid.Row>
          <Grid.Row centered>
            <Search id="search"
              loading={isLoading}
              onResultSelect={this.props.handleResultSelect}
              onSearchChange={_.debounce(this.props.handleSearchChange, 500, { leading: true })}
              results={results}
              value={value}
              {...this.props}
            />
          </Grid.Row>
          <Grid.Row centered>
          <h5>Filter by episode</h5>
          {Object.entries(this.props.filmFilter).map((kval, index) => (<Grid.Column id="buttons"><Button id={`button-${kval[0]}`} className="episode-btn" basic circular toggle color="black" active={kval[1]} onClick={() => this.props.filterByFilm(kval[0])}>{kval[0]}</Button></Grid.Column>))}
          </Grid.Row>
            <Grid.Row centered>
              <Label id="sort-label" basic style={{'position': 'relative', 'transform': 'translateY(-10px)', 'z-index': '5'}}><span>Sort results by </span><Dropdown id="dropdown" inline options={this.state.sortOptions} value={this.props.sortSelected} onChange={this.props.selectSort} /></Label>
            </Grid.Row>
        </Grid>
        </Container>
        <Container id="bottom-left" style={{'overflow-y': 'scroll'}} onScroll={this.props.handleScroll}>
        <div ref={element => this.element = element} className="row my-shuffle">
          {this.props.allItems.map(item => (
            <div key={item.id} className="col-3@xs col-4@sm photo-item" data-name={item.name} data-capacity={item.cargo_capacity} data-price={item.cost_in_credits} data-speed={item.max_atmosphering_speed} data-movies={item.movies}>
              <div className="aspect aspect--4x3">
                <div className="aspect__inner">
                  <img className="thumbnail-image" style={{'width': '100%', 'cursor': 'pointer'}} src={item.src} onClick={() => this.props.selectItem(item)}/>
                  <Label attached='bottom' className="thumbnail-label" style={{'border-bottom': `1px solid ${item.color}`, 'width': '100%'}}>{item.name}</Label>
                </div>
              </div>
            </div>
          ))}
          <div ref={element => this.sizer = element} className="col-1@xs col-1@sm photo-grid__sizer"></div>
        </div>
        </Container>
      </Container>
    );
  }
}
