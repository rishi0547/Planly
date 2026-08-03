import { logout } from '../(auth)/actions';

export default function LogoutButton() {
  return (
    <form>
      <button
        formAction={logout}
        className="mt-2 text-xs font-medium text-red-400 hover:text-red-300 underline underline-offset-2 transition"
      >
        Log out
      </button>
    </form>
  );
}
