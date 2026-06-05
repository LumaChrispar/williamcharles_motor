import { supabase } from './supabaseClient';

// We still use localStorage to track the customer's active session on this device
export function getActiveConversationId() {
  return localStorage.getItem('wc_active_conversation');
}

export function getCustomerInfo() {
  return {
    name: localStorage.getItem('wc_customer_name') || '',
    email: localStorage.getItem('wc_customer_email') || ''
  };
}

// -------------------------------------------------------------
// Asynchronous Operations using Supabase
// -------------------------------------------------------------

export async function getConversations() {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*, messages(*)')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  
  // Sort messages in each conversation by created_at ascending
  if (conversations) {
    conversations.forEach(conv => {
      if (conv.messages) {
        conv.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        // map Supabase fields back to frontend fields
        conv.messages = conv.messages.map(m => ({
          id: m.id,
          sender: m.sender,
          text: m.text,
          timestamp: new Date(m.created_at).getTime()
        }));
      } else {
        conv.messages = [];
      }
      
      conv.customerName = conv.customer_name;
      conv.customerEmail = conv.customer_email;
      conv.unreadAdmin = conv.unread_admin;
      conv.unreadCustomer = conv.unread_customer;
      conv.updatedAt = new Date(conv.updated_at).getTime();
    });
  }

  return conversations || [];
}

export async function getConversation(id) {
  const { data: conv, error } = await supabase
    .from('conversations')
    .select('*, messages(*)')
    .eq('id', id)
    .single();

  if (error || !conv) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  if (conv.messages) {
    conv.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    conv.messages = conv.messages.map(m => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      timestamp: new Date(m.created_at).getTime()
    }));
  } else {
    conv.messages = [];
  }

  conv.customerName = conv.customer_name;
  conv.customerEmail = conv.customer_email;
  conv.unreadAdmin = conv.unread_admin;
  conv.unreadCustomer = conv.unread_customer;
  conv.updatedAt = new Date(conv.updated_at).getTime();

  return conv;
}

export async function createConversation({ customerName, customerEmail, vehicle }) {
  const { data: conv, error } = await supabase
    .from('conversations')
    .insert([{
      customer_name: customerName,
      customer_email: customerEmail,
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        image: vehicle.image || vehicle.images?.[0] || ''
      },
      unread_admin: 1,
      unread_customer: 0,
      status: 'active'
    }])
    .select()
    .single();

  if (error || !conv) {
    console.error('Error creating conversation:', error);
    return null;
  }

  const systemMessageText = `${customerName} is interested in purchasing the ${vehicle.make} ${vehicle.model} (${vehicle.year}) — Listed at £${vehicle.price.toLocaleString()}`;

  await supabase
    .from('messages')
    .insert([{
      conversation_id: conv.id,
      sender: 'system',
      text: systemMessageText
    }]);

  // Store active conversation ID locally
  localStorage.setItem('wc_active_conversation', conv.id);
  localStorage.setItem('wc_customer_name', customerName);
  localStorage.setItem('wc_customer_email', customerEmail);

  return getConversation(conv.id);
}

export async function addMessage(conversationId, { sender, text }) {
  const { data: msg, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      sender,
      text
    }])
    .select()
    .single();

  if (error || !msg) {
    console.error('Error adding message:', error);
    return null;
  }

  // Update unread counts and updated_at on the conversation
  const { data: conv } = await supabase
    .from('conversations')
    .select('unread_admin, unread_customer')
    .eq('id', conversationId)
    .single();

  if (conv) {
    let unreadAdmin = conv.unread_admin || 0;
    let unreadCustomer = conv.unread_customer || 0;

    if (sender === 'customer') {
      unreadAdmin += 1;
    } else if (sender === 'admin') {
      unreadCustomer += 1;
    }

    await supabase
      .from('conversations')
      .update({
        unread_admin: unreadAdmin,
        unread_customer: unreadCustomer,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);
  }

  return {
    id: msg.id,
    sender: msg.sender,
    text: msg.text,
    timestamp: new Date(msg.created_at).getTime()
  };
}

export async function markAsRead(conversationId, role) {
  const updates = {};
  if (role === 'admin') {
    updates.unread_admin = 0;
  } else {
    updates.unread_customer = 0;
  }

  await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId);
}

export async function getAdminUnreadCount() {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('unread_admin');

  if (error || !conversations) return 0;
  return conversations.reduce((sum, c) => sum + (c.unread_admin || 0), 0);
}

export async function deleteConversation(id) {
  await supabase
    .from('conversations')
    .delete()
    .eq('id', id);

  if (localStorage.getItem('wc_active_conversation') === id) {
    localStorage.removeItem('wc_active_conversation');
  }
}

export async function clearMessages(conversationId) {
  await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId);
}

export async function clearAllConversations() {
  await supabase
    .from('conversations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // hack to delete all

  localStorage.removeItem('wc_active_conversation');
}

// -------------------------------------------------------------
// Realtime Subscriptions
// -------------------------------------------------------------

export function subscribeToConversations(callback) {
  const channel = supabase.channel('conversations_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, callback)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
