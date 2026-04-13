/* ============================================================
   AI CHATBOT WIDGET — Gilgit Adventure Treks
   ============================================================ */

(function() {
  'use strict';

  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  let isOpen = false;

  // Toggle chatbot window
  chatToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatToggle.classList.toggle('active', isOpen);
    chatWindow.hidden = !isOpen;

    if (isOpen) {
      chatInput.focus();
    }
  });

  // Send message
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    const typingEl = showTyping();

    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Remove typing indicator
      if (typingEl && typingEl.parentNode) {
        typingEl.remove();
      }

      // Add bot response
      addMessage(data.response || data.reply || 'Sorry, I couldn\'t process that.', 'bot');
    } catch (error) {
      console.error('Chat error:', error);

      // Remove typing indicator
      if (typingEl && typingEl.parentNode) {
        typingEl.remove();
      }

      // Add error message
      addMessage('Sorry, I\'m having trouble connecting right now. Please try again or contact us directly!', 'bot');
    }
  });

  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👤';

    const content = document.createElement('div');
    content.className = 'message-content';

    const p = document.createElement('p');
    p.textContent = text;
    content.appendChild(p);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-message';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(indicator);

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return typingDiv;
  }

  // Close chatbot when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !chatToggle.contains(e.target) && !chatWindow.contains(e.target)) {
      isOpen = false;
      chatToggle.classList.remove('active');
      chatWindow.hidden = true;
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      chatToggle.classList.remove('active');
      chatWindow.hidden = true;
    }
  });

})();
