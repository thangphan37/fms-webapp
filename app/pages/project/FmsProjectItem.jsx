const React = require('react');
const {browserHistory} = require('react-router');

const uuid = require('uuid');

let FmsProjectItem = React.createClass({
  renderPageItem: function () {
    let self = this;
    let project = this.props.data;
    let pages = project.pages;
    const MAX_ITEM = 5;

    if (pages && Array.isArray(pages) && pages.length > 0) {
      let pageComponents = pages.filter((item, index) => {
        return index <= MAX_ITEM;
      })
      .map(page => {
        let pageAva = `https://graph.facebook.com/v2.10/${page.fb_id}/picture`;

        return (
          <img key={page.fb_id} src={pageAva}></img>
        )
      });

      if (pages.length > MAX_ITEM) {
        let moreText = '+' + (pages.length - MAX_ITEM);
        let itemMorePage = <div className="more" key={uuid()}>{moreText}</div>;
        pageComponents.push(itemMorePage);
      }
      return pageComponents;
    } else {
      return <div></div>
    }
  },
  handleItemClick: function () {
    this.props.onItemClick(this.props.data);
  },
  render: function() {
    let self = this;
    let project = this.props.data;
    let projectName = project.name;

    return (
      <div className="col-md-4">
        <div className="project-item panel panel-default" onClick={self.handleItemClick}>
          <div className="panel-heading">
            <h3 className="panel-title">{projectName}</h3>
          </div>
          <div className="panel-body">
            {self.renderPageItem()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FmsProjectItem;