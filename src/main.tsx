import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";

// Dynamically import App to handle any potential module-level errors gracefully
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary.tsx"));
const App = lazy(() => import("./App.tsx"));

const root = createRoot(document.getElementById("root")!);

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
