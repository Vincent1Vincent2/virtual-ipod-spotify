import { useAuth } from "@/app/providers/AuthProvider";

export const AuthScreen = () => {
  const { startAuth } = useAuth();

  return (
    <div className="auth-screen">
      <div className="auth-content">
        <h2 className="auth-title">Welcome to iPod</h2>
        <p className="auth-message">Sign in with Spotify to start listening</p>
        <button onClick={startAuth} className="auth-button">
          Sign In
        </button>
      </div>
    </div>
  );
};
