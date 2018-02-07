import React from 'react';
import {connect} from 'react-redux';

import allImg from '../../../assets/images/all.png';
import postImg from '../../../assets/images/post.png';
import inboxImg from '../../../assets/images/inbox.png';

import allImgActive from '../../../assets/images/all_active.png';
import postImgActive from '../../../assets/images/post_active.png';
import inboxImgActive from '../../../assets/images/inbox_active.png';


import FmsToolTip from '../../../commons/FmsToolTip/FmsToolTip';
import {handleTypeFilterClick} from '../../../actions/dashboard/filters';

class FmsVerticalNav extends React.Component {
    handleTypeFilterClick(type) {
        this.props.dispatch(handleTypeFilterClick(this.props.alias, type));
    }

    render() {
        let inactive = [allImg, postImg, inboxImg];
        let active = [allImgActive, postImgActive, inboxImgActive];
        let className = [];
        let src = [], counter = 0;
        this.props.filters.forEach(f => {
             if (!f.isTag) {
                 if (f.isActive) {
                     src.push(active[counter]);
                     className.push(" vertical-item-active");
                 } else {
                     src.push(inactive[counter]);
                     className.push("");
                 }
                 counter++;
             }
        });
        return (
            <div ref="vertical_nav">
                <FmsToolTip message="Hiển thị tất cả" direction="right">
                    <div onClick={() => {
                        this.handleTypeFilterClick('all')
                    }}>
                        <img src={src[0]} className={"vertical-nav-item" + className[0]}/>
                    </div>
                </FmsToolTip>
                <FmsToolTip message="Bình luận" direction="right">
                    <div onClick={() => {
                        this.handleTypeFilterClick('comment')
                    }}>
                        <img src={src[1]} className={"vertical-nav-item" + className[1]}/>
                    </div>
                </FmsToolTip>
                <FmsToolTip message="Tin nhắn" direction="right">
                    <div onClick={() => {
                        this.handleTypeFilterClick('inbox')
                    }}>
                        <img src={src[2]} className={"vertical-nav-item" + className[2]}/>
                    </div>
                </FmsToolTip>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        filters: state.dashboard.filters.filters
    }
};

export default connect(mapStateToProps)(FmsVerticalNav);
