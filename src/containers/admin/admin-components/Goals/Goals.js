import React, { Component } from 'react';
import axios from 'axios';
import Table from '../Table';
import EditPage from './EditGoal';
import AddPage from './AddGoal';
import { connect } from 'react-redux';
import { fetchTableData, setRowAPIhelpers } from '../../../../actions/actions';

class Goals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 'table',
      itemToEdit: {},
      itemFields: ['goal_id', 'player_id', 'goal_type_id', 'match_id', 'description'],
      itemFieldsName: ['Goal ID', 'Player', 'Goal type ID', 'Match ID', 'Description'],
      renderTable: [],
      renderComplete: false
    }
    this.onEdit = this.onEdit.bind(this);
  }

componentDidMount() {

    const goals = axios.get('https://case-goal.herokuapp.com/showGoals');
    const players = axios.get("https://case-person.herokuapp.com/showPlayers");
    const goalTypes = axios.get("https://case-goal.herokuapp.com/showGoalTypes");

    Promise.all([goals, players, goalTypes]).then(values => {
      const renderTable = [];
      values[0].data.forEach((goal, i) => {
        const player = values[1].data.find(player => player.player_id === goal.player_id);
        const goalType = values[2].data.find(goalType => goalType.goal_type_id === goal.goal_type_id);
        
        console.log(goals, " = goals check");
        console.log(players, " = players check");
        console.log(goalTypes, " = goalTypes check");
        
        renderTable[i] = {
          goal_id: goal.goal_id,
          player_id: player.first_name + " " + player.last_name,
          goal_type_id: goalType.type,
          match_id: goal.match_id,
          description: goal.description
        }
      });
      this.setState({ renderTable: renderTable, values:values});
    });
  }

  onEdit(editItem) {
    editItem.player_id = this.state.values[1].data.find(row => editItem.player_id.includes(row.last_name)).player_id; 
    editItem.goal_type_id = this.state.values[2].data.find(row => row.type === editItem.goal_type_id).goal_type_id; 

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
        return <Table objectList={this.state.renderTable} onEdit={this.onEdit} addPage={this.addPage} itemFieldsName={this.state.itemFieldsName} itemFields={this.state.itemFields} title='Goals' addButton='Add Goal' />
      case 'editPage':
        return <EditPage itemToEdit={this.state.itemToEdit} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/updateGoal' deleteURL={`https://case-users.herokuapp.com/deleteGoal/${this.state.itemToEdit.goal_id}`} editName='Goal'/>
      case 'addPage':
        return <AddPage formFields={this.state.itemFields} onRouteChange={this.onRouteChange} apiURL='https://case-users.herokuapp.com/createGoal' addName='Goal' />
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

export default Goals;