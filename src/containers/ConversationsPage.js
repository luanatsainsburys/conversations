import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchConversations} from '../store/ducks/conversations';

import Immutable from 'immutable';

function renderConversations(convsMap) {
    let iter = convsMap.entries(), conv, allConvs = [];
    while (!(conv = iter.next()).done) {
        let [convKey, convRecord] = conv.value;
        allConvs.push(<li>{convRecord.get('MeetingId')}</li>);
    }
}

class ConversationsPage extends Component {
    constructor(props) {
        super(props);
        //console.log(JSON.stringify(props));
        //This will fail as link service API does not currently support CORS
        this.props.actions.fetchConversations('E001');
    }

    render() {
        return (
            <div><h3>Should show a list of meeting ids but won't due to lack of CORS support in Link Service API</h3>
                <ul>
                    {renderConversations(this.props.conversations.get('data'))}
                </ul>
            </div>
        );
    }
}

ConversationsPage.propTypes = {
    conversations: PropTypes.instanceOf(Immutable.Map).isRequired,
    actions: PropTypes.shape({fetchConversations: PropTypes.func.isRequired})
};

function mapStateToProps(state) {
  return {
    conversations: state.get('conversations')
  };
}

function mapDispatchToProps(dispatch) {
  return {
     actions: bindActionCreators({fetchConversations}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationsPage);

