import { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import Layout from './components/Layout';
import Hero from './components/Hero';
import UrlInput from './components/UrlInput';
import LoadingSpinner from './components/LoadingSpinner';
import ScoreDashboard from './components/ScoreDashboard';
import DimensionBreakdown from './components/DimensionBreakdown';
import InsightsSection from './components/InsightsSection';
import LanguageChart from './components/LanguageChart';
import CommitPatternChart from './components/CommitPatternChart';
import RepositoryInsights from './components/RepositoryInsights';
import ExportButton from './components/ExportButton';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { analyzeProfile } from './lib/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const analyzerRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const faqRef = useRef(null);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.animate-card');
          if (cards.length > 0) {
            anime({
              targets: cards,
              opacity: [0, 1],
              translateY: [50, 0],
              scale: [0.95, 1],
              duration: 800,
              delay: anime.stagger(100),
              easing: 'easeOutExpo',
            });
          }
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    return () => observer.disconnect();
  }, []);

  const handleScrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async (githubUrl) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);
    setUsername(githubUrl.split('/').pop());

    try {
      const response = await analyzeProfile(githubUrl);
      setAnalysisData(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setUsername('');
  };

  return (
    <DarkModeProvider>
      <Layout>
        <Hero onScrollToAnalyzer={handleScrollToAnalyzer} />

        {/* Analyzer Section */}
        <section ref={analyzerRef} className="py-16 bg-dark-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Your Analysis
              </h2>
              <p className="text-dark-300 max-w-2xl mx-auto">
                Enter a GitHub profile URL to get a comprehensive analysis. 
                We'll examine public repositories, commit history, and more.
              </p>
            </div>

            {/* Input Form */}
            <UrlInput onSubmit={handleAnalyze} loading={loading} />

            {/* Loading State */}
            {loading && <LoadingSpinner username={username} />}

            {/* Error State */}
            {error && (
              <div className="mt-8 p-6 bg-danger-900/20 border border-danger-800 rounded-xl animate-fade-in">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-danger-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-danger-200">Analysis Failed</h3>
                    <p className="text-danger-300 mt-1">{error}</p>
                    <button
                      onClick={handleReset}
                      className="mt-3 text-sm font-medium text-danger-300 hover:text-danger-200 flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {analysisData && !loading && (
              <div className="mt-12 space-y-6 animate-fade-in">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    Analysis Results
                  </h2>
                  <div className="flex items-center space-x-3">
                    <ExportButton data={analysisData} />
                    <button
                      onClick={handleReset}
                      className="btn-secondary"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Analyze Another
                    </button>
                  </div>
                </div>

                {/* Score Dashboard */}
                <ScoreDashboard data={analysisData} />

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DimensionBreakdown dimensions={analysisData.scores.dimensions} />
                  <InsightsSection analysis={analysisData.analysis} />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LanguageChart languageAnalysis={analysisData.analysis.languageAnalysis} />
                  <CommitPatternChart commitPatterns={analysisData.analysis.commitPatterns} />
                </div>

                {/* Repository Insights */}
                <RepositoryInsights repositories={analysisData.analysis.repositoryInsights} />

                {/* Analysis Footer */}
                <div className="card p-6 bg-dark-800 border border-dark-700">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-dark-400">
                        Analysis completed on {new Date(analysisData.analyzedAt).toLocaleString()}
                      </p>
                      {analysisData.cached && (
                        <p className="text-xs text-dark-500 mt-1">
                          Results retrieved from cache
                        </p>
                      )}
                    </div>
                    <a
                      href={analysisData.profile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      View GitHub Profile
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features" className="py-16 bg-dark-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                What GitSoar Analyzes
              </h2>
              <p className="text-dark-300 max-w-2xl mx-auto">
                Our comprehensive scoring algorithm evaluates your GitHub profile across 
                six key dimensions that recruiters care about.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Documentation Quality',
                  description: 'README completeness, code comments, and documentation coverage across repositories.',
                  icon: '📝',
                  color: 'blue'
                },
                {
                  title: 'Code Structure',
                  description: 'Best practices, file organization, configuration files, and CI/CD setup.',
                  icon: '🏗️',
                  color: 'indigo'
                },
                {
                  title: 'Activity Consistency',
                  description: 'Commit frequency, consistency over time, and recent development activity.',
                  icon: '📅',
                  color: 'green'
                },
                {
                  title: 'Repository Organization',
                  description: 'Descriptions, topics, licenses, and overall repository completeness.',
                  icon: '📁',
                  color: 'purple'
                },
                {
                  title: 'Project Impact',
                  description: 'Stars, forks, watchers, and indicators of real-world relevance.',
                  icon: '🌟',
                  color: 'amber'
                },
                {
                  title: 'Technical Depth',
                  description: 'Language diversity, project complexity, and technical breadth.',
                  icon: '🔧',
                  color: 'rose'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="animate-card p-6 rounded-2xl bg-teal-900/30 hover:bg-teal-900/40 transition-all duration-300 border border-teal-800/50 hover:scale-105 hover:-translate-y-1 opacity-0"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section ref={howItWorksRef} id="how-it-works" className="py-16 bg-dark-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-dark-300 max-w-2xl mx-auto">
                Get your GitHub profile analysis in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Enter GitHub URL',
                  description: 'Paste any public GitHub profile URL into the analyzer.',
                  icon: '🔗'
                },
                {
                  step: '2',
                  title: 'Analysis',
                  description: 'We fetch repository data, commits, and languages via the GitHub API.',
                  icon: '⚡'
                },
                {
                  step: '3',
                  title: 'Get Insights',
                  description: 'Receive your Portfolio Score with detailed breakdown and recommendations.',
                  icon: '📊'
                }
              ].map((item, index) => (
                <div key={index} className="animate-card relative opacity-0">
                  <div className="card p-6 text-center h-full bg-teal-900/20 border-teal-800/40 hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-success-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-dark-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center">
                        <span className="text-teal-200">→</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="py-16 bg-dark-800 transition-colors duration-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: 'Is GitSoar free to use?',
                  answer: 'Yes, GitSoar is completely free. We analyze public GitHub profiles using the GitHub API.'
                },
                {
                  question: 'Do you store my data?',
                  answer: 'We temporarily cache analysis results for 24 hours to improve performance, but we do not permanently store any data.'
                },
                {
                  question: 'What if I hit the rate limit?',
                  answer: 'Without a GitHub token, the limit is 60 requests/hour. You can add your own token for 5,000 requests/hour.'
                },
                {
                  question: 'Can I analyze private repositories?',
                  answer: 'No, GitSoar only analyzes publicly available GitHub data.'
                },
                {
                  question: 'How accurate is the scoring?',
                  answer: 'Our algorithm is based on industry best practices and recruiter feedback. Scores are objective but should be used as guidance.'
                }
              ].map((faq, index) => (
                <div key={index} className="animate-card card p-6 bg-teal-900/30 border-teal-800/50 hover:scale-[1.02] transition-transform duration-300 opacity-0">
                  <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-teal-100/70 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </DarkModeProvider>
  );
}

export default App;
