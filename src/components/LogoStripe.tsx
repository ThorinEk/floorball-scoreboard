import React, { useState, useEffect, ReactElement } from 'react';
import './LogoStripe.css';

interface Logo {
  name: string;
  path: string;
}

const LogoStripe: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch logos from the public/logos directory
    const fetchLogos = async () => {
      try {
        const response = await fetch('/logos/manifest.json');
        if (!response.ok) {
          throw new Error('Failed to fetch logo manifest');
        }
        
        const data = await response.json();
        const logoFiles = data.logos || [];
        
        setLogos(logoFiles.map((fileName: string) => ({
          name: fileName.split('.')[0],
          path: `/logos/${fileName}`
        })));
      } catch (error) {
        console.error('Error loading logos:', error);
        setLogos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (isLoading) {
    return <div className="logo-stripe-loading"></div>;
  }

  // If no logos found, return an empty stripe with minimal height
  if (logos.length === 0) {
    return <div className="logo-stripe-empty"></div>;
  }

  // Create enough logos to fill the track
  const getLogos = () => {
    // Create logo elements
    const logoElements = logos.map((logo, index) => (
      <div key={`logo-${index}`} className="logo-item">
        <img src={logo.path} alt={logo.name} title={logo.name} />
      </div>
    ));
    
    // Use a fixed number of repetitions instead of a while loop
    // to avoid the "unsafe references" error
    const minimumCount = 30;
    const repetitions = Math.max(2, Math.ceil(minimumCount / logoElements.length));
    
    // Create the final array with correct keys
    const items: ReactElement[] = [];
    for (let i = 0; i < repetitions; i++) {
      const offset = i * logoElements.length;
      logoElements.forEach((item, idx) => {
        items.push(React.cloneElement(item, { key: `logo-${offset + idx}` }));
      });
    }
    
    return items;
  };
  
  return (
    <div className="logo-stripe-container">
      <div className="logo-stripe">
        {/* Two duplicate tracks to ensure continuous flow */}
        <div className="logo-stripe-track">
          {getLogos()}
        </div>
        <div className="logo-stripe-track">
          {getLogos()}
        </div>
      </div>
    </div>
  );
};

export default LogoStripe;
