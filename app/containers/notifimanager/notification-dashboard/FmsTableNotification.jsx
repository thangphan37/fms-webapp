import React, {Component} from 'react';
import {getNotifications} from "../../../api/NotificationsApi";
import {connect} from "react-redux";
import FmsNotificationItem from "./FmsNotificationItem";
import {Route, Router} from "react-router-dom";

class FmsTableNotification extends Component {
    state = {
        notifications: []
    };

    componentDidMount() {
        setTimeout(() => {
            this.getNotification();
        }, 100)
    }

    async getNotification() {
        const {_id} = this.props.user;
        let data;

        try {
            data = await getNotifications(_id, 'BASE');
        } catch (err) {
            aler(err.message)
        }

        this.setState({
            notifications: data.reverse()
        })
    }

    render() {
        const {notifications} = this.state;

        return (
            <div>
                <div style={{height: "48px", borderBottom: "solid 1px #F3F3F4"}}>
                    <button className="back-dashboard link-noti">
                        <i className="fa fa-reply-all"/>
                    </button>
                    <button className="archive-noti link-noti" style={{marginLeft: "4px"}}>
                        <i className="fa fa-refresh"/>
                    </button>
                </div>
                <table className="table table-mail table-hover">
                    <tbody>
                    {notifications.map((noti, i) => {
                        return (
                            <FmsNotificationItem noti={noti} key={i}/>
                        )

                    })}

                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
};

const TableNotification = connect(mapStateToProps)(FmsTableNotification)

export default TableNotification;