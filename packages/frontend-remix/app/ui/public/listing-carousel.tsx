import type { Handle, RemixNode } from "remix/component";

import { clientEntry, on, ref } from "remix/component";

export const ListingCarousel = clientEntry(
  import.meta.url,
  function ListingCarousel(
    handle: Handle<{
      count: number;
      slides: RemixNode;
      previousIcon: RemixNode;
      nextIcon: RemixNode;
    }>,
  ) {
    let track: HTMLUListElement | undefined;
    let index = 0;
    let goTo = (nextIndex: number) =>
      track?.scrollTo({
        left: nextIndex * track.clientWidth,
        behavior: "smooth",
      });

    return () => {
      let { count } = handle.props;

      return (
        <section
          aria-roledescription="carrousel"
          aria-label="Photos du bien"
          class="border-obsidian-700 bg-obsidian-950 relative border"
        >
          <ul
            mix={[
              ref((node: HTMLUListElement) => (track = node)),
              on("scroll", () => {
                let nextIndex = Math.round(
                  (track?.scrollLeft ?? 0) / (track?.clientWidth || 1),
                );
                if (nextIndex === index) return;
                index = nextIndex;
                void handle.update();
              }),
            ]}
            class="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto"
          >
            {handle.props.slides}
          </ul>
          {count > 1 && (
            <>
              <SlideButton
                label="Photo précédente"
                isDisabled={index === 0}
                onClick={() => goTo(index - 1)}
                class="left-3"
                icon={handle.props.previousIcon}
              />
              <SlideButton
                label="Photo suivante"
                isDisabled={index === count - 1}
                onClick={() => goTo(index + 1)}
                class="right-3"
                icon={handle.props.nextIcon}
              />
              <p
                aria-live="polite"
                class="eyebrow border-obsidian-700 bg-obsidian-950/85 absolute right-3 bottom-3 border px-3 py-1"
              >
                {index + 1} / {count}
              </p>
            </>
          )}
        </section>
      );
    };
  },
);

function SlideButton(
  handle: Handle<{
    label: string;
    isDisabled: boolean;
    onClick: () => void;
    class: string;
    icon: RemixNode;
  }>,
) {
  return () => (
    <button
      type="button"
      aria-label={handle.props.label}
      title={handle.props.label}
      disabled={handle.props.isDisabled}
      mix={on("click", () => handle.props.onClick())}
      class={`border-gold bg-obsidian-950/85 text-gold hover:bg-gold hover:text-obsidian-950 focus-visible:outline-gold absolute top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:invisible ${handle.props.class}`}
    >
      {handle.props.icon}
    </button>
  );
}
