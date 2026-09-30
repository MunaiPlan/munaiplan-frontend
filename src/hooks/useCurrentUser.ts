import { useEffect, useState } from 'react';
import { useUser } from './useAuth';
import { adminService, type CurrentUser } from '../services/admin.service';

/** Loads the signed-in account (including its role) whenever the session token changes. */
export const useCurrentUser = (): { user: CurrentUser | null; loading: boolean } => {
  const token = useUser()?.token;
  const [state, setState] = useState<{ token?: string; user: CurrentUser | null }>({ user: null });

  useEffect(() => {
    if (!token) {
      return;
    }
    let cancelled = false;
    adminService.currentUser()
      .then((user) => { if (!cancelled) setState({ token, user }); })
      .catch(() => { if (!cancelled) setState({ token, user: null }); });
    return () => { cancelled = true; };
  }, [token]);

  if (!token) {
    return { user: null, loading: false };
  }
  return { user: state.token === token ? state.user : null, loading: state.token !== token };
};
