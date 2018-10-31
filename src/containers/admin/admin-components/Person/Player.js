import React, { Component } from 'react';
import axios from 'axios';
import PeopleTable from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      people: [],
      activePage: 'personTable',
      itemToEdit: {},
      itemFields: ['person_id', 'first_name', 'last_name', 'date_of_birth', 'address_id', 'player_id', 'normal_position', 'number', 'team_id'],
      itemFieldsName: ['ID', 'First Name', 'Last Name', 'Date of Birth', 'Address ID', 'Player ID', 'Normal Position', 'Number', 'Team ID']
    }
    this.getAddresses();
    this.onEdit = this.onEdit.bind(this);
  }

  getAddresses() {
    axios.get('https://case-person.herokuapp.com/showPlayers')
      .then(response => this.setState({ people: response.data }));
  }

  onEdit(editItem) {
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
        return <PeopleTable objectList={this.state.people} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Player' addButton='Add Player' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updatePlayer' editName='Player'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createPlayer'/>
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

export default Player;