type ForgotPasswordStep = "email" | "otp" | "password" | "success";

type ForgotPasswordHeaderProps = {
    step: ForgotPasswordStep;
};

const headerContent: Record<
    ForgotPasswordStep,
    { title: string; subtitle: string }
> = {
    email: {
        title: "Don't worry, we got you!",
        subtitle: "Enter your email to receive a reset code.",
    },
    otp: {
        title: "Check your email",
        subtitle: "Enter the 6-digit code we sent to your inbox.",
    },
    password: {
        title: "Create a new password",
        subtitle: "Choose a strong password for your account.",
    },
    success: {
        title: "Password updated",
        subtitle: "You can now sign in with your new password.",
    },
};

export default function ForgotPasswordHeader({ step }: ForgotPasswordHeaderProps) {
    const { title, subtitle } = headerContent[step];

    return (
        <>
            <h2 className="text-2xl font-bold text-text-primary mb-1 fade">
                {title}
            </h2>
            <p className="text-text-secondary text-sm mb-3 fade">{subtitle}</p>
        </>
    );
}

export type { ForgotPasswordStep };
