class AMSChatbot {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.loadChatHistory();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div id="ams-chatbot" class="ams-chatbot">
        <!-- Chat Toggle Button -->
        <div class="chatbot-toggle" id="chatbot-toggle">
          <div class="chatbot-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
              <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="currentColor"/>
            </svg>
          </div>
          <span class="chatbot-label">Need Help?</span>
        </div>

        <!-- Chat Window -->
        <div class="chatbot-window" id="chatbot-window">
          <!-- Header -->
          <div class="chatbot-header">
            <div class="chatbot-header-content">
              <div class="chatbot-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                </svg>
              </div>
              <div class="chatbot-title">
                <h3>AMS Assistant</h3>
                <p>Ask me about admissions, fees, location, and more!</p>
              </div>
            </div>
            <button class="chatbot-close" id="chatbot-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <!-- Messages Container -->
          <div class="chatbot-messages" id="chatbot-messages">
            <!-- Welcome message will be added here -->
          </div>

          <!-- Input Area -->
          <div class="chatbot-input-area">
            <div class="chatbot-input-container">
              <input 
                type="text" 
                id="chatbot-input" 
                placeholder="Type your question here..."
                maxlength="500"
              >
              <button class="chatbot-send" id="chatbot-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div class="chatbot-quick-actions">
              <button class="quick-action" data-question="admission dates">📅 Admission Dates</button>
              <button class="quick-action" data-question="fee structure">💰 Fee Structure</button>
              <button class="quick-action" data-question="location">📍 Location</button>
              <button class="quick-action" data-question="contact">📞 Contact Info</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    // Toggle chat window
    document.getElementById('chatbot-toggle').addEventListener('click', () => {
      this.toggleChat();
    });

    // Close chat window
    document.getElementById('chatbot-close').addEventListener('click', () => {
      this.closeChat();
    });

    // Send message on Enter key
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Send message on button click
    document.getElementById('chatbot-send').addEventListener('click', () => {
      this.sendMessage();
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action').forEach(button => {
      button.addEventListener('click', (e) => {
        const question = e.target.dataset.question;
        this.addUserMessage(question);
        this.sendQuestionToAPI(question);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const chatbot = document.getElementById('ams-chatbot');
      if (!chatbot.contains(e.target) && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    document.getElementById('ams-chatbot').classList.add('open');
    document.getElementById('chatbot-input').focus();
    
    // Add welcome message if no messages exist
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer.children.length === 0) {
      this.addBotMessage("Hello! 👋 I'm here to help you with information about Alpha Model's International School. You can ask me about admissions, fees, location, or use the quick buttons below!");
    }
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('ams-chatbot').classList.remove('open');
  }

  addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${this.escapeHtml(message)}</p>
        <span class="message-time">${this.getCurrentTime()}</span>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addBotMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${message.replace(/\n/g, '<br>')}</p>
        <span class="message-time">${this.getCurrentTime()}</span>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message || this.isTyping) return;
    
    // Clear input
    input.value = '';
    
    // Add user message
    this.addUserMessage(message);
    
    // Send to API
    await this.sendQuestionToAPI(message);
  }

  async sendQuestionToAPI(question) {
    this.isTyping = true;
    this.addTypingIndicator();

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: question })
      });

      const data = await response.json();
      
      // Remove typing indicator
      this.removeTypingIndicator();
      
      if (data.ok) {
        this.addBotMessage(data.answer);
      } else {
        this.addBotMessage("I'm sorry, I'm having trouble processing your request right now. Please try again or contact us directly at admissions@alphamodels.in");
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      this.removeTypingIndicator();
      this.addBotMessage("I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly at admissions@alphamodels.in");
    }

    this.isTyping = false;
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadChatHistory() {
    // Load chat history from localStorage if needed
    const history = localStorage.getItem('ams-chatbot-history');
    if (history) {
      try {
        const messages = JSON.parse(history);
        // Optionally restore chat history
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }

  saveChatHistory() {
    // Save chat history to localStorage if needed
    const messagesContainer = document.getElementById('chatbot-messages');
    const messages = Array.from(messagesContainer.children).map(msg => ({
      type: msg.classList.contains('user-message') ? 'user' : 'bot',
      content: msg.querySelector('p').innerHTML,
      time: msg.querySelector('.message-time').textContent
    }));
    
    localStorage.setItem('ams-chatbot-history', JSON.stringify(messages));
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.amsChatbot = new AMSChatbot();
});
