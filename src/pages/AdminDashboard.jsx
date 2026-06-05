import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getConversations, 
  getConversation, 
  addMessage, 
  markAsRead, 
  deleteConversation, 
  getAdminUnreadCount, 
  clearMessages, 
  clearAllConversations,
  subscribeToConversations
} from '../data/chatStore';
import { getInquiries, updateInquiryStatus, deleteInquiry, getVipLeads } from '../data/leads';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [vipLeads, setVipLeads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);

  // Auth guard
  useEffect(() => {
    if (localStorage.getItem('wc_admin_auth') !== 'true') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      const convs = await getConversations();
      setConversations(convs);
      
      const count = await getAdminUnreadCount();
      setUnreadCount(count);
      
      setInquiries(getInquiries());
      setVipLeads(getVipLeads());
    }
    loadInitialData();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToConversations(async () => {
      const convs = await getConversations();
      setConversations(convs);
      
      const count = await getAdminUnreadCount();
      setUnreadCount(count);

      // If viewing a chat, refresh it
      if (activeChat) {
        const updated = await getConversation(activeChat.id);
        if (updated) {
          setActiveChat(updated);
        } else {
          setActiveChat(null); // was deleted
        }
      }
    });

    return unsubscribe;
  }, [activeChat]);

  // Scroll to bottom when chat messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages?.length]);

  const handleLogout = () => {
    localStorage.removeItem('wc_admin_auth');
    navigate('/admin', { replace: true });
  };

  const openChat = async (conv) => {
    await markAsRead(conv.id, 'admin');
    const updated = await getConversation(conv.id);
    setActiveChat(updated);
    
    // Refresh to update badges
    const convs = await getConversations();
    setConversations(convs);
    setUnreadCount(await getAdminUnreadCount());
    
    setSidebarOpen(false);
  };

  const sendAdminMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChat) return;
    
    const currentInput = chatInput.trim();
    setChatInput(''); // clear immediately for UX
    
    await addMessage(activeChat.id, { sender: 'admin', text: currentInput });
    
    const updated = await getConversation(activeChat.id);
    setActiveChat(updated);
    
    const convs = await getConversations();
    setConversations(convs);
  };

  const handleDeleteConversation = async (id) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(id);
      
      const convs = await getConversations();
      setConversations(convs);
      setUnreadCount(await getAdminUnreadCount());
      
      if (activeChat?.id === id) setActiveChat(null);
    }
  };

  const handleClearMessages = async (id) => {
    if (window.confirm('Are you sure you want to clear all messages in this chat? The customer will also see an empty chat.')) {
      await clearMessages(id);
      
      const convs = await getConversations();
      setConversations(convs);
      
      if (activeChat?.id === id) {
        setActiveChat(await getConversation(id));
      }
    }
  };

  const handleClearAllConversations = async () => {
    if (window.confirm('Are you sure you want to delete ALL conversations? This cannot be undone.')) {
      await clearAllConversations();
      setConversations([]);
      setUnreadCount(0);
      setActiveChat(null);
    }
  };

  const handleInquiryStatus = (id, status) => {
    updateInquiryStatus(id, status);
    setInquiries(getInquiries());
  };

  const handleDeleteInquiry = (id) => {
    deleteInquiry(id);
    setInquiries(getInquiries());
  };

  const activeChats = conversations.filter(c => c.status === 'active').length;
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'messages', label: 'Messages', icon: '💬', badge: unreadCount },
    { id: 'inquiries', label: 'Inquiries', icon: '📋', badge: pendingInquiries },
    { id: 'leads', label: 'VIP Leads', icon: '👑' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Mobile sidebar toggle */}
      <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span /><span /><span />
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>williamcharles<span>_motor</span></h2>
          <p className="admin-sidebar-role">Admin Panel</p>
        </div>

        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setActiveChat(null); setSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">{tab.icon}</span>
              <span className="admin-nav-label">{tab.label}</span>
              {tab.badge > 0 && <span className="admin-nav-badge">{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="admin-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="admin-content fade-in">
            <div className="admin-page-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back — here's what's happening today</p>
            </div>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon" style={{ background: 'rgba(200, 168, 78, 0.1)', color: '#c8a84e' }}>💬</div>
                <div className="stat-info">
                  <span className="stat-value">{conversations.length}</span>
                  <span className="stat-label">Total Conversations</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>🟢</div>
                <div className="stat-info">
                  <span className="stat-value">{activeChats}</span>
                  <span className="stat-label">Active Chats</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>📋</div>
                <div className="stat-info">
                  <span className="stat-value">{pendingInquiries}</span>
                  <span className="stat-label">Pending Inquiries</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>👑</div>
                <div className="stat-info">
                  <span className="stat-value">{vipLeads.length}</span>
                  <span className="stat-label">VIP Leads</span>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="admin-recent-section">
              <h2>Recent Conversations</h2>
              <div className="admin-recent-list">
                {conversations.slice(0, 5).map(conv => (
                  <div key={conv.id} className="admin-recent-item" onClick={() => { setActiveTab('messages'); openChat(conv); }}>
                    <div className="recent-avatar">
                      {conv.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="recent-info">
                      <span className="recent-name">{conv.customerName}</span>
                      <span className="recent-car">{conv.vehicle.make} {conv.vehicle.model}</span>
                    </div>
                    <div className="recent-meta">
                      <span className="recent-time">{formatTime(conv.updatedAt)}</span>
                      {conv.unreadAdmin > 0 && <span className="recent-unread">{conv.unreadAdmin}</span>}
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <p className="admin-empty-text">No conversations yet. Customers will appear here when they start chatting.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-content admin-messages-layout fade-in">
            {/* Conversation list */}
            <div className="admin-conv-list">
              <div className="admin-conv-list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2>Conversations</h2>
                  <span className="admin-conv-count">{conversations.length}</span>
                </div>
                {conversations.length > 0 && (
                  <button className="chat-clear-all-btn" onClick={handleClearAllConversations} title="Clear all conversations">
                    Clear All
                  </button>
                )}
              </div>
              <div className="admin-conv-items">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`admin-conv-item${activeChat?.id === conv.id ? ' active' : ''}${conv.unreadAdmin > 0 ? ' unread' : ''}`}
                    onClick={() => openChat(conv)}
                  >
                    <div className="conv-avatar">
                      {conv.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="conv-details">
                      <div className="conv-top">
                        <span className="conv-name">{conv.customerName}</span>
                        <span className="conv-time">{formatTime(conv.updatedAt)}</span>
                      </div>
                      <div className="conv-bottom">
                        <span className="conv-preview">
                          {conv.vehicle.make} {conv.vehicle.model} • £{conv.vehicle.price.toLocaleString()}
                        </span>
                        {conv.unreadAdmin > 0 && <span className="conv-badge">{conv.unreadAdmin}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="admin-empty-conv">
                    <p>No conversations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="admin-chat-area">
              {activeChat ? (
                <>
                  <div className="admin-chat-header">
                    <div className="chat-header-info">
                      <div className="chat-header-avatar">
                        {activeChat.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{activeChat.customerName}</h3>
                        <p>{activeChat.customerEmail}</p>
                      </div>
                    </div>
                    <div className="chat-header-car">
                      <img src={activeChat.vehicle.image} alt="" className="chat-car-thumb" />
                      <div>
                        <span className="chat-car-name">{activeChat.vehicle.make} {activeChat.vehicle.model}</span>
                        <span className="chat-car-price">£{activeChat.vehicle.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="chat-action-btn" onClick={() => handleClearMessages(activeChat.id)} title="Clear all messages in this chat">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                      </button>
                      <button className="chat-action-btn chat-delete-btn" onClick={() => handleDeleteConversation(activeChat.id)} title="Delete conversation">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="admin-chat-messages">
                    {activeChat.messages.map(msg => (
                      <div key={msg.id} className={`admin-msg admin-msg-${msg.sender}`}>
                        {msg.sender === 'system' ? (
                          <div className="msg-system">
                            <span className="msg-system-icon">🚗</span>
                            <p>{msg.text}</p>
                          </div>
                        ) : (
                          <div className="msg-bubble">
                            <p>{msg.text}</p>
                            <span className="msg-time">
                              {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form className="admin-chat-input" onSubmit={sendAdminMessage}>
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" disabled={!chatInput.trim()}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </form>
                </>
              ) : (
                <div className="admin-chat-empty">
                  <div className="chat-empty-icon">💬</div>
                  <h3>Select a Conversation</h3>
                  <p>Choose a customer from the list to view their messages and respond.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="admin-content fade-in">
            <div className="admin-page-header">
              <h1>Customer Inquiries</h1>
              <p>Form submissions from the Contact page and vehicle enquiry modals</p>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Car</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id}>
                      <td>
                        <div className="inq-customer">
                          <span className="inq-name">{inq.name}</span>
                          <span className="inq-email">{inq.email}</span>
                        </div>
                      </td>
                      <td>{inq.subject || 'General'}</td>
                      <td>{inq.car || '—'}</td>
                      <td>{inq.date}</td>
                      <td>
                        <span className={`inq-status inq-status-${inq.status?.toLowerCase()}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td>
                        <div className="inq-actions">
                          {inq.status === 'Pending' && (
                            <button className="inq-btn inq-btn-reply" onClick={() => handleInquiryStatus(inq.id, 'Replied')}>
                              Mark Replied
                            </button>
                          )}
                          <button className="inq-btn inq-btn-delete" onClick={() => handleDeleteInquiry(inq.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inquiries.length === 0 && (
                <p className="admin-empty-text" style={{ padding: '40px', textAlign: 'center' }}>No inquiries yet.</p>
              )}
            </div>
          </div>
        )}

        {/* VIP Leads Tab */}
        {activeTab === 'leads' && (
          <div className="admin-content fade-in">
            <div className="admin-page-header">
              <h1>VIP Leads</h1>
              <p>Premium access unlocks — customers who requested direct contact</p>
            </div>
            <div className="admin-leads-grid">
              {vipLeads.map(lead => (
                <div key={lead.id} className="admin-lead-card">
                  <div className="lead-avatar">{lead.name.charAt(0).toUpperCase()}</div>
                  <div className="lead-info">
                    <h3>{lead.name}</h3>
                    <p className="lead-email">{lead.email}</p>
                    <p className="lead-phone">{lead.phone}</p>
                    <div className="lead-interest">
                      <span>🚗</span> {lead.carInterest}
                    </div>
                    <span className="lead-date">{lead.date}</span>
                  </div>
                </div>
              ))}
              {vipLeads.length === 0 && (
                <p className="admin-empty-text">No VIP leads yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
