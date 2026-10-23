import { createFileRoute, redirect } from "@tanstack/react-router";

import { getStaffOrNull } from "../auth/get-staff-or-null.ts";
import { NOINDEX_META } from "../auth/noindex.ts";
import { StaffLayout } from "../auth/staff-layout.tsx";

export const Route = createFileRoute("/admin/_staff")({
  beforeLoad: async ({ context, location }) => {
    const staff = await getStaffOrNull(context.queryClient);
    if (!staff) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
    return { staff };
  },
  head: () => ({
    meta: [{ title: "Administration | Keyhaven" }, NOINDEX_META],
  }),
  component: StaffPage,
});

function StaffPage() {
  const { staff } = Route.useRouteContext();
  return <StaffLayout staff={staff} />;
}
