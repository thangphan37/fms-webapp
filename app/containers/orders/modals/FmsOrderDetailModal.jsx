import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import propTypes from 'prop-types';
import FmsCheckbox from 'commons/FmsCheckbox/FmsCheckbox';
import {deleteOrder, exportOrder, updateOrder} from "../../../api/OrderApi";
import {cloneDiff} from "../../../utils/object-utils";
import {getOrderTags} from "../../../api/OrderTagApi";
import {toReadablePrice} from "../../../utils/price-utils";

class FmsOrderDetailModal extends Component {

    state = {
        order: {},
        orderTags: [],
        isLoading: false
    };

    updateOrder() {
        const {project} = this.props;
        const diffOrder = cloneDiff({...this.props.order}, {...this.state.order});
        diffOrder._id = this.props.order._id;

        // if has no different => do nothing
        if (Object.keys(diffOrder).length === 1) {
            console.log('order has no different');
            this.props.onClose();
            return;
        }

        console.log('order diff', diffOrder);

        this.setState({isLoading: true});

        updateOrder(project.alias, diffOrder)
            .then(order => {
                this.props.onClose(order);
            })
            .catch(err => {
                alert(err.message);
                this.setState({isLoading: false})
            })
    }

    exportOrder() {
        const allowExport = confirm('Bạn có chắc chắn muốn xuất đơn hàng này?');
        if (!allowExport) return;

        const {project} = this.props;
        const diffOrder = cloneDiff({...this.props.order}, {...this.state.order});
        diffOrder._id = this.props.order._id;

        console.log('order diff', diffOrder);

        this.setState({isLoading: true});

        exportOrder(project.alias, diffOrder)
            .then(order => {
                this.props.onClose(order);
            })
            .catch(err => {
                alert(err.message);
                this.setState({isLoading: false})
            })
    }

    onDeleteOrder() {
        const allowDelete = confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');
        if (!allowDelete) return;

        const {project} = this.props;
        this.setState({isLoading: true});

        deleteOrder(project.alias, this.state.order)
            .then(
                () => {
                    const shouldUpdated = true;
                    this.props.onClose(shouldUpdated);
                },
                err => {
                    alert(err.message);
                }
            )
            .then(() => this.setState({isLoading: false}));
    }

    calculateProductsPrice() {
        const {order} = this.state;
        if (order && Array.isArray(order.products)) {
            return order.products.reduce((totalPrice, product) => {
                return totalPrice + (product.price * product.quantity - product.discount);
            }, 0)
        } else {
            return 0;
        }
    }

    calculateTotalPrice() {
        const {order} = this.state;
        if (order) {
            const transport_fee = order.transport_fee || 0;
            const productsFee = this.calculateProductsPrice();

            return parseInt(transport_fee) + productsFee;
        } else {
            return 0;
        }
    }

    onCloseButtonClick() {
        this.props.onClose();
    }

    onChangeInput(refName, newValue = this.refs[refName].value) {
        const newOrder = {...this.state.order};

        switch (refName) {
            case 'order_tag':
                newOrder.order_tag = newValue;
                break;
            case 'is_pay':
                newOrder.is_pay = newValue;
                break;
            default:
                newOrder[refName] = newValue;
        }

        this.setState({order: newOrder});
    }

    updateOrderTags(project) {
        getOrderTags(project.alias)
            .then(
                orderTags => {
                    const noneTag = {_id: 'none', name: ''};
                    orderTags.unshift(noneTag);
                    this.setState({orderTags});
                },
                err => {
                    alert(err.message)
                }
            )
            .catch(err => alert(err.message));
    }

    componentDidMount() {
        const {order, project} = this.props;
        this.setState({order});

        if (project) {
            this.updateOrderTags(project);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.order) {
            this.setState({order: nextProps.order, isLoading: false});
        }

        if (nextProps.project !== this.props.project) {
            this.updateOrderTags(nextProps.project);
        }
    }

    renderProducts() {
        const {order} = this.state;

        if (Array.isArray(order.products)) {
            return order.products.map(
                (product, i) => (
                    <tr key={i}>
                        <td>{i}</td>
                        <td><a><span className="badge badge-info">{product.id}</span></a></td>
                        <td>{product.name}</td>
                        <td>{toReadablePrice(product.quantity)}</td>
                        <td>{toReadablePrice(product.price)}</td>
                        <td>{toReadablePrice(product.discount)}</td>
                        <td>{toReadablePrice(product.price * product.quantity - product.discount)}</td>
                        <td><i className="fa fa-trash-o clickable"/></td>
                        <td><i className="fa fa-pencil clickable"/></td>
                    </tr>
                )
            )
        } else {
            return null;
        }
    }

    renderModalBody() {
        const {order, orderTags} = this.state;

        return (
            <Modal.Body>

                <div className="row">

                    <div className="col-sm-12">

                        <div className="form-group row">
                            <div className="col-sm-3">
                                <label className="control-label">Ghi chú nội bộ</label>
                            </div>
                            <div className="col-sm-9">
                                <input className="form-control"
                                       type='text'
                                       ref='private_note'
                                       value={order.private_note || ''}
                                       onChange={() => {
                                           this.onChangeInput('private_note')
                                       }}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-3">
                                <label className="control-label">Đánh dấu</label>
                            </div>
                            <div className="col-sm-9 color-tag">
                                <select className="form-control"
                                        ref='order_tag'
                                        value={
                                            ((order) => {
                                                if (typeof order.order_tag === 'string') {
                                                    return order.order_tag;
                                                } else if (order.order_tag) {
                                                    return order.order_tag._id;
                                                } else {
                                                    return '';
                                                }
                                            })(order)
                                        }
                                        onChange={() => {
                                            this.onChangeInput('order_tag')
                                        }}
                                >
                                    {
                                        orderTags.map(
                                            (tag, i) => (
                                                <option key={i} value={tag._id}>{tag.name}</option>
                                            )
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                Thông tin khách hàng
                            </div>
                            <div className="panel-body">
                                <div className="form-group row">
                                    <div className="col-sm-3">
                                        <label className="control-label">Tên</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <input type="text"
                                               className="form-control"
                                               ref='customer_name'
                                               value={order.customer_name || ''}
                                               onChange={() => {
                                                   this.onChangeInput('customer_name')
                                               }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-3">
                                        <label className="control-label">Điện thoại</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <input type="text"
                                               className="form-control"
                                               ref='customer_phone'
                                               value={order.customer_phone || ''}
                                               onChange={() => {
                                                   this.onChangeInput('customer_phone')
                                               }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-3">
                                        <label className="control-label">Facebook</label>
                                    </div>
                                    <div className="col-sm-9">
                                        <input type="text"
                                               className="form-control"
                                               ref='customer_facebook'
                                               value={order.customer_facebook || ''}
                                               onChange={() => {
                                                   this.onChangeInput('customer_facebook')
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="panel panel-success">
                            <div className="panel-heading">
                                Thông tin vận chuyển
                            </div>
                            <div className="panel-body">
                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <label className="control-label">Địa chỉ nhận</label>
                                    </div>
                                    <div className="col-sm-8">
                                        <input type="text"
                                               className="form-control"
                                               ref='transport_address'
                                               value={order.transport_address || ''}
                                               onChange={() => {
                                                   this.onChangeInput('transport_address')
                                               }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <label className="control-label">Phương thức</label>
                                    </div>
                                    <div className="col-sm-8">
                                        <select className="form-control"
                                                ref='transport_method'
                                                value={order.transport_method || ''}
                                                onChange={() => {
                                                    this.onChangeInput('transport_method')
                                                }}
                                        >
                                            <option value="" defaultValue/>
                                            <option value="TONG_BUU_DIEN">Tổng bưu điện</option>
                                            <option value="VIETTEL_POST">Viettel Post</option>
                                            <option value="EMS">EMS</option>
                                            <option value="SHOPEE">Shopee</option>
                                            <option value="SELF">Tự vận chuyển</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <label className="control-label">Phí</label>
                                    </div>
                                    <div className="col-sm-8">
                                        <input type="text"
                                               className="form-control"
                                               ref='transport_fee'
                                               value={order.transport_fee || ''}
                                               onChange={() => {
                                                   this.onChangeInput('transport_fee')
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-12">
                        <div className="panel panel-success">
                            <div className="panel-heading">
                                Thông tin sản phẩm
                            </div>

                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="ibox none-margin-bottom">
                                            <div className="">
                                                <div className="row">
                                                    <div className="col-sm-9">
                                                        <div className="form-group">
                                                            <input type="text"
                                                                   value=""
                                                                   placeholder="Tìm và thêm sản phẩm"
                                                                   className="form-control"/>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="form-group">
                                                            <button className="btn btn-primary full-width"
                                                            >Thêm sản phẩm
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table table-striped">

                                                        <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Mã sản phẩm</th>
                                                            <th>Tên sản phẩm</th>
                                                            <th>Số lượng</th>
                                                            <th>Giá</th>
                                                            <th>Giảm giá</th>
                                                            <th>Tổng</th>
                                                        </tr>
                                                        </thead>

                                                        <tbody>

                                                        {
                                                            this.renderProducts()
                                                        }


                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='row total-price-row'>
                        <div className="col-sm-10">
                            <span className="pull-right">Tổng tiền sản phẩm</span>
                        </div>
                        <div className="col-sm-2">
                            <label className='pull-right'>{toReadablePrice(this.calculateProductsPrice())}</label>
                        </div>
                    </div>

                    <div className="row total-price-row">
                        <div className="col-sm-10">
                            <span className="pull-right">Phí vận chuyển</span>
                        </div>
                        <div className="col-sm-2">
                            <label className='pull-right'>{toReadablePrice(order.transport_fee || 0)}</label>
                        </div>
                    </div>

                    <div className="row total-price-row">
                        <div className="col-sm-10">
                            <span className="pull-right">Tổng cộng</span>
                        </div>
                        <div className="col-sm-2">
                            <label className='pull-right'>{toReadablePrice(this.calculateTotalPrice())}</label>
                        </div>
                    </div>

                    <div className="row total-price-row">
                        <div className="col-sm-10 total-item">
                            <span className="pull-right">Đã thanh toán</span>
                        </div>
                        <div className="col-sm-2">
                            <FmsCheckbox className='pull-right'
                                         ref='is_pay'
                                         checked={order.is_pay}
                                         onChange={(value) => {
                                             this.onChangeInput('is_pay', value)
                                         }}
                            />
                        </div>
                    </div>


                </div>

            </Modal.Body>
        )
    }

    render() {
        const {
            isShown
        } = this.props;

        const {
            order,
            isLoading
        } = this.state;

        if (!order) {
            return null;
        }

        return (
            <Modal show={isShown} bsSize="large" backdrop='static' keyboard={false}>
                <div className='order-detail-modal inmodal'>
                    <Modal.Header
                        closeButton={true}
                        onHide={() => {
                            this.props.onClose();
                        }}
                    >
                        <h4>Đơn hàng #{order.id}</h4>

                        <div>
                            <small className="font-bold">Ngày tạo: <strong>12:49, 24-12-2017</strong></small>
                        </div>
                        <div>
                            <small className="font-bold">Nguồn đơn: <a>fb.com/my-shop/posts/4128912312412</a></small>
                        </div>

                    </Modal.Header>

                    {
                        this.renderModalBody()
                    }

                    <Modal.Footer>
                        <button className="btn btn-danger btn-outline pull-left"
                                onClick={this.onDeleteOrder.bind(this)}
                                disabled={isLoading}>Xóa
                        </button>

                        <button className="btn btn-white"
                                onClick={this.onCloseButtonClick.bind(this)}
                                disabled={isLoading}>Hủy
                        </button>

                        <button className="btn btn-success"
                                onClick={() => this.exportOrder()}
                                disabled={isLoading}>Yêu cầu xuất
                        </button>

                        <button className="btn btn-primary"
                                onClick={() => this.updateOrder()}
                                disabled={isLoading}>Cập nhật
                        </button>
                    </Modal.Footer>

                </div>
            </Modal>
        );
    }
}

FmsOrderDetailModal.propTypes = {
    isShown: propTypes.bool.isRequired,
    onClose: propTypes.func.isRequired
};

export default FmsOrderDetailModal;
