import { useState, useEffect, useRef } from 'react';
import {
  getConversation,
  createConversation,
  addMessage,
  markAsRead,
  getActiveConversationId,
  getCustomerInfo,
  subscribeToConversations,
  updateConversationVehicle
} from '../data/chatStore';
import './ChatWidget.css';

export default function ChatWidget({ vehicleToChat, onChatOpened }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'chat'
  const [conversation, setConversation] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [chatInput, setChatInput] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // On mount, check for existing active conversation
  useEffect(() => {
    async function loadActive() {
      const activeId = getActiveConversationId();
      if (activeId) {
        const conv = await getConversation(activeId);
        if (conv) {
          setConversation(conv);
          setStep('chat');
          const info = getCustomerInfo();
          setFormData({ name: info.name, email: info.email });
        }
      }
    }
    loadActive();
  }, []);

  // When vehicleToChat is set externally (from VehicleDetail), open widget
  useEffect(() => {
    async function handleVehicleToChat() {
      if (vehicleToChat) {
        setIsOpen(true);
        const activeId = getActiveConversationId();
        const info = getCustomerInfo();
        if (activeId && info.name) {
          // Already have an active conversation, just send car details as a new message
          const conv = await getConversation(activeId);
          if (conv) {
            await updateConversationVehicle(activeId, vehicleToChat);
            await addMessage(activeId, {
              sender: 'customer',
              text: `Hi! I'm interested in the ${vehicleToChat.make} ${vehicleToChat.model} (${vehicleToChat.year}) listed at £${vehicleToChat.price.toLocaleString()}. Can you tell me more?`
            });
            const updated = await getConversation(activeId);
            setConversation(updated);
            setStep('chat');
            if (onChatOpened) onChatOpened();
            return;
          }
        }
        // No active conversation, show form
        setStep('form');
      }
    }
    handleVehicleToChat();
  }, [vehicleToChat]);

  // Subscribe to real-time messages instead of polling
  useEffect(() => {
    if (!conversation) return;
    const unsubscribe = subscribeToConversations(async () => {
      const updated = await getConversation(conversation.id);
      if (updated && updated.messages.length !== conversation.messages.length) {
        setConversation(updated);
        if (!isOpen) setHasNewMessage(true);
      }
    });
    return unsubscribe;
  }, [conversation, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages?.length, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && step === 'chat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, step]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const vehicle = vehicleToChat || {
      make: 'General',
      model: 'Inquiry',
      year: new Date().getFullYear(),
      price: 0,
      image: ''
    };

    const conv = await createConversation({
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      vehicle
    });

    if (!conv) return;

    // Send initial customer message if there's a vehicle
    if (vehicleToChat) {
      await addMessage(conv.id, {
        sender: 'customer',
        text: `Hi! I'm interested in the ${vehicle.make} ${vehicle.model} (${vehicle.year}) listed at £${vehicle.price.toLocaleString()}. Can you tell me more about this vehicle?`
      });
    }

    const updated = await getConversation(conv.id);
    setConversation(updated);
    setStep('chat');
    if (onChatOpened) onChatOpened();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !conversation) return;
    const currentInput = chatInput.trim();
    setChatInput(''); // clear immediately for better UX
    await addMessage(conversation.id, { sender: 'customer', text: currentInput });
    const updated = await getConversation(conversation.id);
    setConversation(updated);
  };

  const toggleWidget = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
      if (conversation) {
        await markAsRead(conversation.id, 'customer');
      }
    }
  };

  return (
    <div className="chat-widget-wrapper">
      {/* Chat Panel */}
      <div className={`chat-widget-panel${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="chat-widget-header">
          <div className="chat-widget-header-info">
            <div className="chat-widget-header-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <h3>williamcharles_motor</h3>
              <span className="chat-widget-status">
                <span className="status-dot" /> Typically replies instantly
              </span>
            </div>
          </div>
          <button className="chat-widget-close" onClick={() => setIsOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="chat-widget-form-container">
            <div className="chat-widget-welcome">
              <div className="welcome-emoji">👋</div>
              <h3>Welcome!</h3>
              <p>Start a conversation with our team. We're here to help you find your perfect car.</p>
            </div>
            <form onSubmit={handleFormSubmit} className="chat-widget-form">
              <div className="chat-form-group">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="chat-form-group">
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="chat-form-submit">
                Start Chat
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Chat Step */}
        {step === 'chat' && conversation && (
          <>
            <div className="chat-widget-messages">
              {conversation.messages.map(msg => (
                <div key={msg.id} className={`chat-msg chat-msg-${msg.sender}`}>
                  {msg.sender === 'system' ? (
                    <div className="chat-msg-system">
                      <span>🚗</span> {msg.text}
                    </div>
                  ) : (
                    <div className="chat-msg-bubble">
                      <p>{msg.text}</p>
                      <span className="chat-msg-time">
                        {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="chat-widget-input" onSubmit={handleSendMessage}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" disabled={!chatInput.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </>
        )}
      </div>

      {/* Floating Button */}
      <button className={`chat-widget-fab${hasNewMessage ? ' has-new' : ''}`} onClick={toggleWidget}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        {hasNewMessage && <span className="chat-fab-badge" />}
      </button>
    </div>
  );
}
