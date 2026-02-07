import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  active: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-center p-4 bg-gray-800 rounded-lg border-2 cursor-pointer transition-all ${
        active ? 'border-green-500 bg-gray-700' : 'border-gray-700 hover:bg-gray-700'
      }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-sm">{title}</h3>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
};

export default FeatureCard;