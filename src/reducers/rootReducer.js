import { combineReducers } from 'redux';
import tableReducer from './tableReducer';
import helperAPIReducer from './helperAPIReducer';

const rootReducer = combineReducers({
  table: tableReducer,
  rowAPI: helperAPIReducer
})

export default rootReducer;