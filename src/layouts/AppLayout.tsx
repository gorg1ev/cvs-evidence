import { Outlet } from "react-router";
import { ToastContainer, Zoom } from "react-toastify";

export default function AppLayout() {
  return (
    <div className="p-3">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
      <Outlet />
    </div>
  );
}
