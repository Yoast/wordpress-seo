/**
 * Ensures `reactRoot` is available on `window.wp.element`.
 *
 * In React 18 `render` is deprecated and `createRoot` should be used instead.
 * WP 6.2 upgrades React to 18, via `@wordpress/element` (5.0.0).
 * Therefor, we have to support both `render` and `createRoot`.
 *
 * This patch makes it so that we can always use `createRoot` in our code:
 * * If you are on < WP 6.2 you will use `render` via this patch.
 * * If you are on >= WP 6.2 you will use the normal `createRoot`.
 *
 * This patch can be removed once the lowest supported WP version is 6.2.
 */
if ( ! window.wp?.element?.createRoot && typeof window.wp?.element?.render === "function" ) {
	/**
	 * Adds a monkey patched `createRoot` that returns the old `render` with the new API.
	 * @param {HTMLElement} domNode The node to render in.
	 * @returns {{unmount: (function(): void), render: (function(*): *)}} Polyfill of `createRoot` via `render`.
	 */
	window.wp.element.createRoot = ( domNode ) => ( {
		render: ( reactNode ) => {
			console.warn( "Yoast SEO: Using patched `reactRoot.render()`!", domNode );
			window.wp.element.render( reactNode, domNode );
		},
		unmount: () => console.error( "Unsupported in this patch!" ),
	} );
}
