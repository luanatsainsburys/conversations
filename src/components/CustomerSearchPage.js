import Immutable from 'immutable';
import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

// import {Link} from 'react-router';
import CustomerSearchForm from './CustomerSearchForm';

const CustomerSearchPage = (props) => {
    return (
        <div>
            <div className="row">
                <CustomerSearchForm/>
            </div>
            {!props.foundCustomer.get('success') && props.foundCustomer.get('errorMessage') &&
                <div className="row">
                    <div className="col-sm-4 col-sm-offset-4">
                        <span className="error">{props.foundCustomer.get('errorMessage')}</span>
                    </div>
                </div>
            }
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