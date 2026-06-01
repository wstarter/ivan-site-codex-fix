import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/nacin-rada")({
  beforeLoad: () => {
    throw redirect({ to: "/repertoar", hash: "nacin-rada", replace: true });
  },
});
