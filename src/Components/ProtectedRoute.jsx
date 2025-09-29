import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ContactAdministrator from './ContactAdministrator';
import { path } from '../config';

const ProtectedRoute = ({ children, login, user }) => {
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_id) {
      setLoading(true);
      fetch(`${path}/users/user_details/${user.user_id}`,{
        headers: {'ngrok-skip-browser-warning': '1'}
      })
        .then(res => res.json())
        .then(data => {
          setUserStatus(data.status);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user?.user_id]);

  if (!login) {
    return <Navigate to="/login" replace />;
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (userStatus === 'inactive') {
    return <ContactAdministrator />;
  }
  
  return children;
};

export default ProtectedRoute;