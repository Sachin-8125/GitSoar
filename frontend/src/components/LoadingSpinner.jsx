import { useEffect, useState } from 'react';
import { Loader2, Sparkles, Code2, GitCommit, BarChart3, FileText } from 'lucide-react';

const LoadingSpinner = ({ username }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Sparkles, text: 'Fetching user profile...' },
    { icon: Code2, text: 'Loading repositories...' },
    { icon: FileText, text: 'Analyzing documentation...' },
    { icon: GitCommit, text: 'Processing commit history...' },
    { icon: BarChart3, text: 'Calculating scores...' }
  ];

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 3;
      });
    }, 200);

    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Animated Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
          <CurrentIcon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Analyzing Profile
      </h3>
      
      {/* Username */}
      <p className="text-primary-600 font-medium mb-6">
        @{username}
      </p>

      {/* Current Step */}
      <div className="flex items-center space-x-3 mb-6">
        <CurrentIcon className="w-5 h-5 text-primary-600" />
        <span className="text-gray-600 animate-pulse">
          {steps[currentStep].text}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mb-2">
        <div className="progress-bar">
          <div
            className="progress-bar-fill bg-primary-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-400">
        {Math.round(progress)}% complete
      </p>

      {/* Step Indicators */}
      <div className="flex space-x-2 mt-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentStep
                ? 'bg-primary-600'
                : index < currentStep
                ? 'bg-primary-300'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Info Text */}
      <p className="mt-8 text-sm text-gray-400 max-w-md text-center">
        This may take a moment depending on the number of repositories.
        We're analyzing documentation, code structure, and activity patterns.
      </p>
    </div>
  );
};

export default LoadingSpinner;