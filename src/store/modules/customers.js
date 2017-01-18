// customers.js
import Immutable from 'immutable';
import initialState from '../../reducers/initialState';

import fetch from 'isomorphic-fetch';

// Actions
const LOAD   = 'road-runner/person/LOAD';
const CREATE = 'road-runner/person/CREATE';
const UPDATE = 'road-runner/person/UPDATE';
const REMOVE = 'road-runner/person/REMOVE';
//const LOADING = 'road-runner/person/LOADING';

// Reducer
export default function reducer(state = initialState.get('person'), action = {}) {
    switch (action.type) {
        case LOAD:
            return Immutable.fromJS(action.person);//Plain js object from server

        case UPDATE:
            return action.customer;//Already immutable type

        // do reducer stuff
        default: return state;
    }
}

// Action Creators

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
        'Access-Control-Allow-Origin':'*',
        
        'Origin': 'http://localhost:3000',
       'Accept': 'application/json',
        //'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Content-Type': 'application/json',
//        'Authorization': 'Basic '+btoa('SIPTester:SIPTester'),
        'Authorization': makeBaseAuth('SIPTester','SIPTester'),
        'Cache-control': 'no-cache'
    };

    const options = {
        method: 'GET',
        headers: headers,
        mode: 'cors'
        //cache: 'default'
 };

  return fetch('http://devtlnx0157.stbc2.jstest2.net:15100/v2/customer-profiles/'+ ecid + '?type=ecid', options);
//  return fetch('http://devtlnx0157.stbc2.jstest2.net:15100/v2/customer-profiles/50000007797810?type=ecid', options);
  //return fetch('/v2/customer-profiles/50000007797810?type=ecid', options);
}

function errorHandler (error) {
        console.log('Error:'+error+' getting person ');
}

export function loadPerson(name) {
    return (dispatch) => {
        //dispatch(dataIsLoading(true));
        fetchPersonFromServer(name)
        .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                //dispatch(dataIsLoading(false));
                return response;
            })
        .then((response) => response.json())
//        .then((items) => dispatch(itemsFetchDataSuccess(items)))
        .then((customer) => dispatch(updateCustomer(Immutable.fromJS(customer.enterprise_customer))))
//        .catch(() => dispatch(itemsHasErrored(true)));
        .catch(errorHandler);
    };
}



// export function loadPerson() {
//   return { type: LOAD };
// }

export function createPerson(person) {
  return { type: CREATE, person };
}

export function updateCustomer(customer) {
  return { type: UPDATE, customer };
}

export function removePerson(person) {
  return { type: REMOVE, person };
}

//Selectors
export function getFoundCustomer (state) {
  return state.get("person");
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