import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, Eye } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  status: 'Published' | 'Draft' | 'Archived';
  views: number;
}

const NewsUpdate: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: 'New Reward Program Launched',
      content: 'We are excited to announce our new reward program with amazing benefits...',
      author: 'Admin',
      publishDate: '2024-01-15',
      status: 'Published',
      views: 1250
    },
    {
      id: 2,
      title: 'System Maintenance Notice',
      content: 'Scheduled maintenance will be performed on our systems...',
      author: 'Tech Team',
      publishDate: '2024-01-12',
      status: 'Published',
      views: 890
    },
    {
      id: 3,
      title: 'Holiday Special Offers',
      content: 'Special holiday offers are now available for all users...',
      author: 'Marketing',
      publishDate: '2024-01-10',
      status: 'Draft',
      views: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add News</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Clear Filters
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Published' 
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'Draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {item.views}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {item.content}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>By {item.author}</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {item.publishDate}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center justify-center space-x-1">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsUpdate;