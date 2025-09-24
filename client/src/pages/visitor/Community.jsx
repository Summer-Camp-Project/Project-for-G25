import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaUsers, 
  FaComments, 
  FaTrophy, 
  FaUserFriends,
  FaShare,
  FaStar,
  FaFire,
  FaGlobe
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeDiscussions: 0,
    studyGroups: 0,
    onlineUsers: 0
  });

  useEffect(() => {
    // Simulate loading community stats
    const timer = setTimeout(() => {
      setStats({
        totalMembers: 1247,
        activeDiscussions: 89,
        studyGroups: 23,
        onlineUsers: 156
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const communityFeatures = [
    {
      title: 'Discussion Forums',
      description: 'Join conversations about Ethiopian heritage and culture',
      icon: FaComments,
      path: '/visitor/forums',
      color: 'bg-blue-500',
      stats: '89 active topics'
    },
    {
      title: 'Study Groups',
      description: 'Collaborate with fellow learners in focused study sessions',
      icon: FaUsers,
      path: '/visitor/groups',
      color: 'bg-green-500',
      stats: '23 active groups'
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank among heritage enthusiasts',
      icon: FaTrophy,
      path: '/visitor/leaderboard',
      color: 'bg-yellow-500',
      stats: 'Top contributors'
    },
    {
      title: 'Share Progress',
      description: 'Share your learning milestones and achievements',
      icon: FaShare,
      path: '/visitor/share',
      color: 'bg-purple-500',
      stats: 'Showcase success'
    },
    {
      title: 'Find Friends',
      description: 'Connect with other heritage enthusiasts',
      icon: FaUserFriends,
      path: '/visitor/friends',
      color: 'bg-pink-500',
      stats: '156 online now'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaGlobe className="text-indigo-600" />
                Community Hub
              </h1>
              <p className="text-gray-600 mt-2">Connect, learn, and share with fellow heritage enthusiasts</p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.onlineUsers}</div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <FaUsers className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <FaComments className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.activeDiscussions}</div>
            <div className="text-sm text-gray-600">Active Discussions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <FaUsers className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.studyGroups}</div>
            <div className="text-sm text-gray-600">Study Groups</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <FaFire className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.onlineUsers}</div>
            <div className="text-sm text-gray-600">Online Now</div>
          </div>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {communityFeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature.path)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`${feature.color} p-3 rounded-full`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <span className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Recent Community Activity
          </h2>
          
          <div className="space-y-4">
            {[
              {
                user: 'Alemayehu T.',
                action: 'started a new discussion about "Ancient Axum Architecture"',
                time: '2 hours ago',
                type: 'discussion'
              },
              {
                user: 'Sara M.',
                action: 'joined the "Ethiopian Language Study Group"',
                time: '4 hours ago',
                type: 'group'
              },
              {
                user: 'Daniel K.',
                action: 'achieved "Heritage Explorer" badge',
                time: '6 hours ago',
                type: 'achievement'
              },
              {
                user: 'Meron A.',
                action: 'shared progress on "Ethiopian History Course"',
                time: '8 hours ago',
                type: 'progress'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaUsers className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
