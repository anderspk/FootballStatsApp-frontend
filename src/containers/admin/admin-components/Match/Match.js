import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';
import { connect } from 'react-redux';
import { fetchTableData } from '../../../../actions/actions';

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['match_id', 'match_date', 'home_team_id', 'away_team_id', 'season_id', 'location_id'],
      itemFieldsName: ['Match ID', 'Match Date', 'Home Team ID', 'Away Team ID', 'Season ID', 'Location ID'],
      helperAPI: [
        'https://case-team.herokuapp.com/showOneTeam/',
        'https://case-team.herokuapp.com/showOneTeam/',
        'http://case-season.herokuapp.com/showOneSeason/',
        'http://case-address.herokuapp.com/showOneAddress/'
      ],
      helperAPIfield: [
        'association_name',
        'association_name',
        'name',
        'location_name'
      ]
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
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Matches' addButton='Add Match' helperAPI={this.state.helperAPI} helperAPIfield={this.state.helperAPIfield} />
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