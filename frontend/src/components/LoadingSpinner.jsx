import { useEffect, useState, useRef } from 'react';
import { Loader2, Sparkles, Code2, GitCommit, BarChart3, FileText } from 'lucide-react';
import anime from 'animejs';

const LoadingSpinner = ({ username }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const spinnerRef = useRef(null);
  const stepIndicatorRef = useRef(null);
  
  const steps = [
    { icon: Sparkles, text: 'Fetching user profile...' },
    { icon: Code2, text: 'Loading repositories...' },
    { icon: FileText, text: 'Analyzing documentation...' },
    { icon: GitCommit, text: 'Processing commit history...' },
    { icon: BarChart3, text: 'Calculating scores...' }
  ];

  useEffect(() => {
    // Animate spinner entrance
    anime({
      targets: spinnerRef.current,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeInOutQuad',
    });

    // Continuous floating animation for spinner
    anime({
      targets: spinnerRef.current,
      translateY: [-5, 5],
      duration: 2000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
    });

    // Animate step indicators
    anime({
      targets: stepIndicatorRef.current?.children || [],
      scale: [0, 1],
      opacity: [0, 1],
      duration: 400,
      delay: anime.stagger(100),
      easing: 'easeOutBack',
    });
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

  useEffect(() => {
    // Animate current step change
    anime({
      targets: '.step-text',
      opacity: [0, 1],
      translateX: [-10, 0],
      duration: 400,
      easing: 'easeOutQuad',
    });

    // Pulse animation for active step indicator
    anime({
      targets: `.step-dot-${currentStep}`,
      scale: [1, 1.3, 1],
      duration: 600,
      easing: 'easeInOutQuad',
    });
  }, [currentStep]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated Logo */}
      <div ref={spinnerRef} className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-success-500 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-500/30">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg">
          <CurrentIcon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">
        Analyzing Profile
      </h3>
      
      {/* Username */}
      <p className="text-teal-400 font-medium mb-6">
        @{username}
      </p>

      {/* Current Step */}
      <div className="flex items-center space-x-3 mb-6">
        <CurrentIcon className="w-5 h-5 text-teal-400" />
        <span className="step-text text-dark-300">
          {steps[currentStep].text}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mb-2">
        <div className="progress-bar">
          <div
            className="progress-bar-fill bg-gradient-to-r from-teal-500 to-success-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="text-sm text-dark-400">
        {Math.round(progress)}% complete
      </p>

      {/* Step Indicators */}
      <div ref={stepIndicatorRef} className="flex space-x-2 mt-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`step-dot-${index} w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentStep
                ? 'bg-teal-400'
                : index < currentStep
                ? 'bg-success-400'
                : 'bg-dark-600'
            }`}
          />
        ))}
      </div>

      {/* Info Text */}
      <p className="mt-8 text-sm text-dark-400 max-w-md text-center">
        This may take a moment depending on the number of repositories.
        We're analyzing documentation, code structure, and activity patterns.
      </p>
    </div>
  );
};

export default LoadingSpinner;