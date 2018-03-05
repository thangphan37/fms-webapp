import React from 'react';
import FmsPageTitle from "../../commons/page-title/FmsPageTitle";
import * as ProjectApi from "../../api/ProjectApi";

class FmsSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            isEdittingName: false,
            isDeleteShop: false,
            isHandling: false
        }
    }

    onChangeName() {
        let name = this.refs.shopName.value;
        this.setState({name});
    }

    saveShopName(saved) {
        if (this.state.isHandling) return;
        if (saved) {
            this.setState({isHandling: true});
            let name = this.refs.shopName.value;
            ProjectApi.updateProject(this.props.project._id, name)
                .then(() => {
                    this.setState({isHandling: false, name: name, isEdittingName: false});
                    alert("Đổi tên cửa hàng thành công.");
                    window.location = "/";
                }, err => {
                    alert(err.message);
                    this.setState({name: (this.props.project) ? this.props.project.alias : "", isHandling: false, isEdittingName: false});
                });
        } else {
            this.setState({name: (this.props.project) ? this.props.project.alias : "", isEdittingName: false});
        }
    }

    deleteShop(deleted) {
        if (this.state.isHandling) return;
        if (deleted) {
            alert("Deleted!!!");
        }
        this.setState({isDeleteShop: false});
    }

    render() {
        if (!this.props.project) return <div/>;
        let alias = (this.props.project) ? this.props.project.alias : null;
        let route = (alias) ? `${alias}/Cài đặt chung` : "";

        let shopName = typeof(this.state.name) === "string" ? this.state.name : (alias || "");
        return (
            <div>
                <FmsPageTitle title="Cài đặt chung" route={route}/>
                <div className="wrapper wrapper-content">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="form-group" style={{width: "400px"}}>
                                <label className="control-label shop-name">
                                    <span>Tên cửa hàng:</span>
                                    {this.state.isEdittingName ?
                                        null
                                        :
                                        <div className="clickable" onClick={() => {
                                            this.setState({isEdittingName: true});
                                        }}>Sửa</div>
                                    }
                                </label>
                                <input type="text" className="form-control" value={shopName} ref="shopName"
                                       onChange={this.onChangeName.bind(this)}
                                       disabled={!this.state.isEdittingName}/>
                                {this.state.isEdittingName ?
                                    <div>
                                        <button className="btn btn-default shop-name-option"
                                                onClick={() => {
                                                    this.saveShopName(false)
                                                }}
                                                disabled={this.state.isHandling}>Hủy
                                        </button>
                                        <button className="btn btn-primary shop-name-option"
                                                onClick={() => {
                                                    this.saveShopName(true)
                                                }}
                                                disabled={this.state.isHandling}>Lưu
                                        </button>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <br/>
                            <div className="form-group" style={{width: "400px"}}>
                                <label className="control-label shop-name">
                                    <span>Xóa cửa hàng:</span>
                                    {this.state.isDeleteShop ?
                                        null
                                        :
                                        <div className="clickable" onClick={() => {
                                            this.setState({isDeleteShop: true});
                                        }}>Xóa</div>
                                    }
                                </label>
                                {this.state.isDeleteShop ?
                                    <div>
                                        <div>Hành động không thể khôi phục. Bạn có chắc?</div>
                                        <button className="btn btn-default shop-name-option"
                                                onClick={() => {
                                                    this.deleteShop(false)
                                                }}>Hủy
                                        </button>
                                        <button className="btn btn-danger shop-name-option"
                                                onClick={() => {
                                                    this.deleteShop(true)
                                                }}>Xóa
                                        </button>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                        <div className="col-sm-4"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default FmsSettings;