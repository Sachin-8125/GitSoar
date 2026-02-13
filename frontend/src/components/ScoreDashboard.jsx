import { useEffect, useState } from 'react';
import { TrendingUp, Award, Users, Star, GitFork, BookOpen } from 'lucide-react';

const ScoreDashboard = ({ data }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { scores, profile, stats } = data;
  const { overall, rating, dimensions } = scores;

  useEffect(() => {
    // Animate score counting
    const duration = 1500;
    const steps = 60;
    const increment = overall / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= overall) {
        setAnimatedScore(overall);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [overall]);

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-success-500';
    if (score >= 50) return 'text-warning-500';
    return 'text-danger-500';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-success-500';
    if (score >= 50) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name || profile.username}
              className="w-24 h-24 rounded-2xl border-4 border-white/30 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-2xl font-bold">{profile.name || profile.username}</h2>
            <p className="text-primary-100">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-primary-100 max-w-lg">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              {profile.location && (
                <span className="text-sm text-primary-100">📍 {profile.location}</span>
              )}
              {profile.company && (
                <span className="text-sm text-primary-100">🏢 {profile.company}</span>
              )}
              <span className="text-sm text-primary-100">
                <Users className="w-4 h-4 inline mr-1" />
                {stats.followers?.toLocaleString() || profile.followers?.toLocaleString()} followers
              </span>
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="54"
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{animatedScore}</span>
                <span className="text-sm text-primary-100">/ 100</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {rating.emoji} {rating.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <span className="text-xs text-gray-500">Repos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalRepos}</p>
          <p className="text-sm text-success-600">{stats.originalRepos} original</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-warning-500" />
            <span className="text-xs text-gray-500">Stars</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalStars.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total earned</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <GitFork className="w-5 h-5 text-primary-500" />
            <span className="text-xs text-gray-500">Forks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalForks.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total forks</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-success-500" />
            <span className="text-xs text-gray-500">Languages</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.languages}</p>
          <p className="text-sm text-gray-500">Different</p>
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="card p-6">
        <h3 className="subsection-title flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
          Dimension Breakdown
        </h3>
        
        <div className="space-y-4 mt-4">
          {Object.entries(dimensions).map(([key, score]) => {
            const labels = {
              documentation: '📝 Documentation Quality',
              structure: '🏗️ Code Structure',
              activity: '📅 Activity Consistency',
              organization: '📁 Repository Organization',
              impact: '🌟 Project Impact',
              technical: '🔧 Technical Depth'
            };

            return (
              <div key={key} className="flex items-center">
                <span className="w-48 text-sm text-gray-600 hidden sm:block">
                  {labels[key]}
                </span>
                <span className="w-8 text-sm font-medium text-gray-900 sm:hidden">
                  {labels[key].split(' ')[0]}
                </span>
                <div className="flex-grow mx-4">
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill ${getScoreBg(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
                <span className={`w-12 text-right font-semibold ${getScoreColor(score)}`}>
                  {score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreDashboard;