import React from 'react';
import useAuthStore from '../store/authStore';
import SenderRouteWorkspace from './SenderRouteWorkspace';
import DriverRouteWorkspace from './DriverRouteWorkspace';
import CollectorWorkspace from './CollectorWorkspace';

const Dashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === 'driver') {
    return <DriverRouteWorkspace />;
  }

  if (user?.role === 'collector') {
    return <CollectorWorkspace />;
  }

  return <SenderRouteWorkspace />;
};

export default Dashboard;
