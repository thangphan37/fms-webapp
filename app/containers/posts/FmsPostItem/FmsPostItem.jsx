import React from 'react';
import $ from 'jquery';
import FmsCroppedImage from '../../../commons/FmsCroppedImage/FmsCroppedImage';
import FmsScrollableDiv from '../../../commons/scroll-bar/FmsScrollableDiv';
import FmsDate from '../../../helpers/FmsDate';
import {noti} from "../../notification/NotificationService";

class FmsPostItem extends React.Component {
    onToggleChange(hide_phone) {
        this.props.onToggleChange(this.props.data._id, hide_phone);
    }

    componentDidMount() {
        const parse_message = twemoji.parse(this.props.data.message);
        const message = $.parseHTML(parse_message);
        $("#content").replaceWith(message)
    }

    getCreatedTime() {
        let date = new FmsDate(this.props.data.created_time);
        return date.getTimePostItem();
    }

    navigateToNewTab(fb_id) {
        window.open('https://facebook.com/' + fb_id);
    }

    copyToClipboard(text) {
        let textarea = document.createElement('textarea');
        textarea.id = 't';
        textarea.style.height = "0";
        textarea.style.width = "0";
        document.body.appendChild(textarea);
        textarea.value = text;
        document.querySelector('#t').select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        noti("success", "Đã sao chép " + text);
    }

    renderImgs() {
        let {attachments} = this.props.data;
        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            if (Array.isArray(attachments[0].data)) {
                return attachments[0].data.map((a, i) => {
                    return <FmsCroppedImage className="image" key={i} src={a.preview || a.src}/>;
                });
            }
        }
    }

    render() {
        let {page, message, hide_comment, fb_id, hide_phone} = this.props.data;
        let avaUrl = `https://graph.facebook.com/v2.10/${page.fb_id}/picture`;
        let pageFb = `https://facebook.com/${page.fb_id}`;
        let attachments = (this.props.data.attachments) ? "" : " hide";

        return (
            <div className="post-item">
                <div className="page-info">
                    <div className="avatar-wrapper">
                        <a href={pageFb} target="_blank">
                            <img className="avatar" src={avaUrl}/>
                        </a>
                    </div>
                    <div className="post-info">
                        <div className="page-name">{page.name}</div>
                        <div className="created-time">{this.getCreatedTime()}</div>
                    </div>
                </div>
                <FmsScrollableDiv className="content-wrapper">
                    <div className="list-content">
                        <p id="content"></p>
                    </div>
                    <div className={"image-wrapper" + attachments}>
                        {this.renderImgs()}
                    </div>
                </FmsScrollableDiv>
                <div className="dropdown">
                    <i className="glyphicon glyphicon-option-vertical clickable dropdown-toggle"
                       data-toggle="dropdown"/>
                    <ul className="dropdown-menu">
                        <li className="clickable"
                            onClick={() => this.navigateToNewTab(fb_id)}>
                            <a>
                                Đi tới bài đăng trên facebook
                            </a>
                        </li>
                        <li className="clickable"
                            onClick={() => this.copyToClipboard(fb_id)}>
                            <a>
                                Sao chép id bài viết
                            </a>
                        </li>
                        <li className='divider'/>
                        <li className="clickable" onClick={() => {
                            this.onToggleChange(false)
                        }}>
                            <span>Ẩn tất cả bình luận</span>
                            {hide_comment ?
                                <i className="glyphicon glyphicon-ok"/> :
                                null
                            }
                        </li>
                        <li className="clickable"
                            onClick={() => {
                                this.onToggleChange(true)
                            }}
                        >
                            <span>Ẩn bình luận có số điện thoại</span>
                            {hide_phone ?
                                <i className="glyphicon glyphicon-ok"/> :
                                null
                            }
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = FmsPostItem;
