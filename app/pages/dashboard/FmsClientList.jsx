'use strict';

const React = require('react');

const searchImg = require('search.png');
let FmsClientItem = require('FmsClientItem');
let DashboardAPI = require('DashboardAPI');

let FmsClientList = React.createClass({
	getInitialState: function () {
		return {
			idSelectedClient: null
		}
	},
	handleClientClick: function (fb_id, type) {
		this.props.handleClientClick(fb_id, type);
		this.setState({ idSelectedClient: fb_id });
	},
	render: function () {
		let self = this;
		let renderClients = function () {
			let conversations = self.props.conversations;
			if (!conversations) return;
			return conversations.map(function (conversation) {
				let isSelected = (self.state.idSelectedClient == conversation.fb_id) ? true : false;
				return <FmsClientItem data={conversation} key={conversation.fb_id} handleClientClick={self.handleClientClick} isSelected={isSelected}/>
			});
		};
		return (
			<div>
				<div className="search-client">
					<img src={searchImg} className="search-icon"/>
					<input type="text" className="input-search-client" />
				</div>
				<div>
					{renderClients()}
				</div>
			</div>
		);
	}
});

module.exports = FmsClientList;
