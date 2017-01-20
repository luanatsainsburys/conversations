import Immutable from 'immutable';
//import sampleCustomer from '../store/sampleCustomer';

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