import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditTeam';
import AddPage from './AddTeam';

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['team_id', 'association_id', 'coach_id', 'owner_id', 'location_id', 'association_name', 'association_description'],
      itemFieldsName: ['Team ID', 'Association ID', 'Coach Name', 'Owner Name', 'Location Name', 'Association Name', 'Association Description'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    
    const teams = axios.get("https://case-team.herokuapp.com/showAllTeamData");
    const coaches = axios.get("https://case-person.herokuapp.com/showCoaches");
    const owners = axios.get("https://case-person.herokuapp.com/showOwners");
    const addresses = axios.get("https://case-address.herokuapp.com/showAddresses");

    Promise.all([teams, coaches, owners, addresses]).then(values => {
      const renderTable = [];
      values[0].data.forEach((team, i) => {
        const coach = values[1].data.find(coach => coach.coach_id === team.coach_id);
        const owner = values[2].data.find(owner => owner.owner_id === team.owner_id);
        const location = values[3].data.find(location => location.location_id === team.location_id);
        renderTable[i] = {
          team_id: team.team_id,
          association_id: team.association_id,
          coach_id: coach.first_name + " " + coach.last_name,
          owner_id: owner.first_name + " " + owner.last_name,
          location_id: location.location_name,
          association_name: team.association_name,
          association_description: team.association_description
        }
      });
      this.setState({ renderTable: renderTable, values:values});
    });
  }

  onEdit(editItem) {
    this.setState({ activePage: 'editPage', itemToEdit: editItem});

    editItem.coach_id = this.state.values[1].data.find(row => editItem.coach_id.includes(row.last_name)).coach_id;
    editItem.owner_id = this.state.values[2].data.find(row => editItem.owner_id.includes(row.last_name)).owner_id;
    editItem.location_id = this.state.values[3].data.find(row => row.location_name === editItem.location_id).location_id;
    editItem.team_image = this.state.values[0].data.find(row => row.team_id === editItem.team_id).team_image;
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Teams' addButton='Add Team' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} 
                         associationApiURL='https://case-users.herokuapp.com/updateAssociation' 
                         teamApiURL='https://case-users.herokuapp.com/updateTeam' 
                         teamDeleteURL={`https://case-users.herokuapp.com/deleteTeam/${this.state.itemToEdit.team_id}`} 
                         associationDeleteURL={`https://case-users.herokuapp.com/deleteAssociation/${this.state.itemToEdit.association_id}`} 
                         editName={this.state.itemFields.association_name}/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} 
                        associationApiURL='https://case-users.herokuapp.com/createAssociation' 
                        teamApiURL='https://case-users.herokuapp.com/createTeam' addName='Team'/>
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

export default Team;