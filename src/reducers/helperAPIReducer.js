import { SET_ROW_API_HELPERS } from '../constants';

export default (state={}, action) => {
  switch(action.type) {
    case SET_ROW_API_HELPERS:
      return {...state, data: action.payload};
    default:
      return state;
  }
}