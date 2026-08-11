import "./index.css";
import LinguaChatAuth from "./features/auth/pages/LinguaChatAuth";
import AppToaster from "./providers/Toaster";

export default function App() {
    return (
        <>
            <LinguaChatAuth />
            <AppToaster />
        </>
    );
}
