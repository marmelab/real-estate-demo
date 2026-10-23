import type { RemixNode } from "remix/component";

import type {
  PageContext,
  StaffContext,
} from "../../middleware/require-staff.ts";

import { Document } from "../document.tsx";
import { AuthPage } from "./auth-page.tsx";
import { StaffLayout } from "./staff-layout.tsx";

type AdminPage = { title: string; page: RemixNode; status?: number };

export function renderStaffPage(
  context: StaffContext,
  { title, page, status = 200 }: AdminPage,
): Response | Promise<Response> {
  return context.render(
    <Document title={`${title} | Keyhaven`} isNoindex nonce={context.nonce}>
      <StaffLayout staff={context.staff} pathname={context.url.pathname}>
        {page}
      </StaffLayout>
    </Document>,
    { status },
  );
}

export function renderAuthPage(
  context: PageContext,
  { title, heading, page, status = 200 }: AdminPage & { heading: string },
): Response | Promise<Response> {
  return context.render(
    <Document title={`${title} | Keyhaven`} isNoindex nonce={context.nonce}>
      <AuthPage title={heading}>{page}</AuthPage>
    </Document>,
    { status },
  );
}
