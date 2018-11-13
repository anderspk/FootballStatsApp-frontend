import React, { Component } from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


// TODO: Change inputs to injections if needed....

class AddMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      dataToSend: {match_date: null, home_team_id: null, away_team_id: null, season_id: null, location_id: null} ,
      validation: {match_date: true, home_team_id: true, away_team_id: true, season_id: true, location_id: true},
      homeTeamInput: "",
      awayTeamInput: "",
      seasonInput: "",
      addressInput: "",
/*
      homeTeamInput: `${props.itemToEdit.home_team_id}`,
      awayTeamInput: `${props.itemToEdit.away_team_id}`,
      seasonInput: `${props.itemToEdit.season_id}`,
      addressInput: `${props.itemToEdit.location_id}`,
  */    
      renderHomeTeam: false,
      renderAwayTeam: false,
      renderSeasons: false,
      renderAddresses: false
    };
  }

  createNotification = (type) => {
     return () => {
       switch (type) {
         case 'info':
           NotificationManager.info('The match was edited!', 'Match Edited');
           break;
         case 'success':
           NotificationManager.success('A new match was added!', 'Match Added');
           break;
         case 'warning':
           NotificationManager.warning('The match was deleted!', 'Match Deleted', 3000);
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
    // home team
    axios
      .get("https://case-team.herokuapp.com/showAllTeamData")
      .then(response => {
          const homeTeamInput = response.data.find(homeTeams => homeTeams.team_id === this.props.itemToEdit.home_team_id).association_name;
          this.setState({ homeTeams: response.data, homeTeamInput: homeTeamInput });
        });
    // away team
    axios
      .get("https://case-team.herokuapp.com/showAllTeamData")
      .then(response => {
          const awayTeamInput = response.data.find(awayTeams => awayTeams.team_id === this.props.itemToEdit.away_team_id).association_name;
          this.setState({ awayTeams: response.data, awayTeamInput: awayTeamInput });
        });
    // seasons
    axios
      .get("http://case-season.herokuapp.com/showSeasons")
      .then(response => {
          const seasonInput = response.data.find(seasons => seasons.season_id === this.props.itemToEdit.season_id).name;
          this.setState({ seasons: response.data, seasonInput: seasonInput });
        });
    // addresses
    axios
      .get("http://case-address.herokuapp.com/showAddresses")
      .then(response => {
          const addressInput = response.data.find(addresses => addresses.location_id === this.props.itemToEdit.location_id).location_name;
          this.setState({ addresses: response.data, addressInput: addressInput });
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

    let homeTeam = this.state.homeTeams.find(homeTeam => homeTeam.association_name === this.state.homeTeamInput);
    let awayTeam = this.state.awayTeams.find(awayTeam => awayTeam.association_name === this.state.awayTeamInput);
    let season = this.state.seasons.find(season => season.name === this.state.seasonInput);
    let address = this.state.addresses.find(address => address.location_name === this.state.addressInput);

    if(homeTeam){
      validation.home_team_id = true;
      dataToSend.home_team_id = homeTeam.team_id;
    } else { 
      validation.home_team_id = false;
      isValidated = false;
    }

    if(awayTeam){
      validation.away_team_id = true;
      dataToSend.away_team_id = awayTeam.team_id;
    } else { 
      validation.away_team_id = false;
      isValidated = false;
    }

    if(season){
      validation.season_id = true;
      dataToSend.season_id = season.season_id;
    } else { 
      validation.season_id = false;
      isValidated = false;
    }

    if(address){
      validation.location_id = true;
      dataToSend.location_id = address.location_id;
    } else {
      validation.location_id = false;
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
    console.log('object 1 = ', this.state.dataToSend)
    axios
      .put(this.props.apiURL, this.state.dataToSend)
      .then(response => this.props.onRouteChange())
      .then(this.createNotification('success'))
      .catch(error => console.log(error));
    }  
  }
 // HANDLE HOME TEAM DROPDOWN

  handleHomeTeamDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.homeTeams.filter(homeTeam => {
      return homeTeam.association_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderHomeTeamDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.home_team_id}
          onMouseDown={e => {
            this.setState({
              home_team_id: listItem.home_team_id,
              homeTeamInput: listItem.association_name,
              filteredList: []
            });
          }}
        >
          {listItem.association_name}
        </div>
      );
    });
  };

  // HANDLE AWAY TEAM DROPDOWN

  handleAwayTeamDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.awayTeams.filter(awayTeam => {
      return awayTeam.association_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderAwayTeamDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.away_team_id}
          onMouseDown={e => {
            this.setState({
              away_team_id: listItem.away_team_id,
              awayTeamInput: listItem.association_name,
              filteredList: []
            });
          }}
        >
          {listItem.association_name}
        </div>
      );
    });
  };

   // HANDLE SEASON DROPDOWN

  handleSeasonDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.seasons.filter(season => {
      return season.name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderSeasonDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.season_id}
          onMouseDown={e => {
            this.setState({
              season_id: listItem.season_id,
              seasonInput: listItem.name,
              filteredList: []
            });
          }}
        >
          {listItem.name}
        </div>
      );
    });
  };


  // HANDLE ADDRESS DROPDOWN

  handleAddressDropdown = e => {
    let input = e.target.value.toLowerCase();
    let filteredList = this.state.addresses.filter(address => {
      return address.location_name.toLowerCase().includes(input);
    });
    this.setState({ filteredList: filteredList });
  };

  renderAddressDropdown = () => {
    return this.state.filteredList.map(listItem => {
      return (
        <div key={listItem.location_id}
          onMouseDown={e => {
            this.setState({
              location_id: listItem.location_id,
              addressInput: listItem.location_name,
              filteredList: []
            });
          }}
        >
          {listItem.location_name}
        </div>
      );
    });
  };

 
  render() {
    const { deleteURL, itemToEdit } = this.props;
    console.log(deleteURL, "delete")
    return <section className="container">
        {this.state.autoCompleteList}
        <NotificationContainer/>
        <h1>Add {this.props.addName}</h1>
        <button className="btn btn-info" onClick={e => this.props.onRouteChange()}>Back</button>

        <form autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
          <label className="col-2 col-form-label">Match Date</label>
          <input defaultValue={itemToEdit.match_date} className="form-control" type="text" name="match_date" onChange={e => {this.setState({ dataToSend: {...this.state.dataToSend, match_date: e.target.value}})}} />
         
          {/* HOME TEAM */}

          <label className="col-2 col-form-label">Home Team</label>
          <div className="autocomplete">
          {!this.state.validation.home_team_id && <span className="help-block">Please correct the error</span>}
            <input className="form-control" type="text" name='home_team_id' value={this.state.homeTeamInput} onFocus={e => this.setState({ renderHomeTeam: true })} onBlur={e => {
                this.setState({ filteredList: [], renderHomeTeam: false });
              }} onChange={e => {
                this.setState({ homeTeamInput: e.target.value });
                this.handleHomeTeamDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderHomeTeam && this.renderHomeTeamDropdown()}
            </div>
          </div>

        {/* AWAY TEAM */}

          <label className="col-2 col-form-label">Away Team</label>
          <div className="autocomplete">
          {!this.state.validation.away_team_id && <span className="help-block">Please correct the error</span>}
            <input className="form-control" type="text" name='away_team_id' value={this.state.awayTeamInput} onFocus={e => this.setState({ renderAwayTeam: true })} onBlur={e => {
                this.setState({ filteredList: [], renderAwayTeam: false });
              }} onChange={e => {
                this.setState({ awayTeamInput: e.target.value });
                this.handleAwayTeamDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderAwayTeam && this.renderAwayTeamDropdown()}
            </div>
          </div>

          {/* SEASON */}

          <label className="col-2 col-form-label">Season</label>
          <div className="autocomplete">
          {!this.state.validation.season_id && <span className="help-block">Please correct the error</span>}
            <input className="form-control" type="text" name='season_id' value={this.state.seasonInput} onFocus={e => this.setState({ renderSeasons: true })} onBlur={e => {
                this.setState({ filteredList: [], renderSeasons: false });
              }} onChange={e => {
                this.setState({ seasonInput: e.target.value });
                this.handleSeasonDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderSeasons && this.renderSeasonDropdown()}
            </div>
          </div>

          {/* LOCATION ID */}

          <label className="col-2 col-form-label">Location</label>
          <div className="autocomplete">
          {!this.state.validation.location_id && <span className="help-block">Please correct the error</span>}
          <input className="form-control" type="text" name='location_id' value={this.state.addressInput} onFocus={e => this.setState({ renderAddresses: true })} onBlur={e => {
                this.setState({ filteredList: [], renderAddresses: false });
              }} onChange={e => {
                this.setState({ addressInput: e.target.value });
                this.handleAddressDropdown(e);
              }} />
            <div className="autocomplete-items">
              {this.state.renderAddresses && this.renderAddressDropdown()}
            </div>
          </div>
          <button type="submit" className="btn btn-warning btn-lg">Save</button>
          {this.props.itemToEdit && <button onClick={e => {axios.delete(deleteURL, itemToEdit).then(response => this.props.onRouteChange()).then(this.createNotification('warning')).catch(error => console.log(error))}} type="button" className="btn btn-danger btn-lg btn-block">Delete</button>}
        </form>
      </section>;
  }
}

export default AddMatch;
