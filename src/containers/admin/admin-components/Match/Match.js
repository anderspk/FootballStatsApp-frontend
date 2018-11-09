import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from './AddMatch';

import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Match extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['match_id', 'match_date', 'home_team_id', 'away_team_id', 'season_id', 'location_id'],
      itemFieldsName: ['Match ID', 'Match Date', 'Home Team', 'Away Team', 'Season', 'Location'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillMount() {
    this.props.fetchTableData('https://case-match.herokuapp.com/showMatches');
    axios.get('https://case-team.herokuapp.com/showAllTeamData/').then(response => this.setState({ teams: response.data }));
    axios.get('http://case-season.herokuapp.com/showSeasons').then(response => this.setState({ seasons: response.data }));
    axios.get('http://case-address.herokuapp.com/showAddresses/').then(response => this.setState({ addresses: response.data }));

  }

/*
  componentWillReceiveProps(newProps) {
    this.doThing(newProps);
  }

  doThing(input) {

    input.table.data.forEach((row,i) => {

      let address = this.state.addresses.find(address => {
        return address.location_id === row.location_id;
      })

      let season = this.state.seasons.find(season => {
        return row.season_id === row.season_id;
      })

      let home_team = this.state.teams.find(team => {
        return team.team_id === row.home_team_id;
      })

      let away_team = this.state.teams.find(team => {
        return team.team_id === row.away_team_id;
      })

      let newRenderTable = this.state.renderTable;
              newRenderTable[i] = {
                match_id: row.match_id,
                match_date: row.match_date,
                home_team_id: home_team.association_name,
                away_team_id: away_team.association_name,
                season_id: season.name,
                location_id:address.location_name
              }
      this.setState({ rendertable: newRenderTable})
    })
}
 /*
    const apiURLs = 
    ['https://case-team.herokuapp.com/showAllTeamData/',
     'https://case-team.herokuapp.com/showAllTeamData/',
     'http://case-season.herokuapp.com/showOneSeason/',
     'http://case-address.herokuapp.com/showOneAddress/'];
    
    const apiURLfieldNames =
    ['association_name',
     'association_name',
     'name',
     'location_name'];
/*
    const columns = [2,3,4,5];
    let counter=0;
    input.table.data.forEach((row,i) => {
      let index = 0
      axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(first => {
        first = first.data[apiURLfieldNames[index]];
        index++;
        axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(second => {
          second = second.data[apiURLfieldNames[index]];
          index++;
          axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(third => {
            third = third.data[apiURLfieldNames[index]];
            index++;
            axios.get(apiURLs[index] + row[this.state.itemFields[columns[index]]]).then(fourth => {
              fourth = fourth.data[apiURLfieldNames[index]];
              let newRenderTable = this.state.renderTable;
              newRenderTable[i] = {
                match_id: row.match_id,
                match_date: row.match_date,
                home_team_id: first,
                away_team_id: second,
                season_id: third,
                location_id:fourth
              }
              counter++
              this.setState({ renderTable: newRenderTable })
              if (counter > input.table.data.length/4) this.setState({ renderComplete: true })

            })
          })
        });
      })
    })

*/
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Matches' addButton='Add Match' helperAPI={this.state.helperAPI} helperAPIfield={this.state.helperAPIfield} />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateMatch' deleteURL={`https://case-users.herokuapp.com/deleteMatch/${this.state.itemToEdit.match_id}`} editName='Match'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createMatch' addName='Match'/>
      default:
        break;
    }
  }

  render() {
    // console.log(this.props.table, 'rendertable');
    if (!this.state.teams && !this.state.addresses && !this.state.seaons) return 'Loading...';
    return ( 
      <div>
        {this.getView()}
        <NotificationContainer/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state, 'thestate');
  return {
    table: state.table
  }
}

export default connect(mapStateToProps, {fetchTableData, setRowAPIhelpers})(Match);