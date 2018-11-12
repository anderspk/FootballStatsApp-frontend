import React, { Component } from 'react';
import axios from 'axios';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data:[]
    }
    this.getData();
  }

  getData() {
    axios.get('https://case-users.herokuapp.com/getAllDashboardData')
      .then(response => this.setState({ data: response.data }));
  }

  render() {
    return (
      <section className='admin-dashboard-container'>

        <article className='admin-dashboard-stat users-stat'>
          <p>{this.state.data[5]}</p>
          <div>
            <img src='/images/users.png' />
            <h2>Users</h2>
          </div>
        </article>
        <article className='admin-dashboard-stat matches-stat'>
          <p>{this.state.data[2]}</p>
          <div>
            <img src='/images/soccer.png' />
            <h2>Matches</h2>
          </div>
        </article>
        <article className='admin-dashboard-stat players-stat'>
          <p>{this.state.data[0]}</p>
        <div>
            <img src='/images/player.png' />
            <h2>Players</h2>
          </div>
        </article>

        <article className='admin-dashboard-stat teams-stat'>
          <p>{this.state.data[1]}</p>
        <div>
            <img src='/images/team.png' />
            <h2>Teams</h2>
          </div>
        </article>
        <article className='admin-dashboard-stat seasons-stat'>
          <p>{this.state.data[3]}</p>
        <div>
            <img src='/images/season.png' />
            <h2>Seasons</h2>
          </div>
        </article>
        <article className='admin-dashboard-stat goals-stat'>
          <p>{this.state.data[4]}</p>
        <div>
            <img src='/images/goal.png' />
            <h2>Goals</h2>
          </div>
        </article>


        <div className='admin-dashboard-graph'>

          </div>
      </section>
    )
  }
}

export default Dashboard;