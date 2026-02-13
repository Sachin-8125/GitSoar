import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { GitCommit, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CommitPatternChart = ({ commitPatterns }) => {
  const { weeklyData, totalCommits, averagePerWeek, activityTrend, mostActiveDay } = commitPatterns;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getTrendIcon = () => {
    if (activityTrend === 'increasing') return <TrendingUp className="w-5 h-5 text-success-500" />;
    if (activityTrend === 'decreasing') return <TrendingDown className="w-5 h-5 text-danger-500" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getTrendText = () => {
    if (activityTrend === 'increasing') return 'Activity increasing';
    if (activityTrend === 'decreasing') return 'Activity decreasing';
    return 'Stable activity';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">Week of {label}</p>
          <p className="text-sm text-primary-600">
            {payload[0].value} commits
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="subsection-title flex items-center mb-0">
          <GitCommit className="w-5 h-5 mr-2 text-primary-500" />
          Commit Activity
        </h3>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className="text-sm text-gray-600">{getTrendText()}</span>
        </div>
      </div>

      {weeklyData && weeklyData.length > 0 ? (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{totalCommits}</p>
              <p className="text-xs text-gray-500">Total Commits</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{averagePerWeek}</p>
              <p className="text-xs text-gray-500">Avg/Week</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mostActiveDay?.slice(0, 3)}</p>
              <p className="text-xs text-gray-500">Most Active</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="week" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="commits" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-500 rounded mr-2" />
              <span className="text-gray-600">Commits per week</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success-500 rounded mr-2" />
              <span className="text-gray-600">Active periods</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <GitCommit className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No commit data available</p>
          <p className="text-sm mt-1">This could be a new profile or private commits</p>
        </div>
      )}
    </div>
  );
};

export default CommitPatternChart;