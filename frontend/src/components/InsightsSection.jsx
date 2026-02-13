import { CheckCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const InsightsSection = ({ analysis }) => {
  const [expandedSection, setExpandedSection] = useState('recommendations');
  const { strengths, redFlags, recommendations } = analysis;

  const Section = ({ title, icon: Icon, items, color, id }) => {
    const isExpanded = expandedSection === id;
    
    const colorClasses = {
      success: {
        bg: 'bg-success-50',
        border: 'border-success-200',
        text: 'text-success-800',
        icon: 'text-success-500',
        badge: 'bg-success-100 text-success-700'
      },
      warning: {
        bg: 'bg-warning-50',
        border: 'border-warning-200',
        text: 'text-warning-800',
        icon: 'text-warning-500',
        badge: 'bg-warning-100 text-warning-700'
      },
      danger: {
        bg: 'bg-danger-50',
        border: 'border-danger-200',
        text: 'text-danger-800',
        icon: 'text-danger-500',
        badge: 'bg-danger-100 text-danger-700'
      },
      primary: {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        text: 'text-primary-800',
        icon: 'text-primary-500',
        badge: 'bg-primary-100 text-primary-700'
      }
    };

    const colors = colorClasses[color];

    return (
      <div className={`rounded-xl border-2 ${colors.border} overflow-hidden`}>
        <button
          onClick={() => setExpandedSection(isExpanded ? null : id)}
          className={`w-full p-4 flex items-center justify-between ${colors.bg} hover:bg-opacity-80 transition-colors`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <div className="text-left">
              <h4 className={`font-semibold ${colors.text}`}>{title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                {items.length} items
              </span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${colors.icon}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${colors.icon}`} />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 bg-white">
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      color === 'success' ? 'bg-success-500' :
                      color === 'warning' ? 'bg-warning-500' :
                      color === 'danger' ? 'bg-danger-500' : 'bg-primary-500'
                    }`} />
                    <div className="flex-grow">
                      <h5 className="font-medium text-gray-900">{item.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      
                      {/* Priority badge for recommendations */}
                      {item.priority && (
                        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                          item.priority === 'high' ? 'bg-danger-100 text-danger-700' :
                          item.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.priority} priority
                        </span>
                      )}
                      
                      {/* Impact badge */}
                      {item.impact && (
                        <span className="inline-block mt-2 ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                          {item.impact} impact
                        </span>
                      )}
                      
                      {/* Action hint */}
                      {item.action && (
                        <p className="mt-2 text-xs text-primary-600 flex items-center">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          {item.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card p-6">
      <h3 className="subsection-title mb-6">Analysis Insights</h3>
      
      <div className="space-y-4">
        {/* Strengths */}
        {strengths.length > 0 && (
          <Section
            id="strengths"
            title="Strengths"
            icon={CheckCircle}
            items={strengths}
            color="success"
          />
        )}
        
        {/* Red Flags */}
        {redFlags.length > 0 && (
          <Section
            id="redFlags"
            title="Red Flags"
            icon={AlertTriangle}
            items={redFlags}
            color="danger"
          />
        )}
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Section
            id="recommendations"
            title="Recommendations"
            icon={Lightbulb}
            items={recommendations}
            color="primary"
          />
        )}
      </div>
    </div>
  );
};

export default InsightsSection;