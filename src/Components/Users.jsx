import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaChevronLeft, FaChevronRight, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import '../styles/users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUserType, setNewUserType] = useState('');

  const [newUserStatus, setNewUserStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://81a531d55958.ngrok-free.app/users/user_details', {
        withCredentials: true
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleEditRole = (user) => {
    console.log('User object:', user); // Debug log
    setEditingUser(user);
    setNewUserType(user.role || user.usertype || 'user');
    setNewUserStatus(user.status || 'active');
  };

  const handleUpdateRole = async () => {
    try {
      await axios.put(
        `https://81a531d55958.ngrok-free.app/users/update_user_admin?user_id=${editingUser.user_id}`,
        { 
          usertype: newUserType,
          status: newUserStatus
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      
      // Update local state
      setUsers(users.map(user => 
        user.user_id === editingUser.user_id 
          ? { ...user, role: newUserType, usertype: newUserType, status: newUserStatus }
          : user
      ));
      
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user');
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(
        `https://81a531d55958.ngrok-free.app/users/update_user_admin?user_id=${user.user_id}`,
        { 
          usertype: user.role || user.usertype || 'user',
          status: newStatus
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      
      // Update local state
      setUsers(users.map(u => 
        u.user_id === user.user_id 
          ? { ...u, status: newStatus }
          : u
      ));
      
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };



  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Users Management</h2>
        <div className="controls-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="limit-container">
            <label>Show:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="limit-select">
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.user_id}>
                <td className="id-cell">{user.user_id}</td>
                <td className="username-cell" title={user.username}>{user.username}</td>
                <td className="name-cell" title={[user.firstname, user.middlename, user.lastname].filter(Boolean).join(' ')}>
                  {[user.firstname, user.middlename, user.lastname]
                    .filter(Boolean)
                    .join(' ')}
                </td>
                <td className="email-cell" title={user.email}>{user.email}</td>
                <td className="phone-cell">{user.phone || 'N/A'}</td>
                <td className="date-cell">
                  {user.dateofbirth ? new Date(user.dateofbirth).toLocaleDateString() : 'N/A'}
                </td>
                <td className="role-cell">
                  <span className={`role-badge ${user.role || user.usertype || 'user'}`}>
                    {user.role || user.usertype || 'user'}
                  </span>
                </td>
                <td className="status-cell">
                  <button 
                    className={`toggle-btn ${user.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(user)}
                    title={`Toggle status (currently ${user.status || 'inactive'})`}
                  >
                    {user.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                    <span>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </button>
                </td>
                <td className="actions-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditRole(user)}
                    title="Edit User"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">No users found</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>
            <p>User: <strong>{editingUser.username}</strong></p>
            <div className="form-group">
              <label>Select Role:</label>
              <select 
                value={newUserType} 
                onChange={(e) => setNewUserType(e.target.value)}
                className="role-select"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <div className="toggle-container">
                <button 
                  className={`toggle-btn ${newUserStatus === 'active' ? 'active' : 'inactive'}`}
                  onClick={() => setNewUserStatus(newUserStatus === 'active' ? 'inactive' : 'active')}
                  type="button"
                >
                  {newUserStatus === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                  <span>{newUserStatus === 'active' ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleUpdateRole}>
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}