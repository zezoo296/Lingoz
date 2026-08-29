import { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, type MemoryRouterProps } from "react-router";
import userEvent from "@testing-library/user-event";

export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: Infinity,
                staleTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

export interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
    queryClient?: QueryClient;
    initialEntries?: MemoryRouterProps["initialEntries"];
}

export function createTestWrapper({
    queryClient = createTestQueryClient(),
    initialEntries = ["/"],
}: {
    queryClient?: QueryClient;
    initialEntries?: MemoryRouterProps["initialEntries"];
} = {}) {
    return function TestWrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>
                    {children}
                </MemoryRouter>
            </QueryClientProvider>
        );
    };
}

export function renderWithProviders(
    ui: ReactElement,
    options: ExtendedRenderOptions = {},
) {
    const {
        queryClient = createTestQueryClient(),
        initialEntries = ["/"],
        ...renderOptions
    } = options;

    const Wrapper = createTestWrapper({
        queryClient,
        initialEntries,
    });

    return {
        user: userEvent.setup(),
        queryClient,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

export {
    screen,
    waitFor,
    within,
    act,
    renderHook,
    cleanup,
    fireEvent,
} from "@testing-library/react";
export { userEvent };
