import React from 'react';

interface MidiModalProps {
  detectedNotes: string[];
  isOpen: boolean;
  onClose: () => void;
}

const MidiModal: React.FC<MidiModalProps> = ({ detectedNotes, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="midi-modal-backdrop">
      <div className="midi-modal">
        <div className="midi-modal-header">
          <button className="midi-modal-close-button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="midi-modal-body">
          <h2>MIDI Input</h2>
          <div className="detected-notes-container">
            <h3>Detected Notes:</h3>
            <ul className="detected-notes-list">
              {detectedNotes.map((note, index) => (
                <li key={index} className="detected-note-item">{`Note: ${note}`}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidiModal;