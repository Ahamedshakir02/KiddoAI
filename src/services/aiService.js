// aiService.js - Simulated Local AI & Gemini API connector for Joy

// Personalities/System Instructions for Gemini
const BUDDY_PROMPTS = {
  sparky: `You are Sparky, a friendly and curious robot companion for kids. 
You love science, tech, space, and explaining how things work. 
Use cool mechanical words and sounds like *beep boop*, *click-clack*, or *bzzzt*! 
Keep explanations super simple, safe, encouraging, and full of emojis! 
If the child speaks in a language other than English, reply in their language.`,

  luna: `You are Luna, a magical storytelling fairy companion for kids. 
You love art, reading, creative writing, and using your imagination. 
Speak in a gentle, poetic, encouraging, and magical tone. 
Help kids imagine characters, finish stories, or make up poems. 
Use lots of magic and fairy emojis like 🧚‍♀️✨🌟🎨. 
If the child speaks in a language other than English, reply in their language.`,

  owl: `You are Professor Owl, a wise, caring, and patient teacher companion for kids. 
You love math, grammar, history, and solving riddles. 
Explain educational doubts step-by-step, making it super easy to understand. 
Ask encouraging check-in questions or riddles. 
Use emojis like 🦉📚✏️💡. 
If the child speaks in a language other than English, reply in their language.`,

  coco: `You are Coco, a funny, cheeky, and playful monkey companion for kids. 
You love jokes, funny animal facts, wordplay, and simple games. 
Keep your responses high-energy, short, giggly, and silly! 
Ask them funny questions or give them simple word puzzles. 
Use emojis like 🐵🍌🌴🤪. 
If the child speaks in a language other than English, reply in their language.`
};

// Simulated responses for local offline mode
const LOCAL_RESPONSES = {
  sparky: [
    "Beep boop! That is an awesome question! Science is like a superpower. Did you know that space is completely silent? What kind of science do you want to learn about today? 🚀",
    "Bzzzt! Energy cannot be destroyed, only changed! Just like when you eat food and run around! ⚡ What is your favorite gadget?",
    "Click-clack! I love computers! Did you know computers only speak in 1s and 0s? That's binary! Binary codes are like secret messages! 💻"
  ],
  luna: [
    "Oh, what a beautiful thought! ✨ Let's weave a magical story about it. Once upon a time, in a forest made of cotton candy... what do you think happened next? 🧚‍♀️",
    "Drawing and painting are ways to speak without using words! 🎨 Draw anything you like on the Whiteboard, and let's make a tale out of it!",
    "Letters are like little keys that unlock the doors of imagination! 📚 Do you have a favorite book or fairy tale you like to read?"
  ],
  owl: [
    "Hoo-hoo! A very wise question. 🦉 Let's break it down together. In math, numbers are like blocks. If we add 2 blocks and 3 blocks, we get 5! Simple, isn't it? Let me know if you want to try a riddle!",
    "Reading and spelling are just like puzzles! Every letter fits together to make a word picture. What subject would you like to practice today? 📝",
    "History is like a time machine! 🕰️ It tells us stories of brave explorers and amazing inventions. Who is your favorite historical hero?"
  ],
  coco: [
    "Ooh-ooh-ah-ah! 🐵 That's so funny! Here is a joke: Why did the banana go to the doctor? Because it wasn't peeling well! Haha! 🍌 Got a joke for me?",
    "Giggle! Let's play a game! I spy with my little eye... something yellow and tasty. What is it? 🍌🌴",
    "Boing! Monkeys love jumping! Did you know that some monkeys can use tools just like humans? Pretty smart, right? 🐒"
  ]
};

// Simulated AI fallback selector
const getSimulatedResponse = (text, buddyId) => {
  const responses = LOCAL_RESPONSES[buddyId] || LOCAL_RESPONSES['sparky'];
  
  // Try to find keyword matches in the text
  const cleanText = text.toLowerCase();
  
  if (cleanText.includes("hello") || cleanText.includes("hi") || cleanText.includes("hey")) {
    if (buddyId === 'sparky') return "Beep boop! Hello friend! I am Sparky your science buddy. Ready to discover something cool? 🤖";
    if (buddyId === 'luna') return "Hello, sweet friend! ✨ I was just designing a dream star. What magical things shall we imagine today? 🧚‍♀️";
    if (buddyId === 'owl') return "Hoo-hoo! Hello there. 🦉 I am Professor Owl. Let's learn something new and exciting today!";
    if (buddyId === 'coco') return "Ooh-ooh-ah-ah! Hi hi! Coco in the house! 🐵 Let's play, tell jokes, and have tons of fun!";
  }
  
  if (cleanText.includes("joke")) {
    return "Ooh-ooh! Coco's specialty! Why do birds fly south for winter? Because it's too far to walk! Haha! 🐧";
  }

  if (cleanText.includes("math") || cleanText.includes("sum") || cleanText.includes("+") || cleanText.includes("=")) {
    return "Hoo-hoo! 🦉 Math is the language of the universe. For example, did you know that zero (0) was invented long ago to show nothingness? What math problem can I help you solve?";
  }

  if (cleanText.includes("science") || cleanText.includes("star") || cleanText.includes("planet") || cleanText.includes("water")) {
    return "Beep boop! 🚀 Science fact: Water can exist as a solid (ice), a liquid (water), and a gas (steam)! Isn't that cool?";
  }

  if (cleanText.includes("story") || cleanText.includes("princess") || cleanText.includes("dragon")) {
    return "Once upon a time, there was a tiny dragon who blew bubbles instead of fire! 🫧 He wanted to make friends. What should we name him? ✨";
  }

  // Fallback to random response from category
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
};

// Main function to fetch AI response
export const fetchAIResponse = async (textInput, imageBase64, buddyId, apiKey = null) => {
  // If no API key is set, use local simulation mode
  if (!apiKey || apiKey.trim() === "") {
    return new Promise((resolve) => {
      setTimeout(() => {
        let simulatedRes = getSimulatedResponse(textInput || "", buddyId);
        if (imageBase64) {
          simulatedRes = `[Offline Mode] 🎨 I saw your image! (Connect your Gemini API Key in the Parent Panel to enable real handwriting OCR). Here is what ${buddyId} thinks: ${simulatedRes}`;
        }
        resolve(simulatedRes);
      }, 1000);
    });
  }

  // Construct Gemini multimodal API payload
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const systemInstruction = BUDDY_PROMPTS[buddyId] || BUDDY_PROMPTS['sparky'];
  
  const parts = [];
  
  // If there's an image attachment
  if (imageBase64) {
    // Strip standard base64 header if present (e.g. data:image/jpeg;base64,)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
    
    // Add custom prompt helper for image inputs
    parts.push({
      text: `Analyze this image (which could contain a child's drawing, sketch, writing, homework, or equation). 
First, recognize and write out what you see or what is written in the image. If the child's writing or lines are messy or bad, be extremely encouraging, patient, and write out a clear transcription. 
Second, explain/answer/give feedback in a very simple, clear, kid-friendly way.
User text question: ${textInput || "Can you look at my writing/drawing?"}`
    });
  } else {
    // Standard text query
    parts.push({
      text: textInput
    });
  }

  const payload = {
    contents: [
      {
        parts: parts
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstruction
        }
      ]
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_LOW_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_LOW_AND_ABOVE"
      }
    ]
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText) {
      throw new Error("No response text found in Gemini response.");
    }
    
    return aiText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Oh no! 🤖 Sparky detected a little system hiccup: "${error.message}". Let's try typing that again!`;
  }
};
