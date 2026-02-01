const API_KEY = "YOUR_API_KEY_HERE"; // Put your secret key here

const chatBox = document.getElementById('messages');
const userInput = document.getElementById('user-input');

// This allows the user to press "Enter" to send a message
userInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    askAI();
  }
});

async function askAI() {
  const message = userInput.value.trim();
  if (message === "") return;

  // 1. Display User Message
  appendMessage('user', message);
  userInput.value = "";

  // 2. Show a "Thinking..." indicator
  const loadingId = "loading-" + Date.now();
  appendMessage('tutor', "Thinking...", loadingId);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert AI Tutor for students in grades 8 to 12. 
                   - Use simple language but remain academically accurate.
                   - If a student asks for an answer, don't just give it. Guide them step-by-step.
                   - Use Markdown for formatting (bold, bullet points, and math).
                   - Current Question: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;

    // 3. Replace "Thinking..." with the actual answer
    const loadingElement = document.getElementById(loadingId);
    // marked.parse() turns Markdown into beautiful HTML
    loadingElement.innerHTML = `<b>Tutor:</b><br>${marked.parse(aiText)}`;

  } catch (error) {
    console.error("Error:", error);
    document.getElementById(loadingId).innerText = "Tutor: Sorry, I'm having trouble connecting. Check your API key!";
  }

  // 4. Auto-scroll to the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(sender, text, id = null) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  if (id) msgDiv.id = id;
  
  if (sender === 'user') {
    msgDiv.innerText = text;
  } else {
    msgDiv.innerHTML = `<b>Tutor:</b><br>${text}`;
  }
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
