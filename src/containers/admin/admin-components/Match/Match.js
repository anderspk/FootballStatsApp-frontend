import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditMatch';
import AddPage from './AddMatch';

class Match extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['match_id', 'match_date', 'home_team_id', 'away_team_id', 'season_id', 'location_id'],
      itemFieldsName: ['Match ID', 'Match Date', 'Home Team', 'Away Team', 'Season', 'Location Name'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }


  componentDidMount() {

    const matches = axios.get("https://case-match.herokuapp.com/showMatches");
    const teams = axios.get("https://case-team.herokuapp.com/showAllTeamData");
    const seasons = axios.get("http://case-season.herokuapp.com/showSeasons");
    const locations = axios.get("http://case-address.herokuapp.com/showAddresses");

    Promise.all([matches, teams, seasons, locations]).then(values => {
      const renderTable = [];
      values[0].data.forEach((match, i) => {
        const home_team = values[1].data.find(team => team.team_id === match.home_team_id);
        const away_team = values[1].data.find(team => team.team_id === match.away_team_id);
        const season = values[2].data.find(season => season.season_id === match.season_id);
        const location = values[3].data.find(location => location.location_id === match.location_id);
        
        console.log(matches, " = matches check");
        console.log(teams, " = teams check");
        console.log(seasons, " = seasons check");
        console.log(locations, " = locations check");

        renderTable[i] = {
          match_id: match.match_id,
          match_date: match.match_date,
          home_team_id: home_team.association_name,
          away_team_id: away_team.association_name,
          season_id: season.name,
          location_id: location.location_name
        }
      });
      this.setState({ renderTable: renderTable, values:values});
    });
  }


  onEdit(editItem) {
    editItem.home_team_id = this.state.values[1].data.find(row => row.association_name === editItem.home_team_id).team_id;
    editItem.away_team_id = this.state.values[1].data.find(row => row.association_name === editItem.away_team_id).team_id;
    editItem.season_id = this.state.values[2].data.find(row => row.name === editItem.season_id).season_id;
    editItem.location_id = this.state.values[3].data.find(row => row.location_name === editItem.location_id).location_id;

    console.log(editItem, " = item to edit")
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'table'})
  }

  getView() {
    console.log(this.state.renderTable, 'renderTable getview');
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
    if (!this.state.renderTable) return 'Loading...';
    console.log('hit');
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default Match;