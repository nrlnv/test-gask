import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const hasAccess = localStorage.getItem("access_granted") === "true";
  // если нет доступа — редиректим на экран ввода кода
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }
  return children;
}
