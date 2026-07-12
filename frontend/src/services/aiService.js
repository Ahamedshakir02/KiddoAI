// aiService.js - Routes Chat/OCR queries to the secure Backend container
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Sends conversation input and image attachment to our backend secure proxy.
 * 
 * @param {string} textInput - Child's question
 * @param {string} imageBase64 - Compressed image base64 data (optional)
 * @param {string} buddyId - Target persona (sparky, luna, owl, coco)
 * @returns {Promise<string>} - The AI buddy's response text
 */
export const fetchAIResponse = async (textInput, imageBase64, buddyId) => {
  const endpoint = `${BACKEND_URL}/api/chat`;

  const payload = {
    message: textInput,
    image: imageBase64,
    buddyId: buddyId
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
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.text || errorMessage;
      } catch (e) {
        // Fallback if response is not JSON
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text || "Beep boop! My circuits got a blank message. Let's try again! 🤖";
  } catch (error) {
    console.error("[Backend Connector Error]:", error);
    
    // Help parents/teachers understand connection problems
    return `Oh no! 🤖 Sparky detected a connection hiccup: "${error.message}". ` + 
           `Please verify that the backend proxy server is running at ${BACKEND_URL}!`;
  }
};
