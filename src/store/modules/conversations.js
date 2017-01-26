import Immutable from 'immutable';
import initialState from '../../reducers/initialState';


// Actions
export const FETCH_CONVERSATION = 'my-performance/conversation/FETCH_CONVERSATION';
export const FETCH_CONVERSATION_SUCCESS = 'my-performance/conversation/FETCH_CONVERSATION_SUCCESS';
export const FETCH_CONVERSATION_FAILURE = 'my-performance/conversation/FETCH_CONVERSATION_FAILURE';
export const RESET_FOUND_CONVERSATION = 'my-performance/conversation/RESET_FOUND_CONVERSATION';

export const UPDATE_CONVERSATION = 'my-performance/conversation/UPDATE_CONVERSATION';

// Reducer
export default function reducer(state = initialState.get('conversations'), action = {}) {
    switch (action.type) {
        case FETCH_CONVERSATION_SUCCESS:
           return Immutable.Map.of('data', action.customer,'success', true, 'errorMessage', '');

        case FETCH_CONVERSATION_FAILURE:
            return Immutable.Map.of('data', Immutable.Map(),'success', false, 'errorMessage', action.error.message);

        case RESET_FOUND_CONVERSATION:
            return Immutable.Map.of('data', Immutable.Map(),'success', false, 'errorMessage', '');

        default: 
            return state;
    }
}

function callServerApi(colleagueId) {
    const headers = {
       'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const options = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
 };

  return fetch('http://localhost:7907/mymeetings/' + colleagueId, options);
}

// Action Creators

export function fetchConversations(colleagueId) {
    return (dispatch) => {
        dispatch(fetchingConversations(true));
        callServerApi(colleagueId)
        .then((response) => {
                if (!response.ok) {
                    throw Error('Error ' + response.status + '-' + response.statusText);
                }
                dispatch(fetchingConversations(false));
                return response;
            })
        .then((response) => response.json())
        .then((data) => dispatch(conversationsFetchSuccess(Immutable.fromJS(data.Meetings))))
        .catch((error) => dispatch(conversationsFetchFailure(error)));
    };
}

function fetchingConversations(isFetching) {
  return { type: FETCH_CONVERSATION, isFetching };
}

function conversationsFetchSuccess(conversations) {
  return { type: FETCH_CONVERSATION_SUCCESS, conversations };
}

function conversationsFetchFailure(error) {
  return { type: FETCH_CONVERSATION_FAILURE, error };
}

// export function createConversation(conversation) {
//   return { type: CREATE_CONVERSATION, conversation };
// }

// export function updateConversation(conversation) {
//   return { type: UPDATE_CONVERSATION, conversation };
// }

// export function removeConversation(conversation) {
//   return { type: REMOVE_CONVERSATION, conversation };
// }

//Selectors
export function getConversations (state) {
  return state.getIn(['conversations', 'data']);
}
