import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";

// Check environment variables BEFORE importing App to prevent module-level crash
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const root = createRoot(document.getElementById("root")!);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Render configuration error without importing App (prevents supabase client crash)
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Konfigurasi Backend</h1>
        <p className="text-gray-600 mb-6">
          Aplikasi sedang memuat konfigurasi backend. Silakan refresh halaman dalam beberapa detik.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Refresh Halaman
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Jika masalah berlanjut, buka History dan restore ke versi sebelumnya.
        </p>
      </div>
    </div>
  );
} else {
  // Only dynamically import App if env vars are available
  const ErrorBoundary = lazy(() => import("./components/ErrorBoundary.tsx"));
  const App = lazy(() => import("./App.tsx"));
  
  root.render(
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Suspense>
  );
}
