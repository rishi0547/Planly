'use client';

import { logout } from '../(auth)/actions';

export default function LogoutButton() {
  return (
    <form>
      <button
        formAction={logout}
        className="text-xs font-medium transition-colors"
        style={{
          color: 'var(--pl-muted)',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pl-ink)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pl-muted)')}
      >
        Sign out
      </button>
    </form>
  );
}
