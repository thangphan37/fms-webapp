var React = require('react');
var FmsLeftMessageItem = require('FmsLeftMessageItem');
var FmsRightMessageItem = require('FmsRightMessageItem');
var Cookie = require('universal-cookie');
var uuid = require('uuid');

var FmsConversationArea = React.createClass({
	getUserId: function () {
		let cookie = new Cookie();
		let user_id = cookie.get('user_fb_id');
		return user_id;
	},
	render: function () {
		var self = this, user_id = this.getUserId();
		let renderConversation = function () {
			if (!self.props.currentConversation) return;
			return self.props.currentConversation.messages.map(function (message) {
				if (message.sender.fb_id == user_id) {
					return <FmsRightMessageItem message={message} key={uuid()} />;
				} else {
					return <FmsLeftMessageItem message={message} key={uuid()} />;
				}
			});
		};
		return (
			<div>
				<div id="chat-area">
					{renderConversation()}
				</div>
				<div id="input-message-area">

				</div>
			</div>
		);
	}
});

module.exports = FmsConversationArea;
