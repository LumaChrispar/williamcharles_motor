// Initial mockup leads for rich administrative panel display upon loading
const INITIAL_INQUIRIES = [];

const INITIAL_VIP_LEADS = [
  { id: 1, name: 'Lionel Messi', email: 'leo@messi.com', phone: '+34 600 000 000', carInterest: 'BMW M3 Competition', date: 'May 27, 2026' }
];

const PLACEHOLDER_INQUIRIES = [
  'david@beckham.com',
  'lewis@mercedes.com'
];

export const getInquiries = () => {
  const data = localStorage.getItem('wc_inquiries');
  if (!data) {
    localStorage.setItem('wc_inquiries', JSON.stringify([]));
    return [];
  }

  const parsed = JSON.parse(data);
  const filtered = parsed.filter(i => !PLACEHOLDER_INQUIRIES.includes(i.email));
  if (filtered.length !== parsed.length) {
    localStorage.setItem('wc_inquiries', JSON.stringify(filtered));
  }
  return filtered;
};

export const addInquiry = (inquiry) => {
  const inquiries = getInquiries();
  const newInquiry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending',
    ...inquiry
  };
  inquiries.unshift(newInquiry);
  localStorage.setItem('wc_inquiries', JSON.stringify(inquiries));
  return newInquiry;
};

export const updateInquiryStatus = (id, status) => {
  const inquiries = getInquiries();
  const updated = inquiries.map(i => i.id === id ? { ...i, status } : i);
  localStorage.setItem('wc_inquiries', JSON.stringify(updated));
  return updated;
};

export const deleteInquiry = (id) => {
  const inquiries = getInquiries();
  const filtered = inquiries.filter(i => i.id !== id);
  localStorage.setItem('wc_inquiries', JSON.stringify(filtered));
  return filtered;
};

export const getVipLeads = () => {
  const data = localStorage.getItem('wc_vip_leads');
  if (!data) {
    localStorage.setItem('wc_vip_leads', JSON.stringify(INITIAL_VIP_LEADS));
    return INITIAL_VIP_LEADS;
  }
  return JSON.parse(data);
};

export const addVipLead = (lead) => {
  const leads = getVipLeads();
  const newLead = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    ...lead
  };
  leads.unshift(newLead);
  localStorage.setItem('wc_vip_leads', JSON.stringify(leads));
  return newLead;
};
