import {combineReducers} from 'redux-immutable';
//import {routerReducer} from 'react-router-redux';
import routerReducer from './immutableRouteReducer';
import { reducer as form } from 'redux-form/immutable';
import conversations from '../store/modules/conversations';

const rootReducer = combineReducers({
  routing: routerReducer,
  form,
  conversations
});

export default rootReducer;