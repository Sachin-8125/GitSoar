import { Github, Sparkles, Heart } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Git<span className="text-primary-600">Soar</span>
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden sm:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                How it Works
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900">GitSoar</span>
              <span className="text-gray-500">- Analyze your GitHub portfolio</span>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              Made with <Heart className="w-4 h-4 mx-1 text-danger-500 fill-current" /> for developers
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>
              GitSoar uses the GitHub API to analyze public repositories only. 
              Your data is not stored permanently.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;