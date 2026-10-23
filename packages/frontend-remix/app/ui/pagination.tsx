import type { Handle } from "remix/component";

export function Pagination(
  handle: Handle<{
    page: number;
    pageSize: number;
    total: number;
    getPageHref: (page: number) => string;
  }>,
) {
  return () => {
    let { page, pageSize, total, getPageHref } = handle.props;
    let hasNextPage = page * pageSize < total;
    if (page === 1 && !hasNextPage) return null;

    return (
      <nav aria-label="Pagination" class="flex justify-between gap-4">
        {page > 1 ? (
          <a href={getPageHref(page - 1)} class="button-outline">
            Précédent
          </a>
        ) : (
          <span />
        )}
        {hasNextPage && (
          <a href={getPageHref(page + 1)} class="button-outline">
            Suivant
          </a>
        )}
      </nav>
    );
  };
}
