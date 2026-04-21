import { useState, useEffect } from 'react';

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('ageVerified');
    if (isVerified !== 'true') {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  const handleNo = () => {
    alert('You must be 21 or older to enter.');
    window.location.href = 'https://www.google.com/';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-6 py-8 text-center">
      <h1 className="mb-8 text-3xl md:text-5xl font-bold text-primary drop-shadow-md">
        Are you 21 or older?
      </h1>
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <button
          onClick={handleYes}
          className="w-full md:w-40 bg-primary hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors text-xl"
        >
          Yes
        </button>
        <button
          onClick={handleNo}
          className="w-full md:w-40 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-xl"
        >
          No
        </button>
      </div>
    </div>
  );
}
