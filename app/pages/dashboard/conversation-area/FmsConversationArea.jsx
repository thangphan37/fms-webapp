'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const uuid = require('uuid');

let FmsMessageItem = require('FmsMessageItem');
let FmsMessageForm = require('FmsMessageForm');
let FmsInfoChat = require('FmsInfoChat');
let FmsSpin = require('FmsSpin');
let DashboardAPI = require('DashboardApi');
let FmsPostInfoConversation = require('FmsPostInfoConversation');
let FmsTagsBar = require('FmsTagsBar');

let lastScrollPosition;
let lastLength = 0;

let FmsConversationArea = React.createClass({
	getInitialState: function () {
		return {
			showSpin: false,
			postInfo: null
		}
	},
	clientChanged: function () {
		this.setState({ postInfo: null });
		lastLength = 0;
	},
	scrollToBottom: function () {
		let list = this.refs.chat_area;
		list.scrollTop = list.scrollHeight;
	},
	loadPostInfo: function () {
		let current = this.props.currentConversation;
		if (!this.state.postInfo && current.type == "comment") {
			this.setState({ showSpin: true });
			DashboardAPI.getPostInfo(current.parent_fb_id).then((res) => {
				this.setState({ postInfo: res, showSpin: false });
			}, (err) => {
				console.log(err);
				this.setState({ postInfo: "not found", showSpin: false });
			});
		}
	},
	getChatAreaWidth: function () {
		let list = this.refs.chat_area;
		return list.clientWidth;
	},
	componentDidMount: function () {
		let list = this.refs.chat_area;
		list.addEventListener('scroll', () => {
			if ($(list).scrollTop() == 0) {
				this.loadMoreMessages();
			}
		});
	},
	loadMoreMessages: function () {
		let current = this.props.currentConversation;
		if (this.props.isLoading || this.state.showSpin) return;
		if (current.type == "comment" && current.paging) {
			this.setState({ showSpin: true });
			DashboardAPI.getReplyComment(current.fb_id, current.paging).then((res) => {
				let paging = (res.paging) ? res.paging.next : null
				this.setState({ showSpin: false });
				this.props.displayMoreMessages(res.data, paging);
			}, (err) => {
				console.log(err);
				this.setState({ showSpin: false });
			});
		} else if (current.paging) {
			this.setState({ showSpin: true });
			DashboardAPI.getMessageInbox(current._id, current.paging).then((res) => {
				let paging = (res.paging) ? res.paging.next : null;
				this.setState({ showSpin: false });
				this.props.displayMoreMessages(res.data, paging);
			}, (err) => {
				console.log(err);
				this.setState({ showSpin: false });
			});
		} else if (current.type == "comment" && current.parent_fb_id) {
			this.loadPostInfo();
		} else if (current.type == "inbox") {
			let pageInfo = {message: " "};
			this.setState({ postInfo: pageInfo });
		}
	},
	componentWillUpdate: function () {
		let list = ReactDOM.findDOMNode(this.refs.chat_area);
		lastScrollPosition = list.scrollHeight - list.scrollTop;
	},
	componentDidUpdate: function (prevProp, prevState) {
		let list = ReactDOM.findDOMNode(this.refs.chat_area);
		list.scrollTop = list.scrollHeight - lastScrollPosition;
		if (!this.state.postInfo && list.clientHeight + 12 > list.scrollHeight) {
			this.loadMoreMessages();
		}
		if (this.props.currentConversation.children && this.props.currentConversation.children.length != lastLength) {
			if (lastLength != 0)	list.scrollTop = list.scrollHeight - lastScrollPosition - 51;
			lastLength = this.props.currentConversation.children.length;
		}
	},
	render: function () {
		let self = this;

		let renderConversation = () => {
			if (self.props.currentConversation && Array.isArray(self.props.currentConversation.children)) {
				let messages = self.props.currentConversation.children;
				messages = messages.sort((msg1, msg2) => {
					let t1, t2;
					if (self.props.currentConversation.type == "comment") {
						t1 = new Date(msg1.created_time);
						t2 = new Date(msg2.created_time);
					} else {
						t1 = new Date(msg1.updated_time);
						t2 = new Date(msg2.updated_time);
					}
					return t1 - t2;
				})
				let lastItem = messages[messages.length - 1];

				return messages.map(message => {
					let isSelf = message.from.id == self.props.currentConversation.page.fb_id;
					let isLast = lastItem === message;
					let type = (self.props.currentConversation.type == "comment") ? "comment" : "inbox";

					return <FmsMessageItem message={message} key={uuid()} isSelf={isSelf} isLast={isLast} type={type}
							 getChatAreaWidth={self.getChatAreaWidth} />;
				});
			}
		};
		let renderPostInfo = () => {
			if (this.state.postInfo && this.state.postInfo.message) {
				return <FmsPostInfoConversation content={this.state.postInfo} pageInfo={this.props.currentConversation.page}/>
			}
		};
		let renderTagsBar = () => {
			if (this.props.tags && this.props.tags.length > 0 && this.props.isLoading == false)
					return <FmsTagsBar tags={this.props.tags} conversation={this.props.currentConversation}
							noti={this.props.noti} updateClientTags={this.props.updateClientTags}
							alias={this.props.alias}/>
		}
		let showSpin = (this.state.showSpin == true) ? "" : " hide";
		let chatArea = (this.props.isLoading) ? " hide" : "";
		let spin = (this.props.isLoading) ? "" : " hide";
		let input = (this.props.isLoading) ? " hide" : "";

		return (
			<div className="inner-conversation-area">
				<div className="info-chat">
					<FmsInfoChat currentConversation={this.props.currentConversation} updateBlockCustomer={self.props.updateBlockCustomer}/>
				</div>
				<div className={"conversation-spin" + spin}>
					<FmsSpin size={27} />
				</div>
				<div className={"chat-area" + chatArea} ref="chat_area">
					<div className={"client-list-spin" + showSpin}>
						<FmsSpin size={27} />
					</div>
					{renderPostInfo()}
					{renderConversation()}
				</div>
				{renderTagsBar()}
				<div className={"input-message-area" + input}>
					<FmsMessageForm sendMessage={this.props.sendMessage} conversation={this.props.currentConversation}/>
				</div>
			</div>
		);
	}
});

module.exports = FmsConversationArea;
