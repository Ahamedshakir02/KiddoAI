import React, { useState, useEffect } from 'react';
import { X, Lock, Key, Clock, List, Settings2 } from 'lucide-react';

export default function ParentDashboard({ isOpen, onClose, chatHistory, onSaveSettings }) {
  const [isLocked, setIsLocked] = useState(true);
  const [mathProblem, setMathProblem] = useState({ q: '', a: 0 });
  const [parentAnswer, setParentAnswer] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  // Parent configuration states
  const [timeLimit, setTimeLimit] = useState(() => parseInt(localStorage.getItem('joy_time_limit') || '0')); // 0 = unlimited

  // Generate a random math multiplication check on load
  const generateMathChallenge = () => {
    const num1 = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const num2 = Math.floor(Math.random() * 7) + 3; // 3 to 9
    setMathProblem({
      q: `What is ${num1} × ${num2}?`,
      a: num1 * num2
    });
    setParentAnswer('');
    setUnlockError(false);
  };

  useEffect(() => {
    if (isOpen) {
      setIsLocked(true);
      generateMathChallenge();
    }
  }, [isOpen]);

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (parseInt(parentAnswer) === mathProblem.a) {
      setIsLocked(false);
      setUnlockError(false);
    } else {
      setUnlockError(true);
      generateMathChallenge(); // Refresh puzzle
    }
  };

  const handleSave = () => {
    localStorage.setItem('joy_time_limit', timeLimit.toString());
    onSaveSettings(timeLimit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ color: '#1e293b' }}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {isLocked ? (
          /* Parent Gate: Math Challenge */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Lock size={28} />
            </div>
            
            <h2 className="kid-font" style={{ fontSize: '22px', marginBottom: '8px' }}>
              Parents Gate
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Please solve this math equation to open the dashboard:
            </p>

            <form onSubmit={handleUnlockSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div className="kid-font" style={{ fontSize: '28px', color: '#2563eb', letterSpacing: '1px' }}>
                {mathProblem.q}
              </div>
              
              <input
                type="number"
                value={parentAnswer}
                onChange={(e) => setParentAnswer(e.target.value)}
                placeholder="Your Answer"
                autoFocus
                style={{
                  width: '140px',
                  textAlign: 'center',
                  fontSize: '18px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '2px solid rgba(0,0,0,0.1)'
                }}
              />
              
              {unlockError && (
                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '500' }}>
                  Oops! That answer wasn't correct. Try the new one!
                </p>
              )}

              <button 
                type="submit" 
                className="btn-header btn-send" 
                style={{ marginTop: '12px', background: '#2563eb', color: 'white', border: 'none', width: '100%', maxWidth: '200px', display: 'flex', justifyContent: 'center' }}
              >
                Enter Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Actual Dashboard Configurations */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Settings2 size={24} style={{ color: '#2563eb' }} />
              <h2 className="kid-font" style={{ fontSize: '24px' }}>Parent & Teacher Control</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Secure Key Status Notice */}
              <div className="form-group" style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#0f172a', fontSize: '13px' }}>
                  <Key size={14} style={{ color: '#059669' }} />
                  <span>Secure Server Configuration</span>
                </div>
                <span style={{ fontSize: '11px', color: '#475569', marginTop: '4px', display: 'block', lineHeight: '1.4' }}>
                  The AI connection key is securely managed on the backend server environment. No keys are exposed in this client browser.
                </span>
              </div>

              {/* Time Limit Setting */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                  <Clock size={16} style={{ color: '#d97706' }} />
                  <span>Daily Usage Time Limit</span>
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(0,0,0,0.08)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                >
                  <option value={0}>Unlimited Play</option>
                  <option value={5}>5 Minutes (for testing)</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                </select>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  The app will display a soft lock screen when limits expire to remind kids to rest.
                </span>
              </div>

              {/* Recent Activity Chat Logs */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', marginBottom: '4px' }}>
                  <List size={16} style={{ color: '#7c3aed' }} />
                  <span>Recent Questions Asked</span>
                </label>
                <div style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  padding: '10px',
                  background: '#f8fafc',
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {chatHistory && chatHistory.length > 0 ? (
                    chatHistory
                      .filter(msg => msg.sender === 'user')
                      .map((msg, index) => (
                        <div key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '4px' }}>
                          <span style={{ color: '#94a3b8', fontSize: '11px', marginRight: '6px' }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <strong>Question:</strong> {msg.text || "[Image scanned]"}
                          {msg.image && <span style={{ color: '#2563eb', fontSize: '11px', marginLeft: '6px' }}>(Image attached)</span>}
                        </div>
                      ))
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic', textAlign: 'center' }}>No messages recorded yet!</p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                className="btn-header" 
                onClick={onClose}
                style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                className="btn-header btn-send" 
                onClick={handleSave}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', background: '#2563eb', color: 'white', border: 'none' }}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
