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
  
  // Create logo elements with proper spacing and sizing
  const createLogos = (): ReactElement[] => {
    // Create base logo elements
    const baseLogos = logos.map((logo, index) => (
      <div key={`base-${index}`} className="logo-item">
        <img 
          src={logo.path} 
          alt={logo.name} 
          title={logo.name}
        />
      </div>
    ));
    
    // Fill the stripe with enough logos (create many duplicates)
    // We need enough to fill twice the screen width
    const minRepetitions = Math.max(10, Math.ceil(60 / baseLogos.length));
    
    const result: ReactElement[] = [];
    
    // Safe creation of logo elements with unique keys
    for (let i = 0; i < minRepetitions; i++) {
      const currentBatch = baseLogos.map((logo, idx) => 
        React.cloneElement(logo, { key: `logo-${i}-${idx}` })
      );
      result.push(...currentBatch);
    }
    
    return result;
  };
  
  return (
    <div className="logo-stripe-container">
      <div className="logo-stripe">
        <div className="logo-stripe-track">
          {createLogos()}
        </div>
        <div className="logo-stripe-track">
          {createLogos()}
        </div>
      </div>
    </div>
  );
};

export default LogoStripe;
