import Immutable from 'immutable';

const initialState = Immutable.fromJS({'routing':{}, 'form':{},
    'conversations': {
        'data': {},
        'errorMessage': '',
        'success': false
    }
});

export default initialState;