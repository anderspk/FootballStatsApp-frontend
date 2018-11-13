import React, { Component } from 'react';
import Address from './admin-components/Addresses/Address';
import Person from './admin-components/Person/Person';
import Player from './admin-components/Person/Player';
import Owner from './admin-components/Person/Owner';
import Coach from './admin-components/Person/Coach';
import Match from './admin-components/Match/Match';
import UpcomingMatches from './admin-components/Match/UpcomingMatches';
import CompletedMatches from './admin-components/Match/CompletedMatches';
import Season from './admin-components/Season/Season';
import Team from './admin-components/Team/Team';
import Result from './admin-components/Result/Result';
import Goals from './admin-components/Goals/Goals';
import User from './admin-components/Users/User';  
import GoalType from './admin-components/GoalType/GoalType';
import Contacts from './admin-components/Contacts/Contacts';
import Dashboard from './admin-components/Dashboard';
import i18n from '../../i18n';
import { withNamespaces } from 'react-i18next';
import t from "i18next";

import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Admin extends Component {
  constructor(props) {
    console.log(props, 'props')
    super(props);
    this.state = {
      currentPage: 'dashBoard',
      showPeople: false
    }
  }

  renderPage() {
    switch (this.state.currentPage) {
      case 'dashBoard':
        return <Dashboard />
      case 'address':
        return <Address />;
      case 'person':
        return <Person />;
      case 'player':
        return <Player />;
      case 'coach':
        return <Coach />;
      case 'owner':
        return <Owner />;
      case 'contacts':
        return <Contacts />;
      case 'match':
        return <Match />;
      case 'upcomingMatches':
        return <UpcomingMatches />;
      case 'completedMatches':
        return <CompletedMatches />;
      case 'season':
        return <Season />;
      case 'team':
        return <Team />;
      case 'result':
        return <Result />;
      case 'goals':
        return <Goals />;  
      case 'goalType':
        return <GoalType />;  
      case 'user':
        return <User />;  
      default:
        break;
    }
  }

  changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  render() {

    const { t } = this.props;
    const { showPeople } = this.state;
    const { showMatches } = this.state;
    return (
      <section className='admin-page'>
        <ul className='admin-menu'>
          <li><span onClick={() => this.changeLanguage('en')}>EN</span>/<span onClick={() => this.changeLanguage('no')}>NO</span></li>
          <li><button onClick={e => this.setState({currentPage: 'dashBoard'})}>{t('Dashboard')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'address'})}>{t('Address')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'person'})}>{t('Person')}</button></li>
          <li><button onClick={e => this.setState({ showPeople: !showPeople })}>{t('People')}</button></li>
          {showPeople && <li className='player-menu'><button onClick={e => this.setState({currentPage: 'player'})}>Players</button></li>}
          {showPeople && <li className='player-menu'><button onClick={e => this.setState({currentPage: 'coach'})}>Coaches</button></li>}
          {showPeople && <li className='player-menu'><button onClick={e => this.setState({currentPage: 'owner'})}>Owners</button></li>}
          <li><button onClick={e => this.setState({currentPage: 'contacts'})}>{t('Contacts')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'match'})}>{t('Matches')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'season'})}>{t('Seasons')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'team'})}>{t('Teams')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'result'})}>{t('Result')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'goals'})}>{t('Goals')}</button></li>
          <li><button onClick={e => this.setState({currentPage: 'goalType'})}>{t('Goal Type')}</button></li>
          <li><button onClick={e => this.props.logout()}>Log out</button></li>

        </ul>
        <div className='admin-main-container'>
          {this.renderPage()}
        </div>
      </section>
    )
  }
}

export default withNamespaces()(Admin);

// <h5>You are logged in!{' '}<a style={{ cursor: 'pointer' }} onClick={this.logout}>Log Out</a>.</h5>