'use strict'

import React from 'react';
import { Modal } from 'react-bootstrap';

import DashboardAPI from 'DashboardApi';

class FmsPrivateReplyModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShown: false,
			isSending: false
		}
		this.handleSendButton = this.handleSendButton.bind(this);
		this.close = this.close.bind(this);
	}
	handleSendButton() {
		let message = this.refs.message_text.value;
		if (message && message != "") {
			this.setState({ isSending: true });
			DashboardAPI.postPrivateReplyMessage(this.props.message._id, message).then((res) => {
				this.close();
				this.props.handleSendMessage();
				this.setState({ isSending: false });
			}, (err) => {
				this.setState({ isSending: false });
				alert("Không thể gửi tin nhắn");
				throw new Error(err);
			})
		}
	}
	open() {
		this.setState({ isShown: true });
	}
	close() {
		this.setState({ isShown: false });
	}
	render() {
		return (
			<Modal show={this.state.isShown} onHide={this.close} backdrop='static' keyboard={false} >
				<Modal.Header closeButton={this.state.isSending == false}>
					<Modal.Title>Nhắn tin đến {this.props.message.from.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<textarea className="textarea-private-reply" placeholder="Nhập tin nhắn" ref="message_text" rows={5} />
				</Modal.Body>
				<Modal.Footer>
					<div className="private-rep-modal-footer-wrapper">
						<button type="button" className={"btn btn-primary private-rep-btn"}
							disabled={this.state.isSending}
							onClick={this.handleSendButton}>Gửi</button>
					</div>
				</Modal.Footer>
			</Modal>
		)
	}
}

module.exports = FmsPrivateReplyModal;
