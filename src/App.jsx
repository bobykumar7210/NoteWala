import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./routes";
import { Home, Login, Register } from "./pages";
import { ROUTES } from "./utils/constants";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.NOTE()} element={<Home />} />
            <Route path={ROUTES.ARCHIVE} element={<Home />} />
            <Route path={ROUTES.ARCHIVE_NOTE()} element={<Home />} />
            <Route path={ROUTES.TRASH} element={<Home />} />
            <Route path={ROUTES.TRASH_NOTE()} element={<Home />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
