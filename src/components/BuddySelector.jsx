import React from 'react';
import { speakText } from '../services/voiceService';

export const BUDDIES = [
  {
    id: 'sparky',
    name: 'Sparky',
    emoji: '🤖',
    role: 'Science & Gadgets',
    description: 'Beep boop! Let\'s learn about outer space, coding, and volcanoes!',
    theme: {
      primary: 'var(--sparky-primary)',
      secondary: 'var(--sparky-secondary)',
      glow: 'var(--sparky-glow)'
    },
    intro: 'Beep boop! System active! I am Sparky, your science assistant. What shall we explore today?'
  },
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🧚‍♀️',
    role: 'Stories & Drawing',
    description: '✨ Hello sweet friend! Let\'s read books, write stories, and draw together.',
    theme: {
      primary: 'var(--luna-primary)',
      secondary: 'var(--luna-secondary)',
      glow: 'var(--luna-glow)'
    },
    intro: 'Hello there, sweet friend! I am Luna. Let\'s write a magical story together.'
  },
  {
    id: 'owl',
    name: 'Professor Owl',
    emoji: '🦉',
    role: 'Math & Logic Helper',
    description: 'Hoo-hoo! I love math puzzles, spelling checks, and historical adventures!',
    theme: {
      primary: 'var(--owl-primary)',
      secondary: 'var(--owl-secondary)',
      glow: 'var(--owl-glow)'
    },
    intro: 'Hoo-hoo! Greetings, young learner. I am Professor Owl. Let\'s practice some puzzles today!'
  },
  {
    id: 'coco',
    name: 'Coco',
    emoji: '🐵',
    role: 'Jokes & Riddles',
    description: 'Ooh-ooh-ah-ah! Ready for jokes, funny trivia, and bananas?',
    theme: {
      primary: 'var(--coco-primary)',
      secondary: 'var(--coco-secondary)',
      glow: 'var(--coco-glow)'
    },
    intro: 'Ooh-ooh-ah-ah! Coco in the house! Got any funny jokes for me?'
  }
];

export default function BuddySelector({ selectedBuddyId, onSelectBuddy }) {
  const handleSelect = (buddy) => {
    onSelectBuddy(buddy.id);
    
    // Set HSL CSS variables dynamically on the document root
    document.documentElement.style.setProperty('--buddy-color-primary', buddy.theme.primary);
    document.documentElement.style.setProperty('--buddy-color-secondary', buddy.theme.secondary);
    document.documentElement.style.setProperty('--buddy-color-glow', buddy.theme.glow);

    // Speak introduction
    speakText(buddy.intro, buddy.id);
  };

  return (
    <div className="panel">
      <h3 className="kid-font" style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-primary)' }}>
        ✨ Choose Your Buddy!
      </h3>
      <div className="buddy-grid">
        {BUDDIES.map((buddy) => (
          <div
            key={buddy.id}
            className={`buddy-card ${selectedBuddyId === buddy.id ? 'active' : ''}`}
            onClick={() => handleSelect(buddy)}
            style={{
              '--buddy-color-primary': buddy.theme.primary,
              '--buddy-color-secondary': buddy.theme.secondary,
              '--buddy-color-glow': buddy.theme.glow
            }}
          >
            <span className="buddy-avatar-lg">{buddy.emoji}</span>
            <span className="buddy-name kid-font">{buddy.name}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>
              {buddy.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export { BUDDIES as BUDDY_LIST };
