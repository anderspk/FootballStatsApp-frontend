import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from './EditPage';
import AddPage from './AddPlayer';

class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['player_id', 'first_name', 'last_name', 'date_of_birth', 'address_id', 'normal_position', 'number', 'team_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address ID', 'Normal Position', 'Number', 'Team'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id', 'normal_position', 'number', 'team_id'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {

    const players = axios.get("https://case-person.herokuapp.com/showPlayers");
    const teams = axios.get("https://case-team.herokuapp.com/showAllTeamData");

    Promise.all([players, teams]).then(values => {
      const renderTable = [];
      values[0].data.forEach((player) => {
        const team = values[1].data.find(team => team.team_id === player.team_id);
        renderTable.push({
          player_id: player.player_id,
          first_name: player.first_name,
          last_name: player.last_name,
          date_of_birth: player.date_of_birth,
          address_id: player.address_id,
          normal_position: player.normal_position,
          number: player.number,
          team_id: team.association_name
        });
      });
      this.setState({ renderTable: renderTable });
    });
  }

  onEdit(editItem) {
    editItem.address_id = this.state.table.data.find(row => row.player_id === editItem.player_id).address_id;
    editItem.team_id = this.state.table.data.find(row => row.player_id === editItem.player_id).team_id;
    editItem.person_id = this.state.table.data.find(row => row.player_id === editItem.player_id).person_id;
    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'personTable'})
    this.doThing(this.state);
  }

  getView() {
    switch (this.state.activePage) {
      case 'personTable':
        return <PeopleTable objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Player' addButton='Add Player' />
      case 'editPage':
        return <AddPage itemToEdit={this.state.itemToEdit} formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL="https://case-users.herokuapp.com/updatePlayer" toEdit={true} addName="Player" deleteURL={`https://case-users.herokuapp.com/deletePlayer/${this.state.itemToEdit.player_id}`} />;
        // return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updatePlayer' deleteURL={`https://case-users.herokuapp.com/deletePlayer/${this.state.itemToEdit.player_id}`} editName='Player'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createPlayer' addName='Player'/>
      default:
        break;
    }
  }

  render() {
    if (!this.state.renderTable) return 'Loading...';
    return ( 
      <div>
        {this.getView()}
      </div>
    )
  }
}

export default Player;