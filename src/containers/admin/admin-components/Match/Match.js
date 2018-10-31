import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['match_id', 'match_date', 'home_team_id', 'away_team_id', 'season_id', 'locaton_id'],
      itemFieldsName: ['Match ID', 'Match Date', 'Home Team ID', 'Away Team ID', 'Season ID', 'Location ID']
    }
    this.getData();
    this.onEdit = this.onEdit.bind(this);
  }

  getData() {
    axios.get('https://case-match.herokuapp.com/showMatches')
      .then(response => this.setState({ data: response.data }));
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'table'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'table':
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Matches' addButton='Add Match' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateMatch' editName='Match'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createMatch' />
      default:
        break;
    }
  }

  render() {
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default Address;