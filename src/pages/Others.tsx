import React from 'react';
import { Settings, Database, Shield, Bell, Mail, FileText, BarChart3, Users } from 'lucide-react';

const Others: React.FC = () => {
  const otherFeatures = [
    {
      icon: Database,
      title: 'Database Management',
      description: 'Manage database backups, migrations, and optimization',
      color: 'bg-blue-50 text-blue-600',
      actions: ['Backup Database', 'View Logs', 'Optimize Tables']
    },
    {
      icon: Shield,
      title: 'Security Settings',
      description: 'Configure security policies and access controls',
      color: 'bg-red-50 text-red-600',
      actions: ['Two-Factor Auth', 'IP Whitelist', 'Session Management']
    },
    {
      icon: Bell,
      title: 'Notification Center',
      description: 'Manage system notifications and alerts',
      color: 'bg-yellow-50 text-yellow-600',
      actions: ['Email Alerts', 'SMS Notifications', 'Push Notifications']
    },
    {
      icon: Mail,
      title: 'Email Templates',
      description: 'Create and manage email templates',
      color: 'bg-green-50 text-green-600',
      actions: ['Welcome Email', 'Password Reset', 'Transaction Alerts']
    },
    {
      icon: FileText,
      title: 'System Logs',
      description: 'View and analyze system activity logs',
      color: 'bg-purple-50 text-purple-600',
      actions: ['Error Logs', 'Access Logs', 'Transaction Logs']
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Advanced analytics and reporting tools',
      color: 'bg-indigo-50 text-indigo-600',
      actions: ['User Analytics', 'Revenue Reports', 'Performance Metrics']
    },
    {
      icon: Users,
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      color: 'bg-pink-50 text-pink-600',
      actions: ['Create Roles', 'Assign Permissions', 'Role Hierarchy']
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Configure system-wide settings and preferences',
      color: 'bg-gray-50 text-gray-600',
      actions: ['General Settings', 'API Configuration', 'Cache Management']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Other Features</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {otherFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200 hover:border-gray-300 transition-colors duration-150"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150">
            <Database className="h-5 w-5 mr-2" />
            Backup System
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150">
            <Shield className="h-5 w-5 mr-2" />
            Security Scan
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150">
            <BarChart3 className="h-5 w-5 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Database</p>
            <p className="text-xs text-green-600">Online</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">API Server</p>
            <p className="text-xs text-green-600">Online</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Email Service</p>
            <p className="text-xs text-yellow-600">Warning</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Storage</p>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Others;