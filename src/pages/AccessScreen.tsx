// src/pages/AccessScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccessScreen() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = "1234"; // <-- твой код
    if (code === correctCode) {
      localStorage.setItem("access_granted", "true");
      localStorage.setItem("access_granted_at", Date.now().toString()); // время выдачи
      navigate("/tests", { replace: true });
    } else {
      setError("❌ Неверный код. Попробуйте снова.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center animate-fadeIn"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🔒 Доступ по коду
        </h1>

        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите код"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />

        {error && (
          <div className="text-red-500 text-sm font-medium mb-3">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-150"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
