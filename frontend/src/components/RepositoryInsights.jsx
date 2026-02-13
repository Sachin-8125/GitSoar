import { useState } from 'react';
import { Star, GitFork, ExternalLink, CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const RepositoryInsights = ({ repositories }) => {
  const [expandedRepo, setExpandedRepo] = useState(null);
  const [sortBy, setSortBy] = useState('stars');

  const sortedRepos = [...repositories].sort((a, b) => {
    if (sortBy === 'stars') return b.stars - a.stars;
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-warning-500" />;
      case 'danger': return <AlertCircle className="w-4 h-4 text-danger-500" />;
      default: return <Info className="w-4 h-4 text-primary-500" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-500';
    if (score >= 60) return 'text-warning-500';
    return 'text-danger-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 60) return 'bg-warning-100';
    return 'bg-danger-100';
  };

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="subsection-title flex items-center mb-0">
          <FileText className="w-5 h-5 mr-2 text-primary-500" />
          Repository Insights
        </h3>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="stars">Stars</option>
            <option value="score">Score</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedRepos.map((repo) => (
          <div
            key={repo.name}
            className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedRepo(expandedRepo === repo.name ? null : repo.name)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getScoreBg(repo.score)}`}>
                  <span className={`font-bold ${getScoreColor(repo.score)}`}>
                    {repo.score}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{repo.name}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1 text-warning-500" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="w-3.5 h-3.5 mr-1 text-primary-500" />
                      {repo.forks}
                    </span>
                    {repo.language && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                {expandedRepo === repo.name ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Expanded Details */}
            {expandedRepo === repo.name && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-3">
                  <p className="text-sm text-gray-600 mb-3">Insights:</p>
                  <div className="flex flex-wrap gap-2">
                    {repo.insights.map((insight, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm ${
                          insight.type === 'success' ? 'bg-success-50 text-success-700' :
                          insight.type === 'warning' ? 'bg-warning-50 text-warning-700' :
                          insight.type === 'danger' ? 'bg-danger-50 text-danger-700' :
                          'bg-primary-50 text-primary-700'
                        }`}
                      >
                        {getInsightIcon(insight.type)}
                        <span>{insight.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  {repo.updatedAt && (
                    <p className="mt-3 text-xs text-gray-400">
                      Last updated: {new Date(repo.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {repositories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No repository insights available</p>
        </div>
      )}
    </div>
  );
};

export default RepositoryInsights;