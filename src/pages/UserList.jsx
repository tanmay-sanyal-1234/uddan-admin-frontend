import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

function UsersList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joined: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', joined: '2024-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active', joined: '2024-04-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Active', joined: '2024-05-12' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active', joined: '2024-06-18' },
    { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'User', status: 'Inactive', joined: '2024-07-22' },
    { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', role: 'Editor', status: 'Active', joined: '2024-08-30' },
    { id: 9, name: 'George Miller', email: 'george@example.com', role: 'User', status: 'Active', joined: '2024-09-14' },
    { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', role: 'User', status: 'Active', joined: '2024-10-25' },
    { id: 11, name: 'Ian Wright', email: 'ian@example.com', role: 'User', status: 'Inactive', joined: '2024-11-08' },
    { id: 12, name: 'Julia Roberts', email: 'julia@example.com', role: 'Editor', status: 'Active', joined: '2024-12-19' }
  ]);

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email' },
    { header: 'Role', field: 'role' },
    {
      header: 'Status',
      field: 'status',
      render: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
          {row.status}
        </span>
      )
    },
    { header: 'Joined', field: 'joined' }
  ];

  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  return (
    <div>
      <div className="header">
        <h1>College Management</h1>
        <button className="btn btn-primary" onClick={() => navigate('/college/add')}>
          Add New College
        </button>
      </div>

      <div className="content-card">
        <h2>All Users</h2>
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          pointerOnHover
          onRowClicked={handleEdit}
          />
      </div>
    </div>
  );
}

export default UsersList;
