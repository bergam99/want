import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Map from "./pages/Map/Map";
import Error from "./pages/Error/Error";
import RootLayout from "./layouts/RootLayout/RootLayout";
import Auth from "./pages/Auth/Auth";
import BasicLayout from "./layouts/RootLayout/BasicLayout/BasicLayout";
import { action as AuthAction } from "./pages/Auth/AuthAction";
import { tokenLoader } from "./pages/Auth/Auth_utils";
import ScoreBoard from "./pages/ScoreBoard/ScoreBoard";
import { loader as ScoreLoader } from "./pages/ScoreBoard/ScoreBoardLoader";
import Dashboard from "./pages/Dashboard/Dashboard";
import { loader as DashboardLoader } from "./pages/Dashboard/DashboardLoader";
import About from "./pages/About/About";
import { action as logoutAction } from "./pages/Logout/Logout";
import { loader as routeProtectionLoader } from "./layouts/routeProtectionLayout/routeProtectionLoader";

// const basename = import.meta.env.MODE === "production" ? import.meta.env.BASE_URL : "/";

// console.log(import.meta.env.MODE);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />, // bubbled up
      id: "root",
      loader: tokenLoader,
      children: [
        { index: true, element: <Map /> },
        {
          element: <BasicLayout />,
          children: [
            { path: "about", element: <About /> },
            { path: "auth", element: <Auth />, action: AuthAction },

            {
              loader: routeProtectionLoader, // protected
              children: [
                {
                  path: "scoreboard",
                  element: <ScoreBoard />,
                  loader: ScoreLoader,
                },
                {
                  path: "dashboard",
                  element: <Dashboard />,
                  loader: DashboardLoader,
                },
                {
                  path: "logout",
                  action: logoutAction,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
