import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

class Goal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['goal_type_id','type'],
      itemFieldsName: ['Goal Type ID', 'Goal Type']
    }
    this.getData();
    this.onEdit = this.onEdit.bind(this);
  }

  getData() {
    axios.get('https://case-goal.herokuapp.com/showGoalTypes')
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
        return <Table objectList={this.state.data} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Goals' addButton='Add Goal Type' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateGoalType' deleteURL={`https://case-users.herokuapp.com/deleteGoalType/${this.state.itemToEdit.goal_type_id}`} editName='Goal Type'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createGoalType' addName='Goal Type' />
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

export default Goal;