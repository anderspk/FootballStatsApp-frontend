import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class EditResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {score: null, result: null} ,
      validation: {score: true, result: true} ,
      teamInput: "",
      renderTeams: false
    };
  }

  createNotification = (type) => {
    console.log(type);
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('The result was edited!', 'Result Edited');
           break;
         case 'success':
           NotificationManager.success('A new result was added!', 'Added Result');
           break;
         case 'warning':
           NotificationManager.warning('The result was deleted!', 'Result Deleted', 3000);
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
      .get("http://case-team.herokuapp.com/showAllTeamData")
      .then(response => {
          const teamInput = response.data.find(players => players.team_id === this.props.itemToEdit.team_id).association_name;
          this.setState({ teams: response.data, teamInput: teamInput });
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

    let team = this.state.teams.find(team => team.association_name === this.state.teamInput);

    // Match id
    if(dataToSend.match_id != null){
      validation.match_id = true;
    }else{
      validation.match_id = false;
      isValidated = false;
    }

    // team name
   if(team){
      validation.team_id = true;
      dataToSend.team_id = team.team_id;
    } else { 
      validation.team_id = false;
      isValidated = false;
    }

    // score
    if(dataToSend.score != null && /^\d+$/.test(dataToSend.score)){

      validation.score = true;
    }else{
      console.log(/^\d+$/.test(dataToSend.score));
      validation.score = false;
      isValidated = false;
    }

    // result
    if(dataToSend.result != null && (dataToSend.result.toLowerCase().match("win")||dataToSend.result.toLowerCase().match("loss")||dataToSend.result.toLowerCase().match("draw"))){
      validation.result = true;
    }else{
      validation.result = false;
      isValidated = false;
    }

    this.setState({ validation: validation })
    return isValidated;
  }


  handleSubmit(e) {
    e.preventDefault();
    if(!this.validateForm()){
      return console.log('error');
    }else{
    console.log('object to send = ', this.state.dataToSend)
    axios
      .put(this.props.apiURL, this.state.dataToSend)
      .then(response => this.props.onRouteChange())
      .then(this.createNotification('info'))
      .catch(error => console.log(error));
    }  
  }

  // HANDLE TEAM DROPDOWN

  handleTeamDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.teams.filter(team => {
      return team.association_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderTeamDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.team_id}
          onMouseDown={e => {
            this.setState({
              team_id: listItem.team_id,
              teamInput: listItem.association_name,
              filteredList: []
            });
          }}
        >
          {listItem.association_name}
        </div>
      );
    });
  };

  render() {
    const { deleteURL, itemToEdit } = this.props;
    return <section className="container">
        {this.state.autoCompleteList}
        <h1>Add {this.props.addName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>

        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
             
        <label className="col-2 col-form-label">Score</label>
          {!this.state.validation.score && <span className="help-block">Please fill out this field!</span>}
          <input defaultValue={itemToEdit.score} className="form-control" type="text" name="score" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, score: e.target.value}})}} />
        
        <label className="col-2 col-form-label">Result</label>
          {!this.state.validation.result && <span className="help-block">Enter Win, Loss or Draw </span>}
          <input defaultValue={itemToEdit.result} className="form-control" type="text" name="result" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, result: e.target.value}})}} />
        

          <button type="submit" className="btn btn-warning btn-lg">Edit</button>
          {this.props.itemToEdit && <button onClick={e => {axios.delete(deleteURL, itemToEdit).then(response => this.props.onRouteChange()).then(this.createNotification('warning')).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>}
        </form>
      </section>;
  }
}

export default EditResult;
