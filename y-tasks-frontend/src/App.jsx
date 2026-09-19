import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "./store/useAuthStore";
import { useTaskStore } from "./store/useTaskStore";
import { toast } from "./store/useToastStore";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import Toaster from "./components/Toaster";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const token = useAuthStore((s) => s.token);
  const sessionExpired = useAuthStore((s) => s.sessionExpired);
  const dismissExpiredNotice = useAuthStore((s) => s.dismissExpiredNotice);
  const resetTasks = useTaskStore((s) => s.reset);
  const [authView, setAuthView] = useState("login");
  const [prefillEmail, setPrefillEmail] = useState("");

  // Surface an expired session as a single quiet toast, then let the normal
  // token-based routing below drop the person back at the login screen.
  useEffect(() => {
    if (sessionExpired) {
      toast.info("Your session ended. Please sign in again.");
      dismissExpiredNotice();
    }
  }, [sessionExpired, dismissExpiredNotice]);

  useEffect(() => {
    if (!token) resetTasks();
  }, [token, resetTasks]);

  let view;
  if (!token) {
    view =
      authView === "login" ? (
        <LoginPage
          key="login"
          initialEmail={prefillEmail}
          onSwitchToRegister={() => setAuthView("register")}
        />
      ) : (
        <RegisterPage
          key="register"
          onSwitchToLogin={(email) => {
            setPrefillEmail(email || "");
            setAuthView("login");
          }}
        />
      );
  } else {
    view = <Dashboard key="dashboard" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={token ? "dashboard" : authView} {...pageTransition}>
          {view}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </>
  );
}
