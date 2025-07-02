import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'orange' | 'red';
}

const colorClasses = {
  blue: 'border-blue-500 text-blue-600',
  green: 'border-green-500 text-green-600',
  orange: 'border-orange-500 text-orange-600',
  red: 'border-red-500 text-red-600',
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-4 ${colorClasses[color]} mb-3`}>
          <span className="text-2xl font-bold">{value}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;