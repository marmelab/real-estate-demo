import { createFileRoute } from "@tanstack/react-router";

import {
  listAgentsQueryOptions,
  useListAgents,
} from "../agent/hook/list-agents.ts";
import { useCreateListing } from "../listing/hook/create-listing.ts";
import { listingFormSearchSchema } from "../listing/listing-form-tab.ts";
import { ListingForm } from "../listing/listing-form.tsx";

export const Route = createFileRoute("/admin/_staff/listings/new")({
  validateSearch: listingFormSearchSchema,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listAgentsQueryOptions({ page: 1 })),
  head: () => ({ meta: [{ title: "Nouvelle annonce | Keyhaven" }] }),
  component: NewListingPage,
});

function NewListingPage() {
  const { staff } = Route.useRouteContext();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useListAgents({ page: 1 });
  const { mutateAsync: createListing } = useCreateListing();

  return (
    <ListingForm
      title="Nouvelle annonce"
      agents={data.agents}
      isManager={staff.role === "manager"}
      tab={tab}
      onTabChange={(nextTab) =>
        navigate({ search: { tab: nextTab }, replace: true })
      }
      onSubmit={async (input) => {
        const { id } = await createListing(input);
        await navigate({
          to: "/admin/listings/$listingId",
          params: { listingId: id },
          search: { tab: "photos" },
        });
      }}
    />
  );
}
