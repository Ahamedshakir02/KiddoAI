import React, { useState } from 'react';
import { HelpCircle, Star, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { speakText } from '../services/voiceService';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    subject: 'Science',
    question: 'Which planet is known as the Red Planet? 🪐',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 1, // Mars
    hint: 'It is named after the Roman god of war and has lots of iron dust!',
    congrats: 'Beep boop! You got it! Mars has reddish iron oxide dust all over it. Outstanding science knowledge! 🚀'
  },
  {
    id: 2,
    subject: 'Math',
    question: 'If you have 4 apples and you get 5 more, how many apples do you have? 🍎',
    options: ['7 Apples', '8 Apples', '9 Apples', '10 Apples'],
    answer: 2, // 9
    hint: 'Count on your fingers: 4 plus 5!',
    congrats: 'Hoo-hoo! Excellent calculations. 4 + 5 is indeed 9! You are a Math Champ! 🦉'
  },
  {
    id: 3,
    subject: 'Language',
    question: 'Which of these is an ACTION word (a Verb)? 🏃‍♂️',
    options: ['Apple', 'Sleepy', 'Run', 'Soft'],
    answer: 2, // Run
    hint: 'It is something that you DO with your body!',
    congrats: 'Lovely! "Run" is a verb because it is an action! You are a true wordsmith. 🧚‍♀️'
  },
  {
    id: 4,
    subject: 'Science',
    question: 'How many legs does an insect have? 🐜',
    options: ['4 legs', '6 legs', '8 legs', '10 legs'],
    answer: 1, // 6 legs
    hint: 'Spiders have 8 legs, but insects have fewer!',
    congrats: 'Bzzzt! Six legs is correct! Spiders are arachnids with 8, but ants and bees have 6. Great biology trivia! 🤖'
  },
  {
    id: 5,
    subject: 'Logic',
    question: 'What gets wetter the more it dries? 🧼',
    options: ['A sponge', 'A towel', 'A puddle', 'Rain'],
    answer: 1, // A towel
    hint: 'You use this item after you take a bath!',
    congrats: 'Giggle! A towel! Ooh-ooh-ah-ah! You solved my tricky monkey riddle! 🐵'
  },
  {
    id: 6,
    subject: 'Math',
    question: 'What is 8 × 3? 🔢',
    options: ['20', '22', '24', '26'],
    answer: 2, // 24
    hint: 'Add 8 three times, or count by threes!',
    congrats: 'Hoo-hoo! Spot on! Eight times three is 24. Math wizardry! 🦉'
  },
  {
    id: 7,
    subject: 'Geography',
    question: 'Which is the largest ocean on our Earth? 🌊',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    answer: 2, // Pacific
    hint: 'Its name means "peaceful", and it covers more than 30% of the Earth!',
    congrats: 'Wow! The Pacific Ocean is correct. It is larger than all of Earth\'s land area combined! 🌍'
  }
];

export default function LearnQuiz({ onEarnStars, activeBuddy }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleOptionClick = (optIdx) => {
    if (isAnswered) return;
    
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQ.answer;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      onEarnStars(15); // Earn 15 stars per correct answer!
      speakText(currentQ.congrats, activeBuddy);
    } else {
      speakText("Oh, almost! Try reading the hint and let's try the next one together!", activeBuddy);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOpt(null);
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={24} style={{ color: 'var(--buddy-color-primary)' }} />
          <h2 className="kid-font" style={{ fontSize: '24px' }}>Joy Educational Quiz</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#d1fae5', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', color: '#065f46', fontWeight: 'bold' }}>
          <Sparkles size={14} />
          <span>Score: {quizScore}</span>
        </div>
      </div>

      <div className="quiz-container">
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', background: 'var(--buddy-color-secondary)', color: 'var(--buddy-color-primary)', padding: '4px 10px', borderRadius: '100px', fontWeight: 'bold' }}>
          Subject: {currentQ.subject}
        </span>

        <div className="quiz-card">
          <p className="quiz-question kid-font">{currentQ.question}</p>

          <div className="quiz-options">
            {currentQ.options.map((opt, idx) => {
              let classNm = 'quiz-option';
              if (isAnswered) {
                if (idx === currentQ.answer) classNm += ' correct';
                else if (selectedOpt === idx) classNm += ' incorrect';
              }
              return (
                <button
                  key={idx}
                  className={classNm}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div style={{
            background: selectedOpt === currentQ.answer ? '#ecfdf5' : '#fff1f2',
            border: `1.5px solid ${selectedOpt === currentQ.answer ? '#10b981' : '#f43f5e'}`,
            borderRadius: '16px',
            padding: '16px',
            maxWidth: '500px',
            textAlign: 'left',
            animation: 'pop-up 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold', color: selectedOpt === currentQ.answer ? '#065f46' : '#991b1b' }}>
              {selectedOpt === currentQ.answer ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Correct! (+15 Stars)</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} />
                  <span>Oops! Not quite correct.</span>
                </>
              )}
            </div>
            <p style={{ fontSize: '14px', color: '#334155' }}>
              {selectedOpt === currentQ.answer 
                ? currentQ.congrats 
                : `No worries! The correct answer was "${currentQ.options[currentQ.answer]}". Remember: ${currentQ.hint}`}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          {!isAnswered && (
            <button
              className="btn-header"
              onClick={() => setShowHint(!showHint)}
              style={{ background: '#fef3c7', color: '#d97706', borderColor: '#fde68a' }}
            >
              💡 Need a Hint?
            </button>
          )}

          {isAnswered && (
            <button className="btn-header btn-send" onClick={handleNext} style={{ border: 'none' }}>
              Next Question 👉
            </button>
          )}
        </div>

        {showHint && !isAnswered && (
          <div style={{
            background: '#fffbeb',
            border: '1px dashed #f59e0b',
            borderRadius: '12px',
            padding: '12px 18px',
            fontSize: '13px',
            color: '#b45309',
            maxWidth: '400px',
            marginTop: '12px',
            animation: 'pop-up 0.2s ease-out'
          }}>
            <strong>Hint:</strong> {currentQ.hint}
          </div>
        )}
      </div>
    </div>
  );
}
export { QUIZ_QUESTIONS };
