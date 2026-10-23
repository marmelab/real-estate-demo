import { Link } from "@tanstack/react-router";

export function Pagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const hasNextPage = page * pageSize < total;
  if (page === 1 && !hasNextPage) return null;

  return (
    <nav aria-label="Pagination" className="flex justify-between gap-4">
      {page > 1 ? (
        <Link
          to="."
          search={(previous) => ({ ...previous, page: page - 1 })}
          className="button-outline"
        >
          Précédent
        </Link>
      ) : (
        <span />
      )}
      {hasNextPage && (
        <Link
          to="."
          search={(previous) => ({ ...previous, page: page + 1 })}
          className="button-outline"
        >
          Suivant
        </Link>
      )}
    </nav>
  );
}
