import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/unlock")({
  loader: () => {
    throw redirect({ to: "/welcome" });
  },
});
