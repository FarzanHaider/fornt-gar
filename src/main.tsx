// import { createRoot } from "react-dom/client";
// import App from "./app/App.tsx";
// import { ErrorBoundary } from "./app/components/ErrorBoundary.tsx";
// import "./styles/index.css";

// // Global error handlers for unhandled errors and promise rejections
// window.addEventListener("error", (event) => {
//   console.error("Unhandled error:", event.error);
//   // In production, you can send to error tracking service here
// });

// window.addEventListener("unhandledrejection", (event) => {
//   // Ignore common audio/network errors that don't break functionality
//   const error = event.reason;
//   const errorMessage = error?.message || error?.toString() || '';
//   const errorCode = error?.code || '';
  
//   // Suppress common non-critical errors
//   if (
//     errorMessage.includes('416') || // Range Not Satisfiable (common with audio)
//     errorMessage.includes('favicon') || // Favicon 404
//     errorCode === 'ECONNABORTED' || // Request timeout (handled by interceptors)
//     errorMessage.includes('Range Not Satisfiable')
//   ) {
//     event.preventDefault();
//     return; // Silently ignore
//   }
  
//   // Log other errors
//   if (import.meta.env.DEV) {
//     console.error("Unhandled promise rejection:", event.reason);
//   }
//   // Prevent the default browser error handling
//   event.preventDefault();
//   // In production, you can send to error tracking service here
// });

// // Validate root element exists before rendering
// const rootElement = document.getElementById("root");

// if (!rootElement) {
//   // Fallback: create root element if it doesn't exist
//   const fallbackRoot = document.createElement("div");
//   fallbackRoot.id = "root";
//   document.body.appendChild(fallbackRoot);
  
//   const root = createRoot(fallbackRoot);
//   root.render(
//     <ErrorBoundary>
//       <App />
//     </ErrorBoundary>
//   );
// } else {
//   const root = createRoot(rootElement);
//   root.render(
//     <ErrorBoundary>
//       <App />
//     </ErrorBoundary>
//   );
// }
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ErrorBoundary } from "./app/components/ErrorBoundary.tsx";
import "./styles/index.css";

// Global error handlers
window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason;
  const errorMessage = error?.message || error?.toString() || "";
  const errorCode = error?.code || "";

  if (
    errorMessage.includes("416") ||
    errorMessage.includes("favicon") ||
    errorCode === "ECONNABORTED"
  ) return; // ignore common non-critical errors

  console.error("Unhandled promise rejection:", event.reason);
});

// Mount root
const rootElement = document.getElementById("root");
const mountRoot = (el: HTMLElement) => {
  const root = createRoot(el);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

if (!rootElement) {
  const fallbackRoot = document.createElement("div");
  fallbackRoot.id = "root";
  document.body.appendChild(fallbackRoot);
  mountRoot(fallbackRoot);
} else {
  mountRoot(rootElement);
}
