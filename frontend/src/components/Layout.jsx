import { Github, Sparkles, Heart } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Git<span className="text-teal-400">Soar</span>
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden sm:flex items-center space-x-6">
              <a href="#features" className="text-dark-300 hover:text-white font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-dark-300 hover:text-white font-medium transition-colors">
                How it Works
              </a>
              <DarkModeToggle />
              <a
                href="https://github.com/Sachin-8125/GitSoar"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm bg-dark-700 text-white border-dark-600 hover:bg-dark-600"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </nav>
            
            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center space-x-2">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="font-semibold text-white">GitSoar</span>
              <span className="text-dark-400">- Analyze your GitHub portfolio</span>
            </div>
            
            <div className="flex items-center text-dark-400 text-sm">
              Made with <Heart className="w-4 h-4 mx-1 text-success-500 fill-current" /> for developers
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-dark-700 text-center text-sm text-dark-400">
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