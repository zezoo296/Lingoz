import { useMutation } from "@tanstack/react-query";
import { FiUserPlus, FiCheck } from "react-icons/fi";
import { connect } from "../../friends/api/friends.api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ConnectButton({ recieverId }: { recieverId: number }) {
    const { mutate, isPending } = useMutation({
        mutationFn: () => connect(recieverId),
        onSuccess: () => {
            setConnected(true);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
    const [connected, setConnected] = useState(false);
    return (
        <button
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            disabled={isPending || connected}
            onClick={() => mutate()}
        >
            {connected ? <FiCheck /> : <FiUserPlus className="w-4 h-4" />}
            {isPending
                ? "Sending request..."
                : connected
                  ? "Request sent"
                  : "Connect"}
        </button>
    );
}
