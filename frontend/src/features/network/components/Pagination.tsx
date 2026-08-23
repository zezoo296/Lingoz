import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {
    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className="p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface transition-colors"
                disabled={currentPage === 1}
            >
                <RiArrowLeftSLine className="w-5 h-5" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                            ? "bg-brand-600 text-white"
                            : "text-text-muted hover:text-text-secondary hover:bg-surface"
                    }`}
                >
                    {page}
                </button>
            ))}
            <span className="px-1 text-text-muted">...</span>
            <button
                onClick={() => onPageChange(totalPages)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                        ? "bg-brand-600 text-white"
                        : "text-text-muted hover:text-text-secondary hover:bg-surface"
                }`}
            >
                {totalPages}
            </button>
            <button
                onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                }
                className="p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface transition-colors"
                disabled={currentPage === totalPages}
            >
                <RiArrowRightSLine className="w-5 h-5" />
            </button>
        </div>
    );
};
