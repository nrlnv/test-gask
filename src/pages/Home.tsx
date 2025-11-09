import { Link, useNavigate } from "react-router-dom";
import { testsList } from "../data/testLists";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_granted");
    navigate("/"); // вернуть на экран кода
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-transform duration-300 hover:scale-[1.02] animate-fadeIn">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
        >
          Выйти
        </button>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧠 Выберите тест
        </h1>
        {/* <p className="text-gray-500 text-center mb-6 text-sm">
          Каждый тест содержит случайный порядок ответов
        </p> */}

        <ul className="space-y-3">
          {testsList.map((t, i) => (
            <li key={i}>
              <Link
                to={`/test/${t.path}`}
                className="block w-full text-left px-5 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium border border-transparent hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
