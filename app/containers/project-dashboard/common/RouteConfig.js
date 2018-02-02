import React from 'react';
import FmsDashboard from '../../dashboard/FmsDashboard/FmsDashboard';
import FmsPosts from '../../posts/FmsPosts/FmsPosts';
import FmsAllOrders from "../../orders/FmsAllOrders";
import {flatStructure} from "../../../utils/data-structure-utils";
import FmsSavedOrders from "../../orders/FmsSavedOrders";
import FmsTagOrders from "../../orders/FmsOrderTags";
import FmsColorCards from "../../cards/FmsColorCards/FmsColorCards";
import FmsProducts from "../../stock/FmsProducts";
import FmsStatistic from "../../statistic/FmsStatistic";
import FmsExportOrders from "../../stock/FmsExportOrders";
import FmsTransportOrders from "../../transport/FmsTransportOrders";
import FmsTransporting from "../../transport/FmsTransporting";
import FmsSetting from '../../settings/FmsSettings';
import FmsStaffs from '../../staff/FmsStaffs';
import FmsAddRole from '../../staff/FmsAddRole';

const treeConfig = [
    {
        route: 'dashboard',
        title: 'Bảng điều khiển',
        icon: 'fa-th-large',
        headerColor: 'white',
        component: (props) => <FmsStatistic {...props}/>
    },
    {
        route: '#',
        title: 'Quản lí trang',
        icon: 'fa-flag',
        children: [
            {
                route: 'conversations',
                title: 'Cuộc hội thoại',
                headerColor: '#f3f3f4',
                hasBorderBottom: true,
                component: (props) => <FmsDashboard {...props}/>
            },
            {
                route: 'posts',
                title: 'Bài viết',
                headerColor: '#f3f3f4',
                hasBorderBottom: false,
                component: (props) => <FmsPosts {...props}/>
            },
            {
                route: 'conversation-tags',
                title: 'Thẻ màu',
                headerColor: '#f3f3f4',
                component: (props) => {
                    return <FmsColorCards {...props}/>
                }
            },
            {
                route: 'conversation-settings',
                title: 'Cài đặt',
                headerColor: '#f3f3f4',
                component: (props) => {
                    return <FmsSetting {...props}/>
                }
            }
        ]
    },
    {
        route: '#',
        title: 'Quản lí đơn hàng',
        icon: 'fa-files-o',
        children: [
            {
                route: 'orders',
                title: 'Tất cả đơn hàng',
                headerColor: '#f3f3f4',
                component: (props) => <FmsAllOrders {...props}/>
            },
            {
                route: 'saved-orders',
                title: 'Lưu trữ đơn',
                headerColor: '#f3f3f4',
                component: (props) => <FmsSavedOrders {...props}/>
            },
            {
                route: 'order-tags',
                title: 'Thẻ màu',
                headerColor: '#f3f3f4',
                component: (props) => <FmsTagOrders {...props}/>
            }
        ]
    },
    {
        route: '#',
        title: 'Quản lí kho',
        icon: 'fa-cubes',
        children: [
            {
                route: 'export-order',
                title: 'Yêu cầu xuất hàng',
                headerColor: '#f3f3f4',
                component: (props) => <FmsExportOrders {...props}/>
            },
            {
                route: 'products',
                title: 'Sản phẩm',
                headerColor: '#f3f3f4',
                component: (props) => <FmsProducts {...props}/>
            }
        ]
    },
    {
        route: '#',
        title: 'Quản lí vận chuyển',
        icon: 'fa-truck',
        children: [
            {
                route: 'transport-orders',
                title: 'Yêu cầu vận chuyển',
                headerColor: '#f3f3f4',
                component: (props) => <FmsTransportOrders {...props} />
            },
            {
                route: 'transporting-orders',
                title: 'Đang vận chuyển',
                headerColor: '#f3f3f4',
                component: (props) => <FmsTransporting {...props}/>
            },
            {
                route: 'waiting-orders',
                title: 'Hàng chờ hoàn lại',
                headerColor: '#f3f3f4',
                component: () => {
                    return <p>Hàng chờ hoàn lại</p>
                }
            },
            {
                route: 'pay-cod-orders',
                title: 'Thanh toán COD',
                headerColor: '#f3f3f4',
                component: () => {
                    return <p>Thanh toán COD</p>
                }
            }
        ]
    },
    {
        route: '#',
        title: 'Quản lí nhân viên',
        icon: 'fa-users',
        children: [
            {
                route: 'staffs',
                title: 'Tất cả nhân viên',
                headerColor: '#f3f3f4',
                component: (props) => <FmsStaffs {...props}/>
            },
            {
                route: 'add-role',
                title: 'Thêm vai trò',
                headerColor: '#f3f3f4',
                component: (props) => <FmsAddRole {...props}/>
            }
        ]
    },

];

export default treeConfig;

export const flatConfig = flatStructure(treeConfig);