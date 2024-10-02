import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./index.css";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: {
		queryClient,
	},
});

// Register things for typesafety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app")!;

const extensions = [StarterKit];

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<QueryClientProvider client={queryClient}>
			<EditorProvider extensions={extensions} content={<p>Hello world</p>}>
				<RouterProvider router={router} />
			</EditorProvider>
			<ReactQueryDevtools initialIsOpen />
		</QueryClientProvider>
	);
}
