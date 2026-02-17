import React from 'react';
import { useDashboardCount } from "@/hooks/collegeHook";

function Dashboard() {
    const { data: dashboardCountData, isFetching: isDashboardCountFetching } = useDashboardCount();
    const stats = [
        {
            title: 'Total Users',
            value: '1,234',
            change: '+12%',
            positive: true
        },
        {
            title: 'Total Products',
            value: '567',
            change: '+8%',
            positive: true
        },
        {
            title: 'Total Orders',
            value: '890',
            change: '+23%',
            positive: true
        },
        {
            title: 'Revenue',
            value: '$45,678',
            change: '+15%',
            positive: true
        }
    ];

    const recentOrders = [
        { id: '#12345', customer: 'John Doe', amount: '$125.00', status: 'Completed' },
        { id: '#12346', customer: 'Jane Smith', amount: '$89.50', status: 'Processing' },
        { id: '#12347', customer: 'Bob Johnson', amount: '$200.00', status: 'Pending' },
        { id: '#12348', customer: 'Alice Brown', amount: '$67.25', status: 'Completed' },
        { id: '#12349', customer: 'Charlie Wilson', amount: '$145.75', status: 'Shipped' }
    ];

    const getStatusBadge = (status) => {
        const statusClasses = {
            'Completed': 'badge-success',
            'Processing': 'badge-warning',
            'Pending': 'badge-danger',
            'Shipped': 'badge-info'
        };
        return `badge ${statusClasses[status] || 'badge-info'}`;
    };



    return (
        <div>
            <div className="header">
                <h1>Dashboard</h1>
                <div className="user-info">
                    <div className="user-avatar">AD</div>
                    <span>Admin User</span>
                </div>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Colleges</h3>
                    <div className="value">{dashboardCountData?.collegeCount}</div>
                </div>
                <div className="stat-card">
                    <h3>Total Leads</h3>
                    <div className="value">{dashboardCountData?.leadCount}</div>
                </div>
            </div>

            {/* <div className="content-card">
        <h2>Recent Orders</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
        </div>
    );
}

export default Dashboard;
