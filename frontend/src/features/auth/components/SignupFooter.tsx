type SignupFooterProps = {
    onClick: () => void;
};

export default function SignupFooter({ onClick }: SignupFooterProps) {
    return (
        <p className="text-center text-text-secondary text-sm pt-2">
            Already have an account?{" "}
            <button
                type="button"
                className="cursor-pointer text-brand-400 hover:text-brand-300 font-medium transition-colors"
                onClick={onClick}
            >
                Log in
            </button>
        </p>
    );
}
