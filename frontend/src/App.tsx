import "./index.css";
import AppToaster from "./providers/Toaster";
import { Outlet } from "react-router";

export default function App() {
    return (
        <>
            <div className="min-h-dvh bg-background">
                <Outlet />
            </div>
            <AppToaster />
        </>
    );
}
