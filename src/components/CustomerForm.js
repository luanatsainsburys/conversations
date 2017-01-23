/* eslint-disable react/prop-types */

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { Field, reduxForm, propTypes } from 'redux-form/immutable';
import {renderField, renderCheckbox} from '../helpers/form';


//Get required actions
import {getFoundCustomer, updateCustomer} from '../store/ducks/customers';

const validate = values => {
    const errors = {};
    const firstName = values.get('name.first');

    if (!firstName) {
        errors['name.first'] = 'Required';
    } 
    return errors;
};

function makeCheckbox (objName, propName) {
    return (
        <div className="checkbox">
            <label>
                <Field name={objName+'.'+propName} id={objName+'.'+propName} component={renderCheckbox}/>
                {propName}
            </label>
        </div>
    );
} 

class CustomerForm extends Component {
    static propTypes = {
        ...propTypes,
        // other props you might be using
    }

    componentDidMount() {
        this.handleInitialize();
    }

    handleInitialize() {
    }

    handleFormSubmit(values) {
        this.props.actions.updateCustomer(values);
    }

    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div className="col-sm-8 col-sm-offset-2">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="name.title">Title:</label>
                        <div className="col-sm-8">
                        <Field name="name.title" type="text" component={renderField} className="form-control col-sm-4"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="name.first">First Name:</label>
                        <div className="col-sm-8">
                        <Field name="name.first" type="text" component={renderField} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="name.last">Last Name:</label>
                        <div className="col-sm-8">
                        <Field name="name.last" type="text" component={renderField} className = "form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="Gender">Gender:</label>
                        <div className="col-sm-4">
                            <Field name="gender" component="select" className="form-control">
                                <option/>
                                <option name="Male">Male</option>
                                <option name="Female">Female</option>
                            </Field>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="date_of_birth">Date of Birth:</label>
                        <div className="col-sm-4">
                        <Field name="date_of_birth" type="text" component={renderField} className = "form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Suppressions:</label>
                        <fieldset className="col-sm-4">
                                {makeCheckbox("suppressions","by_postal_provider")}
                                {makeCheckbox("suppressions","by_email_provider")}
                                {makeCheckbox("suppressions","has_gas_gone_away")}
                                {makeCheckbox("suppressions","has_qinetic_gone_away")}
                                {makeCheckbox("suppressions","has_qinetic_deceased")}
                                {makeCheckbox("suppressions","is_baby_mps_registered")}
                                {makeCheckbox("suppressions","is_email_hard_bounce")}
                                {makeCheckbox("suppressions","is_manual")}
                                {makeCheckbox("suppressions","mps_registered")}
                                {makeCheckbox("suppressions","is_national_deceased_registered")}
                        </fieldset>
                    </div>
                    <div className="form-group">
                    <button action="submit" className="col-sm-offset-2 btn btn-danger" disabled={submitting}>Save changes</button>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
  return {
    initialValues: getFoundCustomer(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({updateCustomer}, dispatch)
  };
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
let boundForm = reduxForm({
    form: 'CustomerForm',  // a unique identifier for this form
    enableReinitialize: true,
    //validate,
})(CustomerForm);

export default connect(mapStateToProps,mapDispatchToProps)(boundForm);