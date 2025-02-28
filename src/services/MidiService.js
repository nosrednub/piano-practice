class MidiService {
    constructor() {
      this.midiAccess = null;
      this.selectedInput = null;
      this.messageCallback = null;
    }
  
    async requestMidiAccess() {
      try {
        this.midiAccess = await navigator.requestMIDIAccess();
        return true;
      } catch (error) {
        console.error('MIDI access request failed:', error);
        return false;
      }
    }
  
    getMidiInputs() {
      if (!this.midiAccess) {
        return [];
      }
      const inputs = [];
      this.midiAccess.inputs.forEach(input => {
        inputs.push({
          id: input.id,
          name: input.name || `MIDI Input ${input.id}`
        });
      });
      return inputs;
    }
  
    selectMidiInput(inputId) {
      if (!this.midiAccess) return;
      
      this.midiAccess.inputs.forEach(input => {
        if (input.id === inputId) {
          this.selectedInput = input;
        }
      });
    }
  
    startListening(callback) {
      this.messageCallback = callback;
      if (this.selectedInput) {
        this.selectedInput.onmidimessage = this.handleMidiMessage.bind(this);
      }
    }
  
    stopListening() {
      if (this.selectedInput) {
        this.selectedInput.onmidimessage = null;
      }
      this.messageCallback = null;
    }
  
    handleMidiMessage(event) {
      if (!this.messageCallback) return;
  
      const [status, note, velocity] = event.data;
      const command = status >> 4;
  
      // Note on
      if (command === 9 && velocity > 0) {
        this.messageCallback({
          type: 'noteon',
          note: note,
          velocity: velocity
        });
      }
      // Note off
      else if (command === 8 || (command === 9 && velocity === 0)) {
        this.messageCallback({
          type: 'noteoff',
          note: note,
          velocity: velocity
        });
      }
    }
  }
  
  export default MidiService;