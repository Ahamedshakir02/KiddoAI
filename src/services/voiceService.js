// voiceService.js - Web Speech API wrapper for Joy (KiddoAI)

// Text to Speech (Synthesis) helper
export const speakText = (text, buddyId, onEndCallback = null) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel any active speech first
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Setup options based on buddy personality
  // Sparky: high pitch robotic, faster speed
  // Luna: gentle, slightly slower, normal pitch
  // Professor Owl: deep, slow, wise
  // Coco: energetic, high pitch, normal speed
  switch (buddyId) {
    case 'sparky':
      utterance.pitch = 1.6;
      utterance.rate = 1.05;
      break;
    case 'luna':
      utterance.pitch = 1.1;
      utterance.rate = 0.9;
      break;
    case 'owl':
      utterance.pitch = 0.8;
      utterance.rate = 0.85;
      break;
    case 'coco':
      utterance.pitch = 1.4;
      utterance.rate = 1.1;
      break;
    default:
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
  }

  // Pick an appropriate voice (e.g., female for Luna, male/neutral for others if available)
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    if (buddyId === 'luna') {
      // Find female sounding voice
      const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('google us english') || v.name.toLowerCase().includes('samantha'));
      if (femaleVoice) utterance.voice = femaleVoice;
    } else if (buddyId === 'owl') {
      // Find deep/mature sounding voice
      const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('microsoft david') || v.name.toLowerCase().includes('premium'));
      if (maleVoice) utterance.voice = maleVoice;
    }
  }

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = onEndCallback;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// Speech to Text (Recognition) helper class
export class SpeechToTextEngine {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  start(lang = 'en-US', onStart, onResult, onError, onEnd) {
    if (!this.recognition) {
      if (onError) onError("Speech recognition is not supported in this browser.");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    }

    this.recognition.lang = lang;
    this.isListening = true;

    this.recognition.onstart = () => {
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error("STT Engine Error:", event.error);
      if (onError) onError(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error(e);
      if (onError) onError(e.message);
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
