import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class AddPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {player_id: null, goal_type_id: null, match_id: null, description: null} ,
      validation: {player_id: true, goal_type_id: true, match_id: true, description: true},
      playerInput: "",
      goalTypeInput: "",
      renderPlayerName: false,
      renderGoalType: false
    };
  }

  createNotification = (type) => {
    console.log(type);
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('The goal was edited!', 'Goal Edited');
           break;
         case 'success':
           NotificationManager.success('A new match was added!', 'Match Added');
           break;
         case 'warning':
           NotificationManager.warning('The goal was deleted!', 'Goal Deleted', 3000);
           break;
         case 'error':
           NotificationManager.error('Error message', 'Click me!', 5000, () => {
             alert('callback');
           });
           break;
       }
     };
  };


  componentWillMount() {
    axios
      .get("https://case-person.herokuapp.com/showPlayers")
      .then(response => {
          const playerInput = response.data.find(players => players.player_id === this.props.itemToEdit.player_id).last_name;
          this.setState({ players: response.data, playerInput: playerInput });
        });

    axios
      .get("http://case-goal.herokuapp.com/showGoalTypes")
      .then(response => {
          const goalTypeInput = response.data.find(goalTypes => goalTypes.goal_type_id === this.props.itemToEdit.goal_type_id).type;
          this.setState({ goalTypes: response.data, goalTypeInput: goalTypeInput });
        });
  }

 
  componentDidMount() {
    const { itemToEdit } = this.props;
    this.setState({ dataToSend: itemToEdit });
  }


  validateForm(){
    let isValidated = true;
    const validation = this.state.validation;
    const dataToSend = this.state.dataToSend;

    let player = this.state.players.find(player => player.last_name === this.state.playerInput);
    let goalType = this.state.goalTypes.find(goalType => goalType.type === this.state.goalTypeInput);

    if(player){
      validation.player_id = true;
      dataToSend.player_id = player.player_id;
    } else {
      validation.player_id = false;
      isValidated = false;
    }

    if(goalType){
      validation.goal_type_id = true;
      dataToSend.goal_type_id = goalType.goal_type_id;
    } else { 
      validation.goal_type_id = false;
      isValidated = false;
    }

     if(dataToSend.match_id != null){
      validation.match_id = true;
    } else { 
      validation.match_id = false;
      isValidated = false;
    }

     if(dataToSend.description != null){
      validation.description = true;
    } else { 
      validation.description = false;
      isValidated = false;
    }

    this.setState({ validation: validation })
    return isValidated;
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('object 1 = ', this.state.dataToSend)
    if(!this.validateForm()){
      return console.log('error');
    }else{
    axios
      .put(this.props.apiURL, this.state.dataToSend)
      .then(response => this.props.onRouteChange())
      .then(this.createNotification('info'))
      .catch(error => console.log(error));
    }  
  }

  // HANDLE PLAYERS DROPDOWN

  handlePlayerDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.players.filter(player => {
      return player.last_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderPlayerDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.player_id}
          onMouseDown={e => {
            this.setState({
              player_id: listItem.player_id,
              playerInput: listItem.last_name,
              filteredList: []
            });
          }}
        >
          {listItem.last_name}
        </div>
      );
    });
  };

  // HANDLE GOAL TYPE DROPDOWN

  handleTeamDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.goalTypes.filter(goalType => {
      return goalType.type.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderTeamDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.goal_type_id}
          onMouseDown={e => {
            this.setState({
              goal_type_id: listItem.goal_type_id,
              goalTypeInput: listItem.type,
              filteredList: []
            });
          }}
        >
          {listItem.type}
        </div>
      );
    });
  };

  render() {
    const { deleteURL, itemToEdit } = this.props;
    return <section className="container">
        {this.state.autoCompleteList}
        <h1>Edit {this.props.editName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>

        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
        <label className="col-2 col-form-label">Last Name</label>

        <div className="autocomplete">
          {!this.state.validation.player_id && <span className="help-block">Please correct the error</span>}
          <input autoComplete="new-password" className="form-control" type="text" name='player_id' value={this.state.playerInput} onClick={e => this.setState({ renderPlayerName: true })} onBlur={e => {
              this.setState({ filteredList: [], renderPlayerName: false });
            }} onChange={e => {
              this.setState({ playerInput: e.target.value });
              this.handlePlayerDropdown(e);
            }} />
          <div className="autocomplete-items">
            {this.state.renderPlayerName && this.renderPlayerDropdown()}
          </div>
        </div>

        <label className="col-2 col-form-label">Goal Type</label>
          <div className="autocomplete">
          {!this.state.validation.goal_type_id && <span className="help-block">Please correct the error</span>}
          <input autoComplete="new-password" className="form-control" type="text" name='goal_type_id' value={this.state.goalTypeInput} onClick={e => this.setState({ renderGoalType: true })} onBlur={e => {
              this.setState({ filteredList: [], renderGoalType: false });
            }} onChange={e => {
              this.setState({ goalTypeInput: e.target.value });
              this.handleTeamDropdown(e);
            }} />
          <div className="autocomplete-items">
            {this.state.renderGoalType && this.renderTeamDropdown()}
          </div>
          </div>

          <label className="col-2 col-form-label">Match ID</label>
          {!this.state.validation.match_id && <span className="help-block">Please correct the error</span>}
          <input defaultValue={itemToEdit.match_id} className="form-control" type="text" name='match_id' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, match_id: e.target.value}})}} />
          <label className="col-2 col-form-label">Description</label>
          {!this.state.validation.description && <span className="help-block">Please correct the error</span>}
          <input defaultValue={itemToEdit.description} className="form-control" type="text" name='description' onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, description: e.target.value}})}} />
          
          <button type="submit" className="btn btn-warning btn-lg">Add</button>
          {this.props.itemToEdit && <button onClick={e => {axios.delete(deleteURL, itemToEdit).then(response => this.props.onRouteChange()).then(this.createNotification('warning')).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>}
        </form>
      </section>;
  }
}

export default AddPlayer;
