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

function makeFormTextField (name, text) {
    return (
        <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor={name}>{text}</label>
            <div className="col-sm-8">
            <Field name={name} type="text" component={renderField} className="form-control col-sm-4"/>
            </div>
        </div>
    );
}

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

//imMap - immutable map of the 'contact_method' section of the customer profile record
//The problem is we wish to display the fields in a certain order rather than random order
//So this method might not be that useful for now.
function makeContactMethodsDynamic(imMap) {
    if (!imMap) return imMap;

    let allFields = [];

    imMap.forEach(item=>{
 //       const [...allKeys]= item.keys();
//        const [addressKeys] = item.get('address').keys();
//        const [addressKeys] = item.get('address').keys();
        let iter = item.get('address').keys(), next;

        while (!(next = iter.next()).done) {
            allFields.push(makeFormTextField('contact_method[0].address.'+ next.value, next.value));
        }
    });

    return allFields;
}

function makeSuppressionFields(suppMap) {
    let suppFields = [];
    if (!suppMap) return [];
    suppFields.push(makeCheckbox("suppressions","by_postal_provider"));
    suppFields.push(makeCheckbox("suppressions","by_email_provider"));
    suppFields.push(makeCheckbox("suppressions","has_gas_gone_away"));
    suppFields.push(makeCheckbox("suppressions","has_qinetic_gone_away"));
    suppFields.push(makeCheckbox("suppressions","has_qinetic_deceased"));
    suppFields.push(makeCheckbox("suppressions","is_baby_mps_registered"));
    suppFields.push(makeCheckbox("suppressions","is_email_hard_bounce"));
    suppFields.push(makeCheckbox("suppressions","is_manual"));
    suppFields.push(makeCheckbox("suppressions","mps_registered"));
    suppFields.push(makeCheckbox("suppressions","is_national_deceased_registered"));
    return (
        <div className="form-group">
            <label className="col-sm-2 control-label">Suppressions:</label>
            <fieldset className="col-sm-4">
            {suppFields}
            </fieldset>
        </div>
    );
}

//imMap - immutable map of the 'contact_method' section of the customer profile record
function makeContactMethods(imMap) {
    if (!imMap) return [];

    let allFields = [];
    let iter = imMap.entries(), next, index;

    //Process contact method list
    while (!(next = iter.next()).done) {
        index = next.value[0];
        let addressFields= [];
        
        //Process address
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.residence_number', 'residence_number'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.line1', 'line1'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.line2', 'line2'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.line3', 'line3'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.city', 'city'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.county', 'county'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.postcode', 'postcode'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.country', 'country'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.paf_key', 'paf_key'));
        addressFields.push(makeFormTextField('contact_method[' + index + '].address.last_update_date', 'last_update_date'));
        allFields.push(<fieldset><legend>Address</legend>{addressFields}</fieldset>);

        //Process phone list if exists
        if (next.value[1].has('phone')) {
            let iterPhones = next.value[1].get('phone').entries(), nextPhone, phoneFields= []; 
            while (!(nextPhone = iterPhones.next()).done) {
                phoneFields.push(makeFormTextField('contact_method[' + index + '].phone[' + nextPhone.value[0] + '].formatted_number', 
                                                    nextPhone.value[1].get('type')));
            }
            allFields.push(<fieldset><legend>Phones</legend>{phoneFields}</fieldset>);
        }
    }

    return allFields;
}

function makeCustomerAccount(custAcc) {
    if (!custAcc) return null;
    return (
        <div className="form-group">
            <fieldset>
            <legend>Customer account</legend>
                {makeFormTextField("customer_account.type", "Name:")}
                {makeFormTextField("customer_account.id", "Account number:")}
            </fieldset>
        </div>
    );
} 

class CustomerForm extends Component {
    static propTypes = {
        ...propTypes,
        // other props you might be using
    }

    componentWillMount() {
        //let contactMethods = this.props.initialValues.get('contact_method'); //immutable map

        //const [...mykeys]= this.props.initialValues.getIn(['contact_method',0]).keys()

        //["last_update_date", "address", "phone", "email"]
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
                    {makeFormTextField("name.title", "Title:")}
                    {makeFormTextField("name.first", "First Name:")}
                    {makeFormTextField("name.last", "Last Name:")}
                    {makeFormTextField("name.last_update_date", "Name last update date:")}
                    {makeFormTextField("name.title", "Title:")}
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
                    {makeFormTextField("date_of_birth", "Date of Birth:")}
                    {makeSuppressionFields(this.props.initialValues.get('suppressions'))}
                    <div className="form-group">
                        {makeContactMethods(this.props.initialValues.get('contact_method'))}
                    </div>
                    <div className="form-group">
                        <fieldset>
                        <legend>Loyalty account</legend>
                            {makeFormTextField("loyalty_account.loyalty_name", "Name:")}
                            {makeFormTextField("loyalty_account.account_number", "Account number:")}
                        </fieldset>
                    </div>
                    {makeCustomerAccount(this.props.initialValues.get('customer_account'))}
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