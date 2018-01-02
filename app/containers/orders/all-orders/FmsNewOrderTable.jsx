import React, {Component} from "react";

import ic_viettel from 'images/ic_viettel.png';
import FmsOrderDetailModal from "../modals/FmsOrderDetailModal";

class FmsNewOrderTable extends Component {

    state = {
        isShownModal: false,
        selectedOrder: null
    };

    onCloseModal () {
        this.setState({isShownModal: false});
    }

    openModal (order) {
        this.setState({isShownModal: true, selectedOrder: order})
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
                    <td>{order.customer.name}</td>
                    <td>{order.customer.phone}</td>
                    <td><img src={ic_viettel}/></td>
                    <td>HB40123 <br/> YH40231</td>

                    {
                        this.renderProductIdItem(order.products)
                    }

                    <td>{order.private_note}</td>
                    <td>14:53 <br/> 29-11</td>
                    <td className="color-tag">
                        <span className="label label-green tag-label">{order.tag.name}</span>
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

                {
                    selectedOrder ?
                        <FmsOrderDetailModal
                            isShown={isShownModal}
                            onClose={this.onCloseModal.bind(this)}
                            order={selectedOrder}
                        /> :
                        null
                }
            </div>
        )
    }


}

export default FmsNewOrderTable;