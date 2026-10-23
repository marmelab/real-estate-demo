import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_staff/agents")({
  beforeLoad: ({ context }) => {
    if (context.staff.role !== "manager") {
      throw redirect({ to: "/admin/listings" });
    }
  },
});
