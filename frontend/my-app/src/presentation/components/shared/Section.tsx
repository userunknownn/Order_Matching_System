import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="section mb-4">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Section;

