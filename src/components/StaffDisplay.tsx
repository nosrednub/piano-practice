import React from 'react';

const StaffDisplay: React.FC = () => {
  return (
    <div className="staff-container">
      {/* Temporary placeholder until MIDI staff implementation is added */}
      <div className="staff-lines">
        {Array.from({ length: 5 }).map((_, i) => (
          <hr key={i} className="staff-line" />
        ))}
      </div>
      <p className="text-gray-500">Staff display placeholder</p>
    </div>
  );
};

export default StaffDisplay;
