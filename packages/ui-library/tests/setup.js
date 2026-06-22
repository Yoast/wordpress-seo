/**
 * Test setup: polyfill browser APIs that jsdom lacks but Headless UI relies on.
 *
 * Headless UI's open `Dialog` (used by Modal and ModalNotification) and some of
 * its other primitives reference `IntersectionObserver` and `ResizeObserver`,
 * which jsdom does not implement. These are inert no-op stubs: they let the
 * components mount in the render smoke test without affecting behaviour.
 */

/* eslint-disable jsdoc/require-jsdoc -- Inert no-op stubs for jsdom. */
class MockObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}
/* eslint-enable jsdoc/require-jsdoc */

if ( typeof global.IntersectionObserver === "undefined" ) {
	global.IntersectionObserver = MockObserver;
}

if ( typeof global.ResizeObserver === "undefined" ) {
	global.ResizeObserver = MockObserver;
}

// jsdom does not implement scrollIntoView, which Headless UI calls on focus.
if ( typeof Element !== "undefined" && ! Element.prototype.scrollIntoView ) {
	Element.prototype.scrollIntoView = () => {};
}
