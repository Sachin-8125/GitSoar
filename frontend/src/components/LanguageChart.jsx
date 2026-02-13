import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Code2 } from 'lucide-react';

const LanguageChart = ({ languageAnalysis }) => {
  const { distribution, totalLanguages, primaryLanguage, diversityScore } = languageAnalysis;

  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  const data = distribution.map((lang, index) => ({
    name: lang.name,
    value: lang.percentage,
    count: lang.count,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-600">{item.value}% of repos</p>
          <p className="text-sm text-gray-500">{item.payload.count} repositories</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="subsection-title flex items-center mb-0">
          <Code2 className="w-5 h-5 mr-2 text-primary-500" />
          Language Distribution
        </h3>
        <span className="text-sm text-gray-500">
          {totalLanguages} languages
        </span>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            {/* Primary Language */}
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 mb-1">Primary Language</p>
              <p className="text-xl font-bold text-primary-900">{primaryLanguage}</p>
            </div>

            {/* Diversity Score */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Diversity Score</p>
                <span className={`font-semibold ${
                  diversityScore >= 70 ? 'text-success-500' :
                  diversityScore >= 40 ? 'text-warning-500' : 'text-danger-500'
                }`}>
                  {diversityScore}/100
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${
                    diversityScore >= 70 ? 'bg-success-500' :
                    diversityScore >= 40 ? 'bg-warning-500' : 'bg-danger-500'
                  }`}
                  style={{ width: `${diversityScore}%` }}
                />
              </div>
            </div>

            {/* Language List */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Top Languages</p>
              <div className="space-y-2">
                {data.slice(0, 4).map((lang) => (
                  <div key={lang.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm text-gray-700 flex-grow">{lang.name}</span>
                    <span className="text-sm text-gray-500">{lang.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Code2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No language data available</p>
        </div>
      )}
    </div>
  );
};

export default LanguageChart;