/* eslint-disable react/prop-types */

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

//Form helpers
import { Field, reduxForm, propTypes } from 'redux-form/immutable';
import {renderField} from '../helpers/form';

//Get required actions
import {fetchCustomer} from '../store/modules/customers';

//VALIDATIONS
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength14 = maxLength(14);

// const digitsOnly = max => value =>
//   value && (!/^\d{max}$/.test(value)) ? `Must exactly ${max} digits` : undefined;
// const digitsOnly14 = digitsOnly(14);

const digitsOnly = value =>
  value && (!/^\d*$/.test(value)) ? `Only digits please` : undefined;
// const digitsOnly14 = digitsOnly(14);

const validate = values => {
    const errors = {};
    const ecid = values.get('ecid');

    if (!ecid) {
        errors.ecid = 'Required';
    } else if (!/^\d{14}$/.test(ecid)) {
        errors.ecid = 'ECID must be a string of 14 digits characters';
    }
    return errors;
};

class CustomerSearchForm extends Component {
    static propTypes = {
        ...propTypes,
        // other props you might be using
    }

    handleFormSubmit(values) {
        const ecid = values.get('ecid');
        this.props.actions.fetchCustomer(ecid);
    }

    render() {
        const { handleSubmit, submitting } = this.props;
        const maxLength = {"maxLength": 14};

        return (
            <div className="col-sm-4 col-sm-offset-4">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="form-horizontal">
                    <div className="form-group">
                        <label className="h4">Search customer by ECID</label>
                        <Field name="ecid" type="text" props={maxLength} component={renderField} label="ECID" 
                            className="form-control"
                            validate={[ maxLength14, digitsOnly ]}/>
                        <br/>
                        <button action="submit" className="btn btn-danger" disabled={submitting}>Search</button>
                    </div>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({fetchCustomer}, dispatch)
  };
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
let boundForm = reduxForm({
  form: 'CustomerSearchForm',  // a unique identifier for this form
  validate,
//   enableReinitialize: true
})(CustomerSearchForm);

export default connect(null,mapDispatchToProps)(boundForm);