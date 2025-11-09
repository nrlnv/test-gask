import { Routes, Route, HashRouter } from "react-router-dom";
import TestScreen from "./pages/TestScreen";
import Home from "./pages/Home";
import AccessScreen from "./pages/AccessScreen";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AccessScreen />} />
        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:slug"
          element={
            <ProtectedRoute>
              <TestScreen />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<AccessScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
