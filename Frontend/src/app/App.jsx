import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {

  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, [handleGetMe]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;