import {combineReducers} from 'redux-immutable';
//import {routerReducer} from 'react-router-redux';
import routerReducer from './immutableRouteReducer';
import { reducer as form } from 'redux-form/immutable';
import foundCustomer from '../store/modules/customers';

const rootReducer = combineReducers({
  routing: routerReducer,
  form,
  foundCustomer
});

export default rootReducer;