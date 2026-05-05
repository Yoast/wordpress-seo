import { focus } from "@wordpress/dom";


/**
 * Get sibling function.
 *
 * @param {KeyboardEvent} event The keydown event.
 * @returns {Function} The function to find the next or previous tabbable element.
 */
const getFindSibling = ( event ) => {
	return event.shiftKey ? focus.tabbable.findPrevious : focus.tabbable.findNext;
};

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

	const findSibling = getFindSibling( event );
	const next = findSibling( event.target );

	// Intercept whenever focus is inside the banner or entering it.
	// Gutenberg's WritingFlow Tab handler redirects focus to the next block rather than
	// moving between tabbable elements inside the banner wrapper, so we must handle all
	// banner-related Tab navigation ourselves — both intra-banner and boundary-crossing.
	if ( next && ( bannerEl.contains( event.target ) || bannerEl.contains( next ) ) ) {
		event.preventDefault();
		next.focus();
	}
}
