import { FileText, Code, Calendar, Folder, Star, Cpu, ArrowRight } from 'lucide-react';

const DimensionBreakdown = ({ dimensions }) => {
  const dimensionDetails = [
    {
      key: 'documentation',
      icon: FileText,
      title: 'Documentation Quality',
      weight: '20%',
      description: 'README completeness, code comments, and documentation coverage',
      color: 'blue',
      tips: ['Add comprehensive README files', 'Include usage examples', 'Document API endpoints']
    },
    {
      key: 'structure',
      icon: Code,
      title: 'Code Structure',
      weight: '20%',
      description: 'Best practices, file organization, and project configuration',
      color: 'indigo',
      tips: ['Use .gitignore files', 'Follow naming conventions', 'Set up CI/CD pipelines']
    },
    {
      key: 'activity',
      icon: Calendar,
      title: 'Activity Consistency',
      weight: '15%',
      description: 'Commit frequency, consistency, and recent activity',
      color: 'green',
      tips: ['Commit regularly', 'Maintain consistent schedule', 'Stay active on projects']
    },
    {
      key: 'organization',
      icon: Folder,
      title: 'Repository Organization',
      weight: '15%',
      description: 'Descriptions, topics, licenses, and overall organization',
      color: 'purple',
      tips: ['Add repo descriptions', 'Use topic tags', 'Include license files']
    },
    {
      key: 'impact',
      icon: Star,
      title: 'Project Impact',
      weight: '15%',
      description: 'Stars, forks, watchers, and real-world relevance',
      color: 'amber',
      tips: ['Share your projects', 'Build useful tools', 'Engage with community']
    },
    {
      key: 'technical',
      icon: Cpu,
      title: 'Technical Depth',
      weight: '15%',
      description: 'Language diversity, project complexity, and technical breadth',
      color: 'rose',
      tips: ['Learn new languages', 'Take on complex projects', 'Explore different domains']
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-success-500';
    if (score >= 50) return 'text-warning-500';
    return 'text-danger-500';
  };

  const getBgColor = (color, score) => {
    const opacity = score >= 75 ? 'bg-opacity-20' : score >= 50 ? 'bg-opacity-15' : 'bg-opacity-10';
    const colors = {
      blue: `bg-blue-500 ${opacity}`,
      indigo: `bg-indigo-500 ${opacity}`,
      green: `bg-green-500 ${opacity}`,
      purple: `bg-purple-500 ${opacity}`,
      amber: `bg-amber-500 ${opacity}`,
      rose: `bg-rose-500 ${opacity}`
    };
    return colors[color];
  };

  const getBorderColor = (color) => {
    const colors = {
      blue: 'border-blue-200',
      indigo: 'border-indigo-200',
      green: 'border-green-200',
      purple: 'border-purple-200',
      amber: 'border-amber-200',
      rose: 'border-rose-200'
    };
    return colors[color];
  };

  return (
    <div className="card p-6">
      <h3 className="subsection-title mb-6">Detailed Dimension Scores</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensionDetails.map((dim) => {
          const score = dimensions[dim.key];
          const Icon = dim.icon;
          
          return (
            <div
              key={dim.key}
              className={`p-4 rounded-xl border-2 ${getBorderColor(dim.color)} ${getBgColor(dim.color, score)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/80`}>
                  <Icon className={`w-5 h-5 text-${dim.color}-600`} />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                  {dim.weight}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{dim.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{dim.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex-grow mr-3">
                  <div className="progress-bar bg-white/50">
                    <div
                      className={`progress-bar-fill ${
                        score >= 75 ? 'bg-success-500' : score >= 50 ? 'bg-warning-500' : 'bg-danger-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
                <span className={`font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
              </div>
              
              {score < 70 && (
                <div className="mt-3 pt-3 border-t border-gray-200/50">
                  <p className="text-xs text-gray-500 mb-1">💡 Tips to improve:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {dim.tips.slice(0, 2).map((tip, i) => (
                      <li key={i} className="flex items-center">
                        <ArrowRight className="w-3 h-3 mr-1 text-gray-400" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DimensionBreakdown;