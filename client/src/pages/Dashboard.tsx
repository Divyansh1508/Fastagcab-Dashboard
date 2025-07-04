import React from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import MetricCard from '../components/MetricCard';
import { TrendingUp, ShoppingCart, Gift, ShoppingBag } from 'lucide-react';

const Dashboard: React.FC = () => {
 const giftStatusData = [
    { name: 'Pending', value: 100 },
    { name: 'Processing', value: 10 },
    { name: 'Dispatch', value: 5 },
    { name: 'Completed', value: 2 },
  ];

  const paymentData = [
    { name: 'Total Complete', value: 0.8 },
    { name: 'Total Failed', value: -0.2 },
    { name: 'Total Pending', value: 0.4 },
  ];

  const usersData = [
    { name: 'Promoter', value: 450 },
    { name: 'Retailer', value: 50 },
    { name: 'Dealer', value: 25 },
    { name: 'Distributor', value: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Redeem PTS"
          value="0"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Redeem Amt"
          value="0"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Gift Redeem"
          value="0"
          icon={Gift}
          color="blue"
        />
        <StatCard
          title="Total Purchase"
          value="0"
          icon={ShoppingBag}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Gift Status"
          data={giftStatusData}
          type="bar"
          colors={['#EF4444', '#F59E0B', '#10B981', '#3B82F6']}
        />
        <ChartCard
          title="Payment"
          data={paymentData}
          type="bar"
          colors={['#10B981', '#EF4444', '#F59E0B']}
        />
        <ChartCard
          title="Users"
          data={usersData}
          type="bar"
          colors={['#FBBF24', '#EF4444', '#3B82F6', '#10B981']}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Gift" value="0" color="blue" />
        <MetricCard title="Total Gift In Inventory" value="0" color="green" />
        <MetricCard title="Total Gift Low Inventory" value="0" color="orange" />
        <MetricCard title="Total Gift Nil Inventory" value="0" color="red" />
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value="0" color="red" />
        <MetricCard title="Total Verify Users" value="0" color="green" />
        <MetricCard title="Total Un-Verify Users" value="0" color="red" />
        <MetricCard title="Total Executive" value="0" color="blue" />
      </div>
    </div>
  );
};

export default Dashboard;