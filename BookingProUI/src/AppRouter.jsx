import { createBrowserRouter, Navigate } from "react-router";
import App from "./App.jsx";
import StudioList from "./components/StudioList.jsx";
import BookingList from "./components/BookingList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/studios" replace />
      },
      {
        path: "studios",
        element: <StudioList />
      },
      {
        path: "bookings",
        element: <BookingList />
      },
    ],
  },
]);

export default router;