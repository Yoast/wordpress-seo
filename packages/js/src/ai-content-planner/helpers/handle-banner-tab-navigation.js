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
 * Prevents Gutenberg's arrow-nav handler from stealing focus when the dropdown
 * menu is open. Gutenberg's use-arrow-nav exits early when defaultPrevented is
 * set, so calling preventDefault() here lets HeadlessUI still process the key.
 *
 * @param {HTMLElement}  bannerEl The banner wrapper element.
 * @param {KeyboardEvent} event   The keydown event.
 * @returns {void}
 */
function handleArrowNavInMenu( bannerEl, event ) {
	const menuEl = bannerEl.querySelector( "[role='menu']" );
	if ( menuEl && ( menuEl === event.target || menuEl.contains( event.target ) ) ) {
		event.preventDefault();
	}
}

/**
 * Handles Tab / Shift+Tab to keep the banner reachable inside Gutenberg's writing flow.
 * Because the banner sits outside any real block, it is normally skipped. This handler is
 * attached in the capture phase so it runs first; once it calls preventDefault(),
 * Gutenberg's early-return guard fires and leaves focus alone.
 *
 * @param {HTMLElement}  bannerEl The banner wrapper element.
 * @param {KeyboardEvent} event   The keydown event.
 * @returns {void}
 */
function handleTabNavigation( bannerEl, event ) {
	const findSibling = getFindSibling( event );
	const next = findSibling( event.target );

	// Intercept only when Tab or Shift+Tab crosses the banner boundary (entering or leaving).
	// Intra-banner navigation is already handled by Gutenberg via the data-block attribute.
	if ( next && involvesBanner( bannerEl, event.target, next ) ) {
		event.preventDefault();
		next.focus();
	}
}

/**
 * Keydown handler for the inline banner. Covers two cases:
 *
 * 1. Tab / Shift+Tab — keeps the banner reachable inside Gutenberg's writing flow.
 * 2. ArrowUp / ArrowDown — prevents Gutenberg's use-arrow-nav handler from stealing
 *    focus when the HeadlessUI dropdown menu is open.
 *
 * @param {HTMLElement}  bannerEl The banner wrapper element.
 * @param {KeyboardEvent} event   The keydown event.
 * @returns {void}
 */
export function handleBannerKeyNavigation( bannerEl, event ) {
	if ( event.defaultPrevented || ! bannerEl ) {
		return;
	}
	if ( [ "ArrowDown", "ArrowUp" ].includes( event.key ) ) {
		handleArrowNavInMenu( bannerEl, event );
		return;
	}
	if ( event.key === "Tab" ) {
		handleTabNavigation( bannerEl, event );
	}
}
