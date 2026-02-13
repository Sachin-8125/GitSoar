import { Sparkles, BarChart3, FileText, Zap, ArrowDown } from 'lucide-react';

const Hero = ({ onScrollToAnalyzer }) => {
  const features = [
    {
      icon: BarChart3,
      title: 'Comprehensive Scoring',
      description: '6-dimension analysis covering documentation, structure, activity, and more'
    },
    {
      icon: FileText,
      title: 'Actionable Insights',
      description: 'Get specific recommendations to improve your GitHub portfolio'
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Real-time scoring powered by the GitHub API'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">Free GitHub Profile Analyzer</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Analyze Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              GitHub Portfolio
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            Get a comprehensive Portfolio Score (0-100) with actionable insights to impress recruiters. 
            Understand your strengths and discover exactly how to improve.
          </p>

          {/* CTA Button */}
          <button
            onClick={onScrollToAnalyzer}
            className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Start Analysis
            <ArrowDown className="w-5 h-5 ml-2 animate-bounce" />
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-primary-200 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;