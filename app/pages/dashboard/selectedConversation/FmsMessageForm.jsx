import React from 'react';
import { connect } from 'react-redux';

import attachImg from '../../../images/attachment.png';
import sendImg from '../../../images/send.png';

import fileApi from '../../../api/FileApi';
import dashboardApi from '../../../api/DashboardApi';

import { handleFileChange, handleFormSubmit } from '../../../actions/dashboard/selectedConversation/chatArea';

class FmsMessageForm extends React.Component {
  handleFileChange(e) {
    this.props.dispatch(handleFileChange(e));
  }
  handleFormSubmit(e) {
    this.props.dispatch(handleFormSubmit(e, this.refs.message));
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit.bind(this)} className="input-wrapper">
          <input className="input-text" ref="message" rows="3" placeholder="Soạn tin nhắn..." />
          <ul className="group-button">
            {this.props.selectedConversation.type == 'comment' ?
              <li><a href="#">
                <img src={attachImg} className="attach-button" />
                <input type="file" className="input-file" accept="image/*" onChange={this.handleFileChange.bind(this)}></input>
              </a></li>
              : null
            }
            <li><img src={sendImg} className="send-button" onClick={this.handleFormSubmit.bind(this)} /></li>
          </ul>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
		selectedConversation: state.dashboard.selectedConversation.chatArea.conversation
  }
}

export default connect(mapStateToProps)(FmsMessageForm);
