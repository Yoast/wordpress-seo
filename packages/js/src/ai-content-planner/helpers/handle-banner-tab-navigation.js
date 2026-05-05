import { focus } from "@wordpress/dom";

/**
 * Keydown handler that keeps the inline banner reachable via Tab inside the Gutenberg
 * writing flow. Gutenberg's useTabNav hook intercepts Tab in the bubble phase and
 * redirects focus to sentinel divs when the next tabbable element is not inside the
 * same [data-block] wrapper. Because the banner sits outside any real block, it is
 * normally skipped. This handler is meant to be attached in the capture phase so it
 * runs before Gutenberg; once it calls preventDefault(), Gutenberg's early-return guard
 * fires and leaves focus alone.
 *
 * @param {HTMLElement}  bannerEl The banner wrapper element.
 * @param {KeyboardEvent} event   The keydown event.
 * @returns {void}
 */
export function handleBannerTabNavigation( bannerEl, event ) {
	if ( event.defaultPrevented || event.key !== "Tab" || ! bannerEl ) {
		return;
	}

	const findSibling = event.shiftKey ? focus.tabbable.findPrevious : focus.tabbable.findNext;
	const next = findSibling( event.target );

	// Intercept only when Tab or Shift+Tab crosses the banner boundary (entering or leaving).
	// Intra-banner navigation is already handled by Gutenberg via the data-block attribute.
	if ( next && bannerEl.contains( event.target ) !== bannerEl.contains( next ) ) {
		event.preventDefault();
		next.focus();
	}
}
