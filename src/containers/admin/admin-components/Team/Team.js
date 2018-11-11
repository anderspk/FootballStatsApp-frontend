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
      itemFieldsName: ['Team ID', 'Association ID', 'Last Name of Coach', 'Last Name of Owner', 'Location Name', 'Association Name', 'Association Description'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    
    const teams = axios.get("https://case-team.herokuapp.com/showAllTeamData");
    const coaches = axios.get("https://case-person.herokuapp.com/showCoaches");
    const owners = axios.get("https://case-person.herokuapp.com/showOwners");
    const addresses = axios.get("http://case-address.herokuapp.com/showAddresses");

    Promise.all([teams, coaches, owners, addresses]).then(values => {
      const renderTable = [];
      values[0].data.forEach((team, i) => {
        const coach = values[1].data.find(coach => coach.coach_id === team.coach_id);
        const owner = values[2].data.find(owner => owner.owner_id === team.owner_id);
        const location = values[3].data.find(location => location.location_id === team.location_id);
        renderTable[i] = {
          team_id: team.team_id,
          association_id: team.association_id,
          coach_id: coach.last_name,
          owner_id: owner.last_name,
          location_id: location.location_name,
          association_name: team.association_name,
          association_description: team.association_description
        }
      });
      this.setState({ renderTable: renderTable });
    });
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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Teams' addButton='Add Team' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} 
                         associationApiURL='https://case-users.herokuapp.com/updateAssociation' 
                         teamApiURL='https://case-users.herokuapp.com/updateTeam' 
                         teamDeleteURL={`https://case-users.herokuapp.com/deleteTeam/${this.state.itemToEdit.team_id}`} 
                         associationDeleteURL={`https://case-users.herokuapp.com/deleteAssociation/${this.state.itemToEdit.association_id}`} 
                         editName='Team'/>
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


const mapStateToProps = state => {
  return {
    table: state.table
  }
}

export default Team;