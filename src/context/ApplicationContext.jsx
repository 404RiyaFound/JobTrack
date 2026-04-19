import { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const ApplicationContext = createContext(null);

const SAMPLE_DATA = [
  { id: '1', company: 'Google', role: 'Software Engineer', location: 'Bangalore', salary: 3500000, platform: 'LinkedIn', status: 'Interviewing', appliedDate: '2025-01-10', interviewDate: '2025-01-20', notes: 'Phone screen done', bookmarked: true },
  { id: '2', company: 'Stripe', role: 'Frontend Engineer', location: 'Remote', salary: 4000000, platform: 'Company Site', status: 'Applied', appliedDate: '2025-01-14', interviewDate: '', notes: '', bookmarked: false },
  { id: '3', company: 'Notion', role: 'Product Engineer', location: 'Remote', salary: 3200000, platform: 'Referral', status: 'Offer', appliedDate: '2024-12-20', interviewDate: '2025-01-05', notes: 'Verbal offer received', bookmarked: true },
  { id: '4', company: 'Netflix', role: 'Senior Engineer', location: 'Remote', salary: 5000000, platform: 'LinkedIn', status: 'Rejected', appliedDate: '2024-12-01', interviewDate: '2024-12-15', notes: 'Did not clear system design', bookmarked: false },
  { id: '5', company: 'Figma', role: 'React Developer', location: 'Remote', salary: 3800000, platform: 'AngelList', status: 'Applied', appliedDate: '2025-01-18', interviewDate: '', notes: '', bookmarked: false },
  { id: '6', company: 'Vercel', role: 'Frontend Developer', location: 'Remote', salary: 2800000, platform: 'Job Board', status: 'Interviewing', appliedDate: '2025-01-08', interviewDate: '2025-01-22', notes: 'Technical round next', bookmarked: true },
];

// Load initial state directly from localStorage — avoids the race condition
// where the save effect would overwrite storage with [] before the load effect ran.
function loadInitialState() {
  try {
    const saved = localStorage.getItem('job_tracker_apps');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return { applications: parsed };
    }
  } catch {}
  return { applications: SAMPLE_DATA };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':            return { ...state, applications: [action.payload, ...state.applications] };
    case 'UPDATE':         return { ...state, applications: state.applications.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE':         return { ...state, applications: state.applications.filter(a => a.id !== action.payload) };
    case 'TOGGLE_BOOKMARK':return { ...state, applications: state.applications.map(a => a.id === action.payload ? { ...a, bookmarked: !a.bookmarked } : a) };
    default: return state;
  }
}

export function ApplicationProvider({ children }) {
  // initializer function runs once — reads from localStorage synchronously
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  // Only save after the very first render is committed (skip the mount write)
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    localStorage.setItem('job_tracker_apps', JSON.stringify(state.applications));
  }, [state.applications]);

  const addApplication = (data) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    dispatch({ type: 'ADD', payload: { ...data, id, bookmarked: false } });
  };

  const updateApplication   = (data) => dispatch({ type: 'UPDATE',          payload: data });
  const deleteApplication   = (id)   => dispatch({ type: 'DELETE',          payload: id });
  const toggleBookmark      = (id)   => dispatch({ type: 'TOGGLE_BOOKMARK', payload: id });

  return (
    <ApplicationContext.Provider value={{ applications: state.applications, addApplication, updateApplication, deleteApplication, toggleBookmark }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplicationContext must be inside ApplicationProvider');
  return ctx;
}
