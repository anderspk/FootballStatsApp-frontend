import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditTeam';
import AddPage from './AddTeam';

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['team_id', 'association_id', 'coach_id', 'owner_id', 'location_id', 'association_name', 'association_description'],
      itemFieldsName: ['Team ID', 'Association ID', 'Coach ID', 'Owner ID', 'Location ID', 'Association Name', 'Association Description']
    }
    this.getData();
    this.onEdit = this.onEdit.bind(this);
  }

  getData() {
    axios.get('https://case-team.herokuapp.com/showAllTeamData')
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
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Teams' addButton='Add Team' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} associationApiURL='https://case-users.herokuapp.com/updateAssociation' teamApiURL='https://case-users.herokuapp.com/updateTeam' editName='Team'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} associationApiURL='https://case-users.herokuapp.com/createAssociation' teamApiURL='https://case-users.herokuapp.com/createTeam' addName='Team'/>
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

export default Team;