import { RiUserAddLine } from "react-icons/ri";

export const NetworkHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">
                    Discover people
                </h1>
                <p className="text-sm text-text-muted mt-1">
                    Connect with language learners around the world
                </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors shrink-0 self-start">
                <RiUserAddLine className="w-5 h-5" />
                Invite friends
            </button>
        </div>
    );
};
