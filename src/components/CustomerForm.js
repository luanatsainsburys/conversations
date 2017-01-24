/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */

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

function capitalize([h, ...t]) { return h.toUpperCase() + t.join('').toLowerCase();}

function toSentenceCase (str) {
    const no_ = str.replace(/_/g, ' ');
    return capitalize(no_);
}

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
            <fieldset><legend>Suppressions</legend>
                <div className="col-sm-offset-2">
                {suppFields}
                </div>
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
        let addressFields= [], contactRecord=next.value[1];
        
        //Process address if exists
        if (contactRecord.has('address')) {
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
        }

        //Process phone list if exists
        if (contactRecord.has('phone')) {
            let iterPhones = contactRecord.get('phone').entries(), nextPhone, phoneFields= []; 
            while (!(nextPhone = iterPhones.next()).done) {
                let [phoneKey, phoneRecord] = nextPhone.value;
                phoneFields.push(makeFormTextField('contact_method[' + index + '].phone[' + phoneKey + '].formatted_number', 
                                                    phoneRecord.has('type') ?phoneRecord.get('type') :'Phone'));
            }
            allFields.push(<fieldset><legend>Phones</legend>{phoneFields}</fieldset>);
        }

        //Process email list if exists
        if (contactRecord.has('email')) {
            let iterEmails = contactRecord.get('email').entries(), nextEmail, emailFields = []; 
            while (!(nextEmail = iterEmails.next()).done) {
                let [emailKey, emailRecord] = nextEmail.value;
                emailFields.push(makeFormTextField('contact_method[' + index + '].email[' + emailKey + '].email_address', 
                                                    emailRecord.has('type') ?emailRecord.get('type') :'Email'));
            }
            allFields.push(<fieldset><legend>Emails</legend>{emailFields}</fieldset>);
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
                {makeFormTextField("customer_account.type", "Name")}
                {makeFormTextField("customer_account.id", "Account number")}
            </fieldset>
        </div>
    );
} 

function makeLoyaltyAccount(account) {
    function showField(name) {
        return account.has(name) 
            ?makeFormTextField("loyalty_account." + name, toSentenceCase(name)) :null;
    }

    if (!account) return null;
    return (
        <div className="form-group">
            <fieldset>
            <legend>Loyalty account</legend>
                {showField('loyalty_name')}
                {showField('account_number')}
                {showField('card_number')}
                {showField('valid_from')}
                {showField('valid_to')}
                {showField('status')}
                {showField('status_reason_code')}
                {showField('loyalty_customer_id')}
                {showField('tier_id')}
                {showField('collector_type')}
                {showField('last_update_date')}
            </fieldset>
        </div>
    );
} 

class CustomerForm extends Component {
    static propTypes = {
        ...propTypes,
        // other props you might be using
    }

    handleFormSubmit(values) {
        this.props.actions.updateCustomer(values);
    }

    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div className="col-sm-8 col-sm-offset-2">
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="form-horizontal">
                    {makeFormTextField("name.title", "Title")}
                    {makeFormTextField("name.first", "First Name")}
                    {makeFormTextField("name.last", "Last Name")}
                    {makeFormTextField("name.last_update_date", "Name last update date")}
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="Gender">Gender</label>
                        <div className="col-sm-4">
                            <Field name="gender" component="select" className="form-control">
                                <option/>
                                <option name="Male">Male</option>
                                <option name="Female">Female</option>
                            </Field>
                        </div>
                    </div>
                    {makeFormTextField("date_of_birth", "Date of Birth")}
                    {makeSuppressionFields(this.props.initialValues.get('suppressions'))}
                    <div className="form-group">
                        {makeContactMethods(this.props.initialValues.get('contact_method'))}
                    </div>
                    {makeLoyaltyAccount(this.props.initialValues.get('loyalty_account'))}
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
    //enableReinitialize: true,
    validate,
})(CustomerForm);

export default connect(mapStateToProps,mapDispatchToProps)(boundForm);