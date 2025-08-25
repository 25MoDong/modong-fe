import { useEffect, useState } from 'react';
import backend from '../lib/backend';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    const handler = async (ev) => {
      if (!mounted) return;
      // ev.detail may contain user object when set, otherwise fetch by id
      const detail = ev?.detail;
      if (detail) {
        setUser(detail);
        return;
      }
      // No detail: try to hydrate from backend (caller should provide id)
      try {
        // no-op: listener-based updates prefer detail payload
      } catch (e) {}
    };

    window.addEventListener('UserChanged', handler);

    // initial fetch: attempt to load from backend via backend.getAllUsers? skip here
    return () => { mounted = false; window.removeEventListener('UserChanged', handler); };
  }, []);

  return user;
}
