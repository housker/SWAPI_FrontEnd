import React from 'react';
import { Menu } from 'semantic-ui-react';

export default class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Menu id="nav-menu" pointing secondary fluid widths={2}>
        <Menu.Item disabled>
          <div>People</div>
        </Menu.Item>
        <Menu.Item disabled>
          <div>Films</div>
        </Menu.Item>
        <Menu.Item name='starships' active={this.props.active === 'starships'} onClick={this.props.navClick}>
          <div>Starships</div>
        </Menu.Item>
        <Menu.Item name='vehicles' active={this.props.active === 'vehicles'} onClick={this.props.navClick}>
          <div>Vehicles</div>
        </Menu.Item>
        <Menu.Item disabled>
          <div>Species</div>
        </Menu.Item>
        <Menu.Item disabled>
          <div>Planets</div>
        </Menu.Item>
      </Menu>
    );
  }
}