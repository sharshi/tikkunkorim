import React from 'react';

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => (
  <div className="modal">
    <h2>About</h2>
    {/* TODO: Add about/info/license content */}
    <button onClick={onClose}>Close</button>
  </div>
);

export default About;
