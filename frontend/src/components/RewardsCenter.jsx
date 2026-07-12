import React from 'react';
import { Award, Star, Compass, Award as MedalIcon } from 'lucide-react';

export const ALL_BADGES = [
  {
    id: 'badge_science',
    name: 'Science Explorer',
    emoji: '🚀',
    desc: 'Asked Sparky a science question.',
    hint: 'Chat with Sparky'
  },
  {
    id: 'badge_story',
    name: 'Story Wizard',
    emoji: '🧚‍♀️',
    desc: 'Created a magical tale with Luna.',
    hint: 'Chat with Luna'
  },
  {
    id: 'badge_math',
    name: 'Math Champion',
    emoji: '🦉',
    desc: 'Solved a quiz correctly.',
    hint: 'Complete a Quiz'
  },
  {
    id: 'badge_joke',
    name: 'Joker Monkey',
    emoji: '🍌',
    desc: 'Shared a funny laugh with Coco.',
    hint: 'Chat with Coco'
  },
  {
    id: 'badge_draw',
    name: 'Creative Writer',
    emoji: '✏️',
    desc: 'Used the drawing canvas.',
    hint: 'Ask Buddy about a sketch'
  },
  {
    id: 'badge_star_100',
    name: 'Star Achiever',
    emoji: '🌟',
    desc: 'Collected 100 total stars!',
    hint: 'Earn 100 stars'
  }
];

export default function RewardsCenter({ stars, unlockedBadges = [] }) {
  const nextMilestone = stars >= 100 ? 250 : stars >= 50 ? 100 : 50;
  const progressPercent = Math.min(100, Math.floor((stars / nextMilestone) * 100));

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Award size={24} style={{ color: 'var(--buddy-color-primary)' }} />
        <h2 className="kid-font" style={{ fontSize: '24px' }}>My Reward Center</h2>
      </div>

      {/* Progress Cards */}
      <div style={{
        background: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
        border: '3px dashed #f59e0b',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Star size={36} fill="#f59e0b" color="#f59e0b" style={{ animation: 'bounce-gentle 2s infinite' }} />
          <span className="kid-font" style={{ fontSize: '32px', color: '#b45309' }}>{stars} Stars!</span>
        </div>
        <p style={{ fontSize: '14px', color: '#b45309', fontWeight: '600', marginBottom: '12px' }}>
          You are doing an amazing job! 🌟
        </p>

        {/* Custom Progress Bar */}
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#b45309', marginBottom: '4px', fontWeight: 'bold' }}>
            <span>Progress to {nextMilestone} Stars</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '16px', background: 'rgba(251, 191, 36, 0.3)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(251, 191, 36, 0.5)' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: '#f59e0b', 
                borderRadius: '10px',
                transition: 'width 0.8s ease-out'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <h3 className="kid-font" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '12px' }}>
        🏆 My Badges ({unlockedBadges.length} / {ALL_BADGES.length})
      </h3>
      
      <div className="rewards-grid">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`badge-card ${isUnlocked ? 'unlocked' : ''}`}
            >
              <span className="badge-icon">{badge.emoji}</span>
              <div className="badge-name kid-font" style={{ color: isUnlocked ? '#1e293b' : '#94a3b8' }}>
                {badge.name}
              </div>
              <div className="badge-desc" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                {isUnlocked ? badge.desc : `🔒 Hint: ${badge.hint}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
