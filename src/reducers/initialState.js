import Immutable from 'immutable';
import sampleCustomer from '../store/sampleCustomer';

//const initialState = Immutable.fromJS({'routing':{}, 'form':{}, 'person':{}});
const initialState = Immutable.fromJS({'routing':{}, 'form':{}, 'person':sampleCustomer});

export default initialState;