import Immutable from 'immutable';

const initialState = Immutable.fromJS({'routing':{}, 'form':{},
    'foundCustomer': {
        'customer': {},
        // 'loading': false,
        // 'error': false,
        'errorMessage': '',
        'success': false
    }
});

export default initialState;