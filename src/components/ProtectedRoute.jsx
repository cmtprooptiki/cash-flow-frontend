import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

// Wraps a route element. With no allowedRoles, any logged-in user may view it.
// With allowedRoles, only users whose role is in the list may view it.
const ProtectedRoute = ({ allowedRoles, children }) => {
    const dispatch = useDispatch();
    const { user, isError } = useSelector((state) => state.auth);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        dispatch(getMe()).finally(() => setChecked(true));
    }, [dispatch]);

    if (!checked) {
        return null;
    }

    if (!user || isError) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/erga" replace />;
    }

    return children;
};

export default ProtectedRoute;
