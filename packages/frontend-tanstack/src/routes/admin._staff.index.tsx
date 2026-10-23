import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_staff/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/listings" });
  },
});
