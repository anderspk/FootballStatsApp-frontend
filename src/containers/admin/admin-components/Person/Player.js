import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from './EditPlayer';
import AddPage from './AddPlayer';

class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['player_id', 'first_name', 'last_name', 'date_of_birth', 'address_id', 'normal_position', 'number', 'team_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address Name', 'Normal Position', 'Number', 'Team'],
      itemFieldsForAdd: ['first_name', 'last_name', 'date_of_birth', 'address_id', 'normal_position', 'number', 'team_id'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {

    const players = axios.get("https://case-person.herokuapp.com/showPlayers");
    const addresses = axios.get("http://case-address.herokuapp.com/showAddresses");
    const teams = axios.get("https://case-team.herokuapp.com/showAllTeamData");

    Promise.all([players, addresses, teams]).then(values => {
      const renderTable = [];
      values[0].data.forEach((player) => {
        const address = values[1].data.find(address => address.address_id === player.address_id);
        const team = values[2].data.find(team => team.team_id === player.team_id);
        renderTable.push({
          player_id: player.player_id,
          first_name: player.first_name,
          last_name: player.last_name,
          date_of_birth: player.date_of_birth,
          address_id: address.address_line_1,
          normal_position: player.normal_position,
          number: player.number,
          team_id: team.association_name
        });
      });
      this.setState({ renderTable: renderTable, values:values });
    });
  }


  onEdit(editItem) {
    editItem.person_id = this.state.values[0].data.find(row => row.player_id === editItem.player_id).person_id;
    editItem.address_id = this.state.values[1].data.find(row => row.address_line_1 === editItem.address_id).address_id;
    editItem.team_id = this.state.values[2].data.find(row => row.association_name === editItem.team_id).team_id;

    this.setState({ activePage: 'editPage', itemToEdit: editItem});
  }

  addPage = () => {
    this.setState({ activePage: 'addPage'});
  }

  onRouteChange = () => {
    this.setState({activePage: 'personTable'})
  }

  getView() {
    switch (this.state.activePage) {
      case 'personTable':
        return <PeopleTable objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Player' addButton='Add Player' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} formFields={this.state.itemFieldsForAdd} onRouteChange={this.onRouteChange} apiURL="https://case-users.herokuapp.com/updatePlayer" toEdit={true} addName="Player" deleteURL={`https://case-users.herokuapp.com/deletePlayer/${this.state.itemToEdit.player_id}`} />;
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