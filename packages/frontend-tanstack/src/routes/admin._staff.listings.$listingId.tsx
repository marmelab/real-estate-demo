import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  listAgentsQueryOptions,
  useListAgents,
} from "../agent/hook/list-agents.ts";
import { useDeleteListingImage } from "../listing-image/hook/delete-listing-image.ts";
import { useReorderListingImages } from "../listing-image/hook/reorder-listing-images.ts";
import { useUpdateListingImage } from "../listing-image/hook/update-listing-image.ts";
import { useUploadListingImage } from "../listing-image/hook/upload-listing-image.ts";
import { ListingPhotoManager } from "../listing-image/listing-photo-manager.tsx";
import { useDeleteListing } from "../listing/hook/delete-listing.ts";
import {
  getAdminListingByIdQueryOptions,
  useGetAdminListingById,
} from "../listing/hook/get-admin-listing-by-id.ts";
import { useUpdateListing } from "../listing/hook/update-listing.ts";
import { listingFormSearchSchema } from "../listing/listing-form-tab.ts";
import { ListingForm } from "../listing/listing-form.tsx";

export const Route = createFileRoute("/admin/_staff/listings/$listingId")({
  params: {
    parse: ({ listingId }) => {
      const id = Number(listingId);
      if (!Number.isSafeInteger(id) || id < 1) throw notFound();
      return { listingId: id };
    },
    stringify: ({ listingId }) => ({ listingId: String(listingId) }),
  },
  validateSearch: listingFormSearchSchema,
  loader: async ({ context, params }) => {
    const [listing] = await Promise.all([
      context.queryClient.ensureQueryData(
        getAdminListingByIdQueryOptions(params.listingId),
      ),
      context.queryClient.ensureQueryData(listAgentsQueryOptions({ page: 1 })),
    ]);
    if (!listing) throw notFound();
    return { title: listing.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Annonce"} | Keyhaven` }],
  }),
  component: EditListingPage,
  notFoundComponent: () => (
    <p className="text-gray-300">Cette annonce n'existe pas.</p>
  ),
});

function EditListingPage() {
  const { listingId } = Route.useParams();
  const { tab } = Route.useSearch();
  const { staff } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const { data: listing } = useGetAdminListingById(listingId);
  const { data } = useListAgents({ page: 1 });
  const { mutateAsync: updateListing } = useUpdateListing(listingId);
  const { mutateAsync: deleteListing } = useDeleteListing(listingId);
  const { mutateAsync: uploadImage } = useUploadListingImage(listingId);
  const { mutateAsync: updateImage } = useUpdateListingImage(listingId);
  const { mutateAsync: reorderImages } = useReorderListingImages(listingId);
  const { mutateAsync: deleteImage } = useDeleteListingImage(listingId);
  if (!listing) throw notFound();

  return (
    <ListingForm
      title={listing.title}
      listing={listing}
      agents={data.agents}
      isManager={staff.role === "manager"}
      tab={tab}
      onTabChange={(nextTab) =>
        navigate({ search: { tab: nextTab }, replace: true })
      }
      photos={
        <ListingPhotoManager
          images={listing.images}
          onUpload={uploadImage}
          onAltChange={(id, alt) => updateImage({ id, alt })}
          onReorder={reorderImages}
          onDelete={deleteImage}
        />
      }
      onSubmit={async (input) => {
        await updateListing(input);
        await navigate({ to: "/admin/listings" });
      }}
      onDelete={async () => {
        await deleteListing();
        await navigate({ to: "/admin/listings" });
      }}
    />
  );
}
