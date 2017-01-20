// customers.js
import Immutable from 'immutable';
import initialState from '../../reducers/initialState';

import fetch from 'isomorphic-fetch';

// Actions
const CREATE = 'road-runner/customer/CREATE';
const REMOVE = 'road-runner/customer/REMOVE';
//const LOADING = 'road-runner/customer/LOADING';

export const FETCH_CUSTOMER = 'road-runner/customer/FETCH_CUSTOMER';
export const FETCH_CUSTOMER_SUCCESS = 'road-runner/customer/FETCH_CUSTOMER_SUCCESS';
export const FETCH_CUSTOMER_FAILURE = 'road-runner/customer/FETCH_CUSTOMER_FAILURE';
export const RESET_FOUND_CUSTOMER = 'road-runner/customer/RESET_FOUND_CUSTOMER';

export const UPDATE_CUSTOMER = 'road-runner/customer/UPDATE_CUSTOMER';

// Reducer
export default function reducer(state = initialState.get('foundCustomer'), action = {}) {
    switch (action.type) {
        case FETCH_CUSTOMER_SUCCESS:
            return Immutable.Map.of('customer', action.customer,'success', true, 'errorMessage', '');

        case FETCH_CUSTOMER_FAILURE:
            return Immutable.Map.of('customer', Immutable.Map(),'success', false, 'errorMessage', action.error.message);

        case RESET_FOUND_CUSTOMER:
            return Immutable.Map.of('customer', Immutable.Map(),'success', false, 'errorMessage', '');

        default: 
            return state;
    }
}


function makeBaseAuth (user, pswd){ 
    let token = user + ':' + pswd;
    let hash = "";
    if (btoa) {
        hash = btoa(token);
    }
    return "Basic " + hash;
}

function fetchPersonFromServer(ecid) {
    const headers = {
       'Accept': 'application/json',
        'Content-Type': 'application/json',
//        'Authorization': 'Basic '+btoa('SIPTester:SIPTester'),
        'Authorization': makeBaseAuth('SIPTester','SIPTester'),
    };

    const options = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
 };

  return fetch('http://devtlnx0157.stbc2.jstest2.net:15100/v2/customer-profiles/'+ ecid + '?type=ecid', options);
  //return fetch('http://devtlnx0157.stbc2.jstest2.net:15100/v2/customer-profiles/50000007797810?type=ecid', options);
  //return fetch('/v2/customer-profiles/50000007797810?type=ecid', options);
}

// Action Creators

export function fetchCustomer(ecid) {
    return (dispatch) => {
        dispatch(fetchingCustomer(true));
        fetchPersonFromServer(ecid)
        .then((response) => {
                if (!response.ok) {
                    throw Error('Error ' + response.status + '-' + response.statusText);
                }
                dispatch(fetchingCustomer(false));
                return response;
            })
        .then((response) => response.json())
        .then((customer) => dispatch(customerFetchSuccess(Immutable.fromJS(customer.enterprise_customer))))
        .catch((error) => dispatch(customerFetchFailure(error)));
    };
}

function fetchingCustomer(isFetching) {
  return { type: FETCH_CUSTOMER, isFetching };
}

function customerFetchSuccess(customer) {
  return { type: FETCH_CUSTOMER_SUCCESS, customer };
}

function customerFetchFailure(error) {
  return { type: FETCH_CUSTOMER_FAILURE, error };
}

export function createPerson(customer) {
  return { type: CREATE, customer };
}

export function updateCustomer(customer) {
  return { type: UPDATE_CUSTOMER, customer };
}

export function removePerson(customer) {
  return { type: REMOVE, customer };
}

//Selectors
export function getFoundCustomer (state) {
  return state.getIn(['foundCustomer', 'customer']);
}


// export function searchCustomer(url) {
//     return (dispatch) => {
//         dispatch(dataIsLoading(true));
//         fetch(url)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw Error(response.statusText);
//                 }
//                 dispatch(dataIsLoading(false));
//                 return response;
//             })
//             .then((response) => response.json())
//             .then((items) => dispatch(itemsFetchDataSuccess(items)))
//             .catch(() => dispatch(itemsHasErrored(true)));
//     };
// }