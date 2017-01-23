import Immutable from 'immutable';
import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


// import {Link} from 'react-router';
import CustomerSearchForm from './CustomerSearchForm';

const CustomerSearchPage = (props) => {
    let errorMessage = !props.foundCustomer.get('success') && props.foundCustomer.get('errorMessage') &&
                <div className="row">
                    <div className="col-sm-offset-4">
                        <span className="error">{props.foundCustomer.get('errorMessage')}</span>
                    </div>
                </div>;

    let customerLink = props.foundCustomer.get('success') &&
                <div className="row">
                    <div className="col-sm-offset-4">
                        <span>We have found this customer. Please select <Link to="/customer-search">this link to view</Link></span>
                    </div>
                </div>;

    return (
        <div>
            <div className="row">
                <CustomerSearchForm/>
            </div>
            {errorMessage}
            {customerLink}
        </div>
        );
    };

CustomerSearchPage.propTypes = {
   foundCustomer: PropTypes.instanceOf(Immutable.Map).isRequired
};

function mapStateToProps(state) {
  return {
    foundCustomer: state.get('foundCustomer')
  };
}

export default connect(mapStateToProps, null)(CustomerSearchPage);