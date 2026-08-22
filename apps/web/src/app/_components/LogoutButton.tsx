'use client';

import { logout } from '../(auth)/actions';

export default function LogoutButton() {
  return (
    <form>
      <button
        formAction={logout}
        className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg-light)] transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </form>
  );
}
