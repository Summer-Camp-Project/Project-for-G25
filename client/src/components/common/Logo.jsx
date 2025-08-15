import React from 'react';
import logoImage from '../../assets/Logo.jpg';

const Logo = ({ className = "w-12 h-12", textClassName = "text-xl", showText = true }) => {
  return (
    <div className="flex items-center">
      <div className={`${className} flex items-center justify-center ${showText ? 'mr-3' : ''} overflow-hidden`}>
        {/* Optimized logo image */}
        <img 
          src={logoImage} 
          alt="EthioHeritage360 Logo" 
          className="w-full h-full object-contain" 
          loading="lazy"
          decoding="async"
        />
      </div>
      {showText && (
        <span className={`${textClassName} font-bold text-foreground`}>
          Ethio<span className="text-primary">Heritage</span>
        </span>
      )}
    </div>
  );
  
};

export default Logo;
