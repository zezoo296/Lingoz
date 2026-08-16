import { createBrowserRouter } from "react-router";
import App from "./App";
import LingozAuth from "./features/auth/pages/LingozAuth";
import Onboarding from "./features/onboarding/pages/onboarding";
import ProtectedRoute from "./features/auth/routes/ProtectedRoute";
import GuestRoute from "./features/auth/routes/GuestRoute";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // The Main layout wrapper
        children: [
            {
                element: <GuestRoute />,
                children: [
                    {
                        index: true,
                        element: <LingozAuth />,
                    },
                ],
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <Layout />,
                        children: [
                            {
                                path: "welcome",
                                element: <Onboarding />,
                            },
                        ],
                    },
                ],
            },

            // {
            //     path: "profile/:id", // Modern dynamic routing path
            //     element: <Profile />,
            //     // Modern data approach: Fetch data before the page renders
            //     loader: async ({ params }) => {
            //         const res = await fetch(`https://example.com{params.id}`);
            //         return res.json();
            //     },
            // },
        ],
    },
]);
