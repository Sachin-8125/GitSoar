import { useState } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { validateGithubUrl } from '../lib/validators';

const UrlInput = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const validation = validateGithubUrl(url);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    onSubmit(url);
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  const exampleProfiles = [
    'https://github.com/torvalds',
    'https://github.com/facebook',
    'https://github.com/google'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative flex items-center bg-white rounded-2xl shadow-lg
            transition-all duration-300
            ${isFocused ? 'ring-4 ring-primary-100 shadow-xl' : ''}
            ${error ? 'ring-4 ring-danger-100' : ''}
          `}
        >
          <div className="absolute left-5 text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          
          <input
            type="text"
            value={url}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter GitHub profile URL (e.g., https://github.com/username)"
            className={`
              w-full pl-14 pr-36 py-5 text-lg rounded-2xl
              border-2 border-transparent
              focus:outline-none focus:border-transparent
              ${error ? 'text-danger-600 placeholder-danger-300' : 'text-gray-900 placeholder-gray-400'}
            `}
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="
              absolute right-2
              btn-primary py-3 px-6 rounded-xl
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
        
        {error && (
          <div className="flex items-center mt-3 text-danger-600 animate-fade-in">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </form>
      
      {/* Example Profiles */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-3">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleProfiles.map((profile) => (
            <button
              key={profile}
              onClick={() => {
                setUrl(profile);
                setError('');
              }}
              disabled={loading}
              className="
                px-3 py-1.5 text-sm
                bg-gray-100 hover:bg-gray-200
                text-gray-600 hover:text-gray-900
                rounded-full transition-colors
                disabled:opacity-50
              "
            >
              {profile.split('/').pop()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrlInput;