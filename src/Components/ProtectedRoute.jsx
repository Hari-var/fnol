import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ContactAdministrator from './ContactAdministrator';

const ProtectedRoute = ({ children, login, user }) => {
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_id) {
      setLoading(true);
      fetch(`https://90175f0f47e6.ngrok-free.app/users/user_details/${user.user_id}`)
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