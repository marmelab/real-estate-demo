import type { Staff } from "@remix-v3-demo/domain/auth/model";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { StaffLayout } from "./staff-layout.tsx";

const signOut = vi.hoisted(() => vi.fn());

vi.mock("./hook/sign-out.ts", async () => {
  const { useMutation } = await import("@tanstack/react-query");
  return { useSignOut: () => useMutation({ mutationFn: signOut }) };
});

const manager: Pick<Staff, "firstName" | "lastName" | "role"> = {
  firstName: "Claire",
  lastName: "Martin",
  role: "manager",
};

async function renderLayout(staff = manager) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => <StaffLayout staff={staff} />,
    }),
    history: createMemoryHistory({ initialEntries: ["/admin/listings"] }),
  });
  await render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

function getNavLinks() {
  return page
    .getByRole("navigation", { name: "Administration" })
    .getByRole("link")
    .elements()
    .map((link) => link.textContent);
}

describe("StaffLayout", () => {
  beforeEach(() => {
    signOut.mockReset();
  });

  it.each([
    [
      "a manager",
      "manager",
      ["Annonces", "Agents", "Voir le site(nouvel onglet)"],
    ],
    ["an agent", "agent", ["Annonces", "Voir le site(nouvel onglet)"]],
  ] as const)("should show %s their admin sections", async (_, role, links) => {
    await renderLayout({ ...manager, role });

    await expect.poll(getNavLinks).toEqual(links);
  });

  it("should show the staff name with their role", async () => {
    await renderLayout();

    await expect
      .element(page.getByRole("link", { name: /^Claire Martin/ }))
      .toHaveTextContent("Claire MartinManager");
  });

  it("should send the staff to the login page once signed out", async () => {
    signOut.mockResolvedValue(undefined);
    const router = await renderLayout();

    await page.getByRole("button", { name: "Se déconnecter" }).click();

    await expect
      .poll(() => router.state.location.pathname)
      .toBe("/admin/login");
    expect(signOut).toHaveBeenCalledOnce();
  });
});
