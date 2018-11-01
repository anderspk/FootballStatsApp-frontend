import { combineReducers } from 'redux';
import tableReducer from './tableReducer';

const rootReducer = combineReducers({
  table: tableReducer
})

export default rootReducer;