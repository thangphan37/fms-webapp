import React, {Component} from "react";

import ic_viettel from 'images/ic_viettel.png';
import FmsOrderDetailModal from "../modals/FmsOrderDetailModal";

class FmsNewOrderTable extends Component {

    state = {
        selectedOrder: null,
        isShownModal: false
    };

    onCloseModal (updatedOrder) {
        this.setState({isShownModal: false});
    }

    openModal (order) {
        this.setState({
            selectedOrder: order,
            isShownModal: true,
        })
    }

    renderProductIdItem(products) {
        return (
            <td>
                {
                    products.map(
                        (product, i) => [
                            <span key={1}>{product.id}</span>,
                            <br key={2}/>
                        ]
                    )
                }
            </td>
        )
    }

    renderTableRows() {
        const {orders} = this.props;

        return orders.map(
            (order, i) => (
                <tr key={i}>
                    <td>{i}</td>
                    <td><a>
                        <span
                            className="badge badge-info"
                            onClick={() => {this.openModal(order)}}
                        >{order.id}</span>
                    </a></td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td><img src={ic_viettel}/></td>

                    {
                        this.renderProductIdItem(order.products)
                    }

                    <td>{order.private_note}</td>
                    <td>14:53 <br/> 29-11</td>
                    <td className="color-tag">
                        {/*<span className="label label-green tag-label">{order.order_tag.name}</span>*/}
                    </td>
                </tr>
            )
        );
    }

    renderTableBody() {
        return (
            <tbody>
            {
                this.renderTableRows()
            }
            </tbody>
        )
    }

    renderTableHeader() {
        return (
            <thead>
            <tr>
                <th>STT</th>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Điện thoại</th>
                <th>Nhà mạng</th>
                <th>Sản phẩm</th>
                <th>Ghi chú</th>
                <th>Ngày tạo</th>
                <th>Đánh dấu</th>
            </tr>
            </thead>
        )
    }

    render() {
        const {isShownModal, selectedOrder} = this.state;
        const {project} = this.props;

        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    {
                        this.renderTableHeader()
                    }

                    {
                        this.renderTableBody()
                    }
                </table>

                <FmsOrderDetailModal
                    isShown={isShownModal}
                    onClose={this.onCloseModal.bind(this)}
                    order={selectedOrder}
                    project={project}
                />
            </div>
        )
    }


}

export default FmsNewOrderTable;