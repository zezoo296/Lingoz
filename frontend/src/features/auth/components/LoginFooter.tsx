type LoginFooterProps = {
    onClick: () => void;
};

export default function LoginFooter({onClick} : LoginFooterProps){
    return (
            <p className="text-center text-text-secondary text-sm pt-2">
                Don't have an account?{" "}
                <button
                    type="button"
                    className="cursor-pointer text-brand-400 hover:text-brand-300 font-medium transition-colors"
                    onClick={onClick}
                >
                    Sign up
                </button>
            </p>
    );
}