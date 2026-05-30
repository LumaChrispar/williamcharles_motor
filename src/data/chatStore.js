// localStorage-based chat data store for customer ↔ admin messaging

const CONVERSATIONS_KEY = 'wc_chat_conversations';

// Seed with a demo conversation so admin dashboard isn't empty
const INITIAL_CONVERSATIONS = [
  {
    id: 'demo-conv-1',
    customerName: 'James Wilson',
    customerEmail: 'james.wilson@email.com',
    vehicle: {
      make: 'BMW',
      model: 'M3 Competition',
      year: 2023,
      price: 62000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        text: 'James Wilson is interested in purchasing the BMW M3 Competition (2023) — Listed at £62,000',
        timestamp: new Date('2026-05-29T14:30:00').getTime()
      },
      {
        id: 'msg-2',
        sender: 'customer',
        text: 'Hi! I saw this M3 Competition on your site. Is it still available? I would love to arrange a test drive this weekend.',
        timestamp: new Date('2026-05-29T14:31:00').getTime()
      },
      {
        id: 'msg-3',
        sender: 'admin',
        text: 'Hello James! Yes, the M3 Competition is still available. We can arrange a test drive for Saturday morning. Would 10am work for you?',
        timestamp: new Date('2026-05-29T15:10:00').getTime()
      },
      {
        id: 'msg-4',
        sender: 'customer',
        text: 'That sounds perfect! I\'ll be there at 10am. Thank you!',
        timestamp: new Date('2026-05-29T15:15:00').getTime()
      }
    ],
    status: 'active',
    unreadAdmin: 0,
    unreadCustomer: 0,
    createdAt: new Date('2026-05-29T14:30:00').getTime(),
    updatedAt: new Date('2026-05-29T15:15:00').getTime()
  },
  {
    id: 'demo-conv-2',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@gmail.com',
    vehicle: {
      make: 'Mercedes-Benz',
      model: 'AMG GT Night Edition',
      year: 2024,
      price: 110000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80'
    },
    messages: [
      {
        id: 'msg-5',
        sender: 'system',
        text: 'Sarah Chen is interested in purchasing the Mercedes-Benz AMG GT Night Edition (2024) — Listed at £110,000',
        timestamp: new Date('2026-05-30T09:00:00').getTime()
      },
      {
        id: 'msg-6',
        sender: 'customer',
        text: 'Hello, I\'m very interested in the AMG GT. Can you tell me more about the service history and any warranty options?',
        timestamp: new Date('2026-05-30T09:01:00').getTime()
      }
    ],
    status: 'active',
    unreadAdmin: 1,
    unreadCustomer: 0,
    createdAt: new Date('2026-05-30T09:00:00').getTime(),
    updatedAt: new Date('2026-05-30T09:01:00').getTime()
  }
];

function loadConversations() {
  const data = localStorage.getItem(CONVERSATIONS_KEY);
  if (!data) {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    return INITIAL_CONVERSATIONS;
  }
  return JSON.parse(data);
}

function saveConversations(conversations) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

/** Get all conversations, sorted newest first */
export function getConversations() {
  return loadConversations().sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Get a single conversation by ID */
export function getConversation(id) {
  return loadConversations().find(c => c.id === id) || null;
}

/** Create a new conversation when customer initiates a chat about a vehicle */
export function createConversation({ customerName, customerEmail, vehicle }) {
  const conversations = loadConversations();
  const id = 'conv-' + Date.now();
  const now = Date.now();
  const systemMessage = {
    id: 'msg-' + now,
    sender: 'system',
    text: `${customerName} is interested in purchasing the ${vehicle.make} ${vehicle.model} (${vehicle.year}) — Listed at £${vehicle.price.toLocaleString()}`,
    timestamp: now
  };

  const newConversation = {
    id,
    customerName,
    customerEmail,
    vehicle: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      image: vehicle.image || vehicle.images?.[0] || ''
    },
    messages: [systemMessage],
    status: 'active',
    unreadAdmin: 1,
    unreadCustomer: 0,
    createdAt: now,
    updatedAt: now
  };

  conversations.unshift(newConversation);
  saveConversations(conversations);

  // Store active conversation ID for customer widget
  localStorage.setItem('wc_active_conversation', id);
  localStorage.setItem('wc_customer_name', customerName);
  localStorage.setItem('wc_customer_email', customerEmail);

  return newConversation;
}

/** Add a message to a conversation */
export function addMessage(conversationId, { sender, text }) {
  const conversations = loadConversations();
  const conv = conversations.find(c => c.id === conversationId);
  if (!conv) return null;

  const now = Date.now();
  const message = {
    id: 'msg-' + now + '-' + Math.random().toString(36).substr(2, 4),
    sender,
    text,
    timestamp: now
  };

  conv.messages.push(message);
  conv.updatedAt = now;

  // Track unread counts
  if (sender === 'customer') {
    conv.unreadAdmin = (conv.unreadAdmin || 0) + 1;
  } else if (sender === 'admin') {
    conv.unreadCustomer = (conv.unreadCustomer || 0) + 1;
  }

  saveConversations(conversations);
  return message;
}

/** Mark all messages in a conversation as read by a role */
export function markAsRead(conversationId, role) {
  const conversations = loadConversations();
  const conv = conversations.find(c => c.id === conversationId);
  if (!conv) return;

  if (role === 'admin') {
    conv.unreadAdmin = 0;
  } else {
    conv.unreadCustomer = 0;
  }
  saveConversations(conversations);
}

/** Get total unread count for admin */
export function getAdminUnreadCount() {
  return loadConversations().reduce((sum, c) => sum + (c.unreadAdmin || 0), 0);
}

/** Get the customer's active conversation ID */
export function getActiveConversationId() {
  return localStorage.getItem('wc_active_conversation');
}

/** Get stored customer info */
export function getCustomerInfo() {
  return {
    name: localStorage.getItem('wc_customer_name') || '',
    email: localStorage.getItem('wc_customer_email') || ''
  };
}

/** Delete a conversation */
export function deleteConversation(id) {
  const conversations = loadConversations().filter(c => c.id !== id);
  saveConversations(conversations);
  // If this was the active conversation, clear it
  if (localStorage.getItem('wc_active_conversation') === id) {
    localStorage.removeItem('wc_active_conversation');
  }
  return conversations;
}
