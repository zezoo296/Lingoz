import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { googleLogin } from "../api/authApi";
import { useNavigate } from "react-router";

export default function GoogleLoginButton() {
    const { mutate } = useMutation({
        mutationFn: googleLogin,
        onSuccess: () => {
            toast.success("Logged in with Google successfully!");
            navigate("/profile", { viewTransition: true });
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const navigate = useNavigate();

    const handleSuccess = (response: { credential?: string } | null) => {
        const token = response?.credential;

        if (!token) {
            toast.error("Unable to retrieve Google login token.");
            return;
        }
        mutate(token);
    };

    const handleError = () => {
        toast.error("Google login failed. Please try again.");
    };

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                shape="pill"
            />
        </div>
    );
}
