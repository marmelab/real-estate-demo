import type { Handle, RemixNode } from "remix/component";

export function Favorites(
  handle: Handle<{ ids: number[]; children?: RemixNode }, { ids: number[] }>,
) {
  handle.context.set({ ids: handle.props.ids });
  return () => handle.props.children;
}
