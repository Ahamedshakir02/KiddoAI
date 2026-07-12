import React, { useState, useEffect, useRef } from 'react';
import { Settings, Lock, Star, MessageCircle, PenTool, HelpCircle, Trophy, Sparkles, LogIn } from 'lucide-react';

// Components
import BuddySelector, { BUDDY_LIST } from './components/BuddySelector';
import ParentDashboard from './components/ParentDashboard';
import RewardsCenter, { ALL_BADGES } from './components/RewardsCenter';
import LearnQuiz from './components/LearnQuiz';
import DrawingBoard from './components/DrawingBoard';
import HomeworkScanner from './components/HomeworkScanner';
import ChatFeed from './components/ChatFeed';

// Services
import { fetchAIResponse } from './services/aiService';
import { speakText, stopSpeaking, SpeechToTextEngine } from './services/voiceService';
import { compressImage } from './services/imageOptimizer';

export default function App() {
  // Navigation & Character States
  const [activeBuddy, setActiveBuddy] = useState('sparky');
  const [activeView, setActiveView] = useState('chat'); // chat, draw, quiz, rewards

  // Chat State
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('joy_chat_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  // Rewards State
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('joy_stars');
    return saved ? parseInt(saved) : 10; // Start with 10 stars!
  });
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('joy_badges');
    return saved ? JSON.parse(saved) : [];
  });

  // Settings & Security States
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [timeLimit, setTimeLimit] = useState(() => parseInt(localStorage.getItem('joy_time_limit') || '0'));
  
  // Timer States
  const [timeUsed, setTimeUsed] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [lockVerifyOpen, setLockVerifyOpen] = useState(false);
  const [lockMath, setLockMath] = useState({ q: '', a: 0 });
  const [lockAnswer, setLockAnswer] = useState('');
  const [lockError, setLockError] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const sttEngineRef = useRef(null);

  // Initialize Speech recognition engine on mount
  useEffect(() => {
    sttEngineRef.current = new SpeechToTextEngine();
    return () => {
      stopSpeaking();
    };
  }, []);

  // Sync messages, stars, badges to LocalStorage
  useEffect(() => {
    localStorage.setItem('joy_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('joy_stars', stars.toString());
    // Auto check 100 stars badge
    if (stars >= 100 && !unlockedBadges.includes('badge_star_100')) {
      unlockBadge('badge_star_100');
    }
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('joy_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  // Session time limits loop
  useEffect(() => {
    if (timeLimit <= 0) {
      setIsTimeUp(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeUsed((prev) => {
        const nextTime = prev + 1;
        if (nextTime >= timeLimit * 60) {
          setIsTimeUp(true);
          clearInterval(interval);
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, isTimeUp]);

  // Active Buddy object
  const activeBuddyData = BUDDY_LIST.find((b) => b.id === activeBuddy) || BUDDY_LIST[0];

  // Helper: Earn Stars
  const earnStars = (count) => {
    setStars((prev) => prev + count);
  };

  // Helper: Unlock Badge
  const unlockBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges((prev) => [...prev, badgeId]);
      // Bonus stars for unlocking a badge!
      earnStars(20);
      
      // Speak congratulations
      const badgeName = ALL_BADGES.find(b => b.id === badgeId)?.name || 'New Badge';
      speakText(`Hooray! You unlocked the ${badgeName} badge! Plus twenty bonus stars!`, activeBuddy);
    }
  };

  // Chat message submitter
  const handleSendMessage = async (textOverride = null, imageOverride = null) => {
    const text = textOverride !== null ? textOverride : inputText;
    const image = imageOverride !== null ? imageOverride : attachedImage;

    if (!text.trim() && !image) return;

    setIsThinking(true);
    setInputText('');
    setAttachedImage(null);

    // Compress image client-side if present
    let processedImage = null;
    if (image) {
      try {
        processedImage = await compressImage(image);
      } catch (err) {
        console.error("Image compression failed, using original:", err);
        processedImage = image;
      }
    }

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      image: processedImage,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);

    // Speak loading noise or text
    if (activeBuddy === 'sparky') speakText("Beep boop, researching!", 'sparky');
    else if (activeBuddy === 'coco') speakText("Ooh-ooh-ah-ah, let me think!", 'coco');

    try {
      const response = await fetchAIResponse(text, processedImage, activeBuddy);
      
      const buddyMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'buddy',
        text: response,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, buddyMessage]);
      setIsThinking(false);

      // Playback voice response
      speakText(response, activeBuddy);

      // Award standard chat stars
      earnStars(5);

      // Gamification Checkpoints
      if (activeBuddy === 'sparky' && (text.toLowerCase().includes('science') || text.toLowerCase().includes('space') || text.toLowerCase().includes('robot'))) {
        unlockBadge('badge_science');
      }
      if (activeBuddy === 'luna' && (text.toLowerCase().includes('story') || text.toLowerCase().includes('fairy') || text.toLowerCase().includes('draw'))) {
        unlockBadge('badge_story');
      }
      if (activeBuddy === 'coco' && (text.toLowerCase().includes('joke') || text.toLowerCase().includes('laugh') || text.toLowerCase().includes('funny'))) {
        unlockBadge('badge_joke');
      }
      if (image) {
        unlockBadge('badge_draw');
      }

    } catch (err) {
      console.error(err);
      setIsThinking(false);
    }
  };

  // Re-read a bubble message
  const handleSpeakMessage = (text) => {
    speakText(text, activeBuddy);
  };

  // Draw board callback to submit sketch screenshots
  const handleSendDrawing = (imageBase64) => {
    setAttachedImage(imageBase64);
    setActiveView('chat');
    handleSendMessage("Look at my whiteboard writing/drawing! Can you give me feedback or translate this?", imageBase64);
  };

  // Open camera captures
  const handleCameraCapture = (imageBase64) => {
    setAttachedImage(imageBase64);
    setIsScannerOpen(false);
    setActiveView('chat');
  };

  // Parent configuration save callback
  const handleSaveSettings = (limit) => {
    setTimeLimit(limit);
    setTimeUsed(0);
    setIsTimeUp(false);
    setLockVerifyOpen(false);
  };

  // Toggle Voice Recognition
  const handleToggleMic = () => {
    if (isListening) {
      sttEngineRef.current.stop();
      setIsListening(false);
    } else {
      // Speak quick indicator
      speakText("Listening now!", activeBuddy);
      
      setIsListening(true);
      // Auto detect and transcribe
      sttEngineRef.current.start(
        'en-US',
        () => setIsListening(true),
        (transcript) => {
          setInputText(transcript);
          setIsListening(false);
          // Automatically send the voice transcription!
          handleSendMessage(transcript, null);
        },
        (err) => {
          console.error(err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
    }
  };

  // Generate math check for lock screen override
  const triggerParentUnlock = () => {
    const num1 = Math.floor(Math.random() * 8) + 3;
    const num2 = Math.floor(Math.random() * 7) + 3;
    setLockMath({
      q: `What is ${num1} × ${num2}?`,
      a: num1 * num2
    });
    setLockAnswer('');
    setLockError(false);
    setLockVerifyOpen(true);
  };

  // Process math puzzle override
  const handleParentUnlockVerify = (e) => {
    e.preventDefault();
    if (parseInt(lockAnswer) === lockMath.a) {
      // Successful override: set timeLimit to unlimited (0)
      localStorage.setItem('joy_time_limit', '0');
      setTimeLimit(0);
      setTimeUsed(0);
      setIsTimeUp(false);
      setLockVerifyOpen(false);
      speakText("Override successful. Welcome back!", activeBuddy);
    } else {
      setLockError(true);
      // Regenerate challenge
      const num1 = Math.floor(Math.random() * 8) + 3;
      const num2 = Math.floor(Math.random() * 7) + 3;
      setLockMath({
        q: `What is ${num1} × ${num2}?`,
        a: num1 * num2
      });
      setLockAnswer('');
    }
  };

  return (
    <div className="app-container">
      {/* Header Panel */}
      <header>
        <div className="logo-section">
          <span style={{ fontSize: '32px' }}>✨</span>
          <h1 className="kid-font">Joy</h1>
          <span className="kid-font" style={{ fontSize: '12px', background: 'var(--buddy-color-secondary)', color: 'var(--buddy-color-primary)', padding: '2px 8px', borderRadius: '100px', fontWeight: 'bold' }}>
            KiddoAI
          </span>
        </div>

        <div className="header-controls">
          <div className="star-counter">
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            <span>{stars} Stars</span>
          </div>

          <button 
            className="btn-header" 
            onClick={() => setIsParentOpen(true)}
            title="Parent & Teacher Settings"
          >
            <Lock size={16} />
            <span>Parents</span>
          </button>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <div className="main-grid">
        {/* Left column: Buddy selectors & sub navigations */}
        <div className="sidebar">
          {/* Navigation Menu */}
          <div className="panel" style={{ padding: '16px' }}>
            <ul className="menu-list">
              <li 
                className={`menu-item ${activeView === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveView('chat')}
              >
                <MessageCircle size={18} />
                <span>Chat Companion</span>
              </li>
              <li 
                className={`menu-item ${activeView === 'draw' ? 'active' : ''}`}
                onClick={() => setActiveView('draw')}
              >
                <PenTool size={18} />
                <span>Whiteboard Canvas</span>
              </li>
              <li 
                className={`menu-item ${activeView === 'quiz' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('quiz');
                  speakText("Ready to play? Select an answer below!", activeBuddy);
                }}
              >
                <HelpCircle size={18} />
                <span>Learn Quiz</span>
              </li>
              <li 
                className={`menu-item ${activeView === 'rewards' ? 'active' : ''}`}
                onClick={() => setActiveView('rewards')}
              >
                <Trophy size={18} />
                <span>Rewards & Badges</span>
              </li>
            </ul>
          </div>

          {/* Buddy Select Panel */}
          <BuddySelector 
            selectedBuddyId={activeBuddy}
            onSelectBuddy={(id) => {
              setActiveBuddy(id);
              stopSpeaking();
            }}
          />
        </div>

        {/* Right column: Dynamic component container */}
        <div className="view-panel" style={{ minHeight: '520px' }}>
          {activeView === 'chat' && (
            <ChatFeed
              messages={messages}
              inputText={inputText}
              setInputText={setInputText}
              isThinking={isThinking}
              activeBuddyData={activeBuddyData}
              attachedImage={attachedImage}
              setAttachedImage={setAttachedImage}
              isListening={isListening}
              onToggleMic={handleToggleMic}
              onOpenScanner={() => setIsScannerOpen(true)}
              onSendMessage={() => handleSendMessage()}
              onSpeakMessage={handleSpeakMessage}
            />
          )}

          {activeView === 'draw' && (
            <DrawingBoard
              activeBuddy={activeBuddy}
              onSendDrawing={handleSendDrawing}
            />
          )}

          {activeView === 'quiz' && (
            <LearnQuiz
              activeBuddy={activeBuddy}
              onEarnStars={earnStars}
            />
          )}

          {activeView === 'rewards' && (
            <RewardsCenter
              stars={stars}
              unlockedBadges={unlockedBadges}
            />
          )}
        </div>
      </div>

      {/* Parental Setting Modal Overlay */}
      <ParentDashboard
        isOpen={isParentOpen}
        onClose={() => setIsParentOpen(false)}
        chatHistory={messages}
        onSaveSettings={handleSaveSettings}
      />

      {/* Homework Camera capturing Overlay */}
      {isScannerOpen && (
        <HomeworkScanner
          onCapture={handleCameraCapture}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {/* Screen Usage Time Limit Screen lock */}
      {isTimeUp && (
        <div className="lock-screen">
          <span className="lock-mascot">😴</span>
          <h1 className="kid-font">Time to Rest!</h1>
          <p style={{ maxWidth: '400px', lineHeight: '1.6' }}>
            You have reached your daily play time of {timeLimit} minutes. 
            Take a screen break, look out the window, or go outside to play! 🌳✨
          </p>
          
          {!lockVerifyOpen ? (
            <button 
              className="btn-header" 
              onClick={triggerParentUnlock}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 24px' }}
            >
              Parent Override
            </button>
          ) : (
            <form onSubmit={handleParentUnlockVerify} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: '340px', animation: 'pop-up 0.3s ease-out' }}>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>Solve to unlock more time:</p>
              <div className="kid-font" style={{ fontSize: '24px', color: '#60a5fa' }}>{lockMath.q}</div>
              <input
                type="number"
                value={lockAnswer}
                onChange={(e) => setLockAnswer(e.target.value)}
                placeholder="Answer"
                autoFocus
                style={{
                  width: '100px',
                  textAlign: 'center',
                  padding: '6px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px'
                }}
              />
              {lockError && <p style={{ color: '#f87171', fontSize: '11px' }}>Oops! That answer wasn't correct.</p>}
              <button 
                type="submit" 
                className="btn-header"
                style={{ background: '#2563eb', color: 'white', border: 'none', width: '100%', justifyContent: 'center' }}
              >
                Unlock Play
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
