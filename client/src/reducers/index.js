import { combineReducers } from 'redux';
import auth from './auth';
import treeview from './treeview';

export default combineReducers({
   auth,
   treeview,
})