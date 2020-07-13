import { useEffect, useReducer } from 'react';

function reducer(_, action) {
  return {
    isInitialising: false,
    value: action,
  };
}

export default function useLocalStorage(key: string) {
  const [state, dispatch] = useReducer(reducer, {
    isInitialising: true,
    value: null,
  });

  // Set initial value from localstorage
  useEffect(() => {
    const item = window.localStorage.getItem(key);

    dispatch(item ? JSON.parse(item) : null);
  }, []);

  // Watch for localstorage changes
  useEffect(() => {
    const storageWatcher = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== e.oldValue) {
        dispatch(JSON.parse(e.newValue));
      } else if (e.storageArea.length === 0) {
        dispatch(null);
      }
    };

    window.addEventListener('storage', storageWatcher);

    return () => {
      window.removeEventListener('storage', storageWatcher);
    };
  }, [key]);

  // Persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Save state
      if (value !== state.value) {
        dispatch(value);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [state, setValue] as const;
}
