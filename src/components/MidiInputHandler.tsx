"use client";
import React, { useState, useEffect, useCallback } from 'react';
import MidiService from '../services/MidiService';

interface MidiMessageHandlerProps {
  detectedNotes: string[];
}

interface MidiInputHandlerProps {
  children: (props: MidiMessageHandlerProps) => React.ReactNode;
}

const MidiInputHandler: React.FC<MidiInputHandlerProps> = ({ children }) => {
  const [midiService, setMidiService] = useState<MidiService | null>(null);
  const [midiInputs, setMidiInputs] = useState<any[]>([]); // Type more specifically if possible
  const [selectedInputId, setSelectedInputId] = useState<string>('');
  const [detectedNotes, setDetectedNotes] = useState<string[]>([]);

  useEffect(() => {
    const initializeMidi = async () => {
      const service = new MidiService();
      const accessGranted = await service.requestMidiAccess();
      if (accessGranted) {
        setMidiService(service);
        const inputs = service.getMidiInputs();
        setMidiInputs(inputs);
        if (inputs.length > 0) {
          setSelectedInputId(inputs[0].id); // Select the first input by default
        }
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
  }, [midiService, selectedInputId]);

  const handleMidiMessage = useCallback((message: any) => { // Type 'message' more specifically
    if (message.type === 'noteon') {
      setDetectedNotes((prevNotes) => {
        const newNotes = [...prevNotes, message.note];
        return newNotes.slice(-5); // Keep only the last 5 notes for display
      });
    } else if (message.type === 'noteoff') {
      setDetectedNotes((prevNotes) => prevNotes.filter(note => note !== message.note));
    }
  }, []);

  const handleInputSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInputId(event.target.value);
  };

  return (
    <div>
      <h2>MIDI Input</h2>
      {midiInputs.length > 0 ? (
        <div>
          <label htmlFor="midiInput">Select MIDI Input:</label>
          <select id="midiInput" value={selectedInputId} onChange={handleInputSelect}>
            {midiInputs.map((input) => (
              <option key={input.id} value={input.id}>{input.name}</option>
            ))}
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
      {children({ detectedNotes })}
    </div>
  );
};

export default MidiInputHandler;