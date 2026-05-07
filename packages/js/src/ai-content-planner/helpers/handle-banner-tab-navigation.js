import { focus } from "@wordpress/dom";

/**
 * Prevents Gutenberg's arrow-nav handler from stealing focus when the dropdown
 * menu is open. Gutenberg's use-arrow-nav exits early when defaultPrevented is
 * set, so calling preventDefault() here lets HeadlessUI still process the key.
 *
 * @param {HTMLElement}  bannerEl The banner wrapper element.
 * @param {KeyboardEvent} event   The keydown event.
 * @returns {void}
 */
export function preventArrowNavInMenu( bannerEl, event ) {
	if ( ! [ "ArrowDown", "ArrowUp" ].includes( event.key ) ) {
		return;
	}
	const menuEl = bannerEl?.querySelector( "[role='menu']" );
	if ( menuEl && ( menuEl === event.target || menuEl.contains( event.target ) ) ) {
		event.preventDefault();
	}
}

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
 * Returns whether a Tab navigation involves the banner — i.e. focus is currently inside
 * the banner or is about to enter it.
 *
 * @param {HTMLElement} bannerEl The banner wrapper element.
 * @param {HTMLElement} target   The currently focused element.
 * @param {HTMLElement} next     The next tabbable element.
 * @returns {boolean} Whether the banner is involved in the navigation.
 */
const involvesBanner = ( bannerEl, target, next ) => bannerEl.contains( target ) || bannerEl.contains( next );

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

	// Intercept only when Tab or Shift+Tab crosses the banner boundary (entering or leaving).
	// Intra-banner navigation is already handled by Gutenberg via the data-block attribute.
	if ( next && involvesBanner( bannerEl, event.target, next ) ) {
		event.preventDefault();
		next.focus();
	}
}
