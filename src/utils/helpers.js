import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'MMM d, yyyy'); }
  catch { return dateStr; }
};

export const formatSalary = (n) => {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
};

export const getStatusBadgeClass = (status) => {
  const map = { Applied: 'badge-applied', Interviewing: 'badge-interviewing', Offer: 'badge-offer', Rejected: 'badge-rejected' };
  return map[status] || 'badge-applied';
};

export const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
export const PLATFORMS = ['LinkedIn', 'Company Site', 'Referral', 'AngelList', 'Job Board', 'Other'];
export const LOCATION_TYPES = ['Remote', 'On-site', 'Hybrid'];

export const getDomain = (company) => `${company.toLowerCase().replace(/\s+/g, '')}.com`;
