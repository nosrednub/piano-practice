"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import MidiService from '../services/MidiService';

const MidiInputHandler = ({ children }) => {
  const [midiService, setMidiService] = useState(null);
  const [midiInputs, setMidiInputs] = useState([]);
  const [selectedInputId, setSelectedInputId] = useState('');
  const [detectedNotes, setDetectedNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMidi = async () => {
      try {
        const service = new MidiService();
        const accessGranted = await service.requestMidiAccess();
        if (accessGranted) {
          setMidiService(service);
          const inputs = service.getMidiInputs();
          setMidiInputs(inputs);
          if (inputs.length > 0) {
            setSelectedInputId(inputs[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to initialize MIDI:', error);
        setError('Failed to initialize MIDI device');
      }
    };

    initializeMidi();
  }, []);

  useEffect(() => {
    if (midiService && selectedInputId) {
      midiService.selectMidiInput(selectedInputId);
      midiService.startListening(handleMidiMessage);
      return () => {
        midiService.stopListening();
      };
    }
  }, [midiService, selectedInputId, handleMidiMessage]);

  const handleMidiMessage = useCallback((message) => {
    if (message.type === 'noteon') {
      setDetectedNotes((prevNotes) => {
        const newNotes = [...prevNotes, message.note];
        return newNotes.slice(-5);
      });
    } else if (message.type === 'noteoff') {
      setDetectedNotes((prevNotes) => prevNotes.filter(note => note !== message.note));
    }
  }, [setDetectedNotes]);

  const handleInputSelect = (event) => {
    setSelectedInputId(event.target.value);
  };

  const midiInputOptions = useMemo(() => (
    midiInputs.map((input) => (
      <option key={input.id} value={input.id}>{input.name}</option>
    ))
  ), [midiInputs]);

  return (
    <div>
      <h2>MIDI Input</h2>
      {error && (
        <div className="error-message text-red-500">
          {error}
        </div>
      )}
      {midiInputs.length > 0 ? (
        <div>
          <label htmlFor="midiInput">Select MIDI Input:</label>
          <select id="midiInput" value={selectedInputId} onChange={handleInputSelect}>
            {midiInputOptions}
          </select>
        </div>
      ) : (
        <p>No MIDI inputs detected.</p>
      )}
      <div>
        <h3>Detected Notes:</h3>
        <ul>
          {detectedNotes.map((note, index) => (
            <li key={index}>{`Note: ${note}`}</li>
          ))}
        </ul>
      </div>
      {React.Children.map(children, child => {
        return React.cloneElement(child, { detectedNotes });
      })}
    </div>
  );
};

MidiInputHandler.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default MidiInputHandler;