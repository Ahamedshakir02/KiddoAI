import React, { useRef, useEffect } from 'react';
import { Send, Mic, Camera, Volume2, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { stopSpeaking } from '../services/voiceService';

export default function ChatFeed({
  messages,
  inputText,
  setInputText,
  isThinking,
  activeBuddyData,
  attachedImage,
  setAttachedImage,
  isListening,
  onToggleMic,
  onOpenScanner,
  onSendMessage,
  onSpeakMessage
}) {
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom of the chat when messages update or thinking status changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Clean speaking on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="panel chat-container" style={{ height: '100%' }}>
      {/* Chat Header */}
      <div className="chat-header">
        <span className="chat-header-avatar">{activeBuddyData.emoji}</span>
        <div className="chat-header-info">
          <h2 className="kid-font">{activeBuddyData.name}</h2>
          <p>{activeBuddyData.role} Companion</p>
        </div>
      </div>

      {/* Messages Window */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '24px'
          }}>
            <span style={{ fontSize: '48px', animation: 'float 3s infinite' }}>{activeBuddyData.emoji}</span>
            <h3 className="kid-font" style={{ marginTop: '12px', fontSize: '18px' }}>
              Hello! I am {activeBuddyData.name}!
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '300px', marginTop: '6px' }}>
              {activeBuddyData.description} Ask me any question, take a photo of your writing, or let's chat!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={msg.id || index} 
              className={`message-row ${msg.sender === 'user' ? 'outgoing' : 'incoming'}`}
            >
              {/* Speaking read button for incoming messages */}
              {msg.sender === 'buddy' && (
                <button 
                  className="btn-speech" 
                  onClick={() => onSpeakMessage(msg.text)}
                  title="Read Aloud"
                >
                  <Volume2 size={18} />
                </button>
              )}

              <div className="message-bubble">
                {/* Outgoing Message with Thumbnail */}
                {msg.sender === 'user' && msg.image && (
                  <div style={{ marginBottom: '8px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img 
                      src={msg.image} 
                      alt="Attachment" 
                      style={{ maxWidth: '200px', maxHeight: '150px', display: 'block', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                
                {/* Message Text */}
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                
                <span style={{ 
                  display: 'block', 
                  fontSize: '9px', 
                  opacity: 0.5, 
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  marginTop: '4px'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Thinking loader status */}
        {isThinking && (
          <div className="message-row incoming">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', borderRadius: '20px', fontSize: '13px', color: 'var(--text-secondary)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <Sparkles size={14} className="animate-spin" style={{ color: 'var(--buddy-color-primary)' }} />
              <span className="kid-font" style={{ fontStyle: 'italic' }}>
                {activeBuddyData.name} is looking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Inputs Dock */}
      <div className="chat-input-area">
        {/* Attachment preview if an image is staged */}
        {attachedImage && (
          <div className="attachment-preview">
            <img src={attachedImage} alt="Attachment Preview" />
            <span className="kid-font">Homework photo attached!</span>
            <button 
              onClick={() => setAttachedImage(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', display: 'flex', color: '#ef4444' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="input-row">
          <button 
            className="btn-input-action" 
            onClick={onOpenScanner}
            title="Scan Homework or Drawing"
          >
            <Camera size={20} />
          </button>

          <button 
            className={`btn-input-action ${isListening ? 'btn-mic-active' : ''}`}
            onClick={onToggleMic}
            title={isListening ? "Listening..." : "Speak Question"}
          >
            <Mic size={20} />
          </button>

          <input
            type="text"
            className="chat-input"
            placeholder={`Ask ${activeBuddyData.name} anything...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isListening}
          />

          <button 
            className="btn-input-action btn-send" 
            onClick={onSendMessage}
            disabled={!inputText.trim() && !attachedImage}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
