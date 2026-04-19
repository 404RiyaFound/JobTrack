import { useState, useEffect, useCallback } from 'react';
import { useApplicationContext } from '../context/ApplicationContext';

// useDebounce
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// useLocalStorage
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch { return initial; }
  });
  const set = useCallback((val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  }, [key]);
  return [value, set];
}

// useApplications — CRUD + filtering/sorting
export function useApplications() {
  const { applications, addApplication, updateApplication, deleteApplication, toggleBookmark } = useApplicationContext();
  return { applications, addApplication, updateApplication, deleteApplication, toggleBookmark };
}
