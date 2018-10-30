import React, { Component } from 'react';

class Dashboard extends Component {

  render() {
    return (
      <section className='admin-dashboard-container'>
        <article className='admin-dashboard-stat users-stat'>
          <p>314</p>
          <div>
            <img src='/images/users.png' />
            <h2>Users</h2>
          </div>
        </article>
        <article className='admin-dashboard-stat matches-stat'>
          <p>113</p>
          <div>
            <img src='/images/soccer.png' />
            <h2>Matches</h2>
          </div>
        </article>
        <article className='admin-dashboard-stat'>Hi</article>
        <article className='admin-dashboard-stat'>Hi</article>
        <div className='admin-dashboard-graph'>
          Graph
          </div>
      </section>
    )
  }
}

export default Dashboard;