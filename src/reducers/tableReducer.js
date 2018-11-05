import { FETCH_TABLE_DATA } from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_TABLE_DATA:
      return { ...state, data: action.payload.data};
    default:
      return state;
  }
}