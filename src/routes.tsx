import { Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
import AppLayout from "./layouts/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<MainPage />} />
      </Route>
    </Routes>
  );
}
