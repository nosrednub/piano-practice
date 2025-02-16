class MidiService {
  constructor() {
    this.midiAccess = null;
    this.input = null;
  }

  async requestMidiAccess() {
    if (navigator.requestMIDIAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess();
        console.log("MIDI access granted!");
        return true;
      } catch (error) {
        console.error("MIDI access failed:", error);
        return false;
      }
    } else {
      console.error("WebMIDI API is not supported in this browser.");
      return false;
    }
  }

  getMidiInputs() {
    if (!this.midiAccess) {
      return [];
    }
    return Array.from(this.midiAccess.inputs.values());
  }

  selectMidiInput(inputId) {
    if (!this.midiAccess) {
      return false;
    }
    this.input = this.midiAccess.inputs.get(inputId);
    if (this.input) {
      console.log(`Selected MIDI input: ${this.input.name}`);
      return true;
    } else {
      console.error(`MIDI input with ID ${inputId} not found.`);
      return false;
    }
  }

  startListening(onMidiMessage) {
    if (!this.input) {
      console.error("No MIDI input selected.");
      return;
    }
    this.input.onmidimessage = (message) => {
      const data = message.data;
      const command = data[0] & 0xf0; // Mask out channel info (lowest 4 bits)
      const note = data[1];
      const velocity = data[2];

      if (command === 0x90 && velocity > 0) { // Note On message
        onMidiMessage({ type: 'noteon', note, velocity });
      } else if (command === 0x80 || (command === 0x90 && velocity === 0)) { // Note Off message
        onMidiMessage({ type: 'noteoff', note });
      }
    };
    console.log("Started listening for MIDI messages.");
  }

  stopListening() {
    if (this.input) {
      this.input.onmidimessage = null;
      console.log("Stopped listening for MIDI messages.");
    }
  }
}

export default MidiService;