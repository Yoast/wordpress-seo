import { useState, useEffect } from "@wordpress/element";

// How long to keep looking for a target that mounts asynchronously (e.g. the generate actions bar that only appears once
// rows are selected), and how often to re-check, before giving up on the step.
const TARGET_WAIT_MS = 2000;
const TARGET_POLL_MS = 100;

// Space (px) around a single-region spotlight. The right side gets extra room for the gap to the popover.
const SPOTLIGHT_PADDING = { top: 8, right: 24, bottom: 8, left: 8 };
// Corner radius (px) for a single-region cut-out, which covers an area rather than one styled control.
const SINGLE_REGION_RADIUS = 8;

/**
 * Reads the corner radius to match a control's cut-out to its rounded corners. Direct children are sometimes plain
 * wrappers (radius 0) around the styled control, so it falls back to the first child's radius.
 *
 * @param {HTMLElement} element The element.
 *
 * @returns {number} The corner radius in pixels.
 */
const cornerRadius = ( element ) => {
	const own = parseFloat( getComputedStyle( element ).borderTopLeftRadius ) || 0;
	if ( own > 0 ) {
		return own;
	}
	return element.firstElementChild
		? parseFloat( getComputedStyle( element.firstElementChild ).borderTopLeftRadius ) || 0
		: 0;
};

/**
 * Finds the visible element for a tour target.
 *
 * @param {string} selector The `[data-tour-id="…"]` selector.
 *
 * @returns {HTMLElement|null} The visible matching element, or null.
 */
const findVisibleTarget = ( selector ) =>
	[ ...document.querySelectorAll( selector ) ].find( ( element ) => element.offsetParent !== null ) ?? null;

/**
 * Whether an element exsists and is visible.
 *
 * @param {HTMLElement} element The element.
 *
 * @returns {boolean} Whether it is visible.
 */
const isVisible = ( element ) => element.offsetParent !== null && element.getBoundingClientRect().width > 0;

/**
 * Tracks a target element and returns the spotlight rectangles.
 *
 * @param {string}  targetSelector The `[data-tour-id="…"]` selector of the element the step points at.
 * @param {boolean} isActive       Whether this step is the active one; only then is the target measured.
 * @param {Object}  [options]      Extra options.
 * @param {string}  [options.endSelector] Selector, resolved within the target, whose bottom clamps a single-region spotlight.
 * @param {boolean} [options.perChild]    Whether to spotlight per visible direct child instead of one for the target.
 *
 * @returns {{spotlight: {rects: Array<Object>, bounds: Object, viewport: Object}|null}} The spotlight geometry, or null.
 */
export const useTourAnchor = ( targetSelector, isActive, { endSelector = null, perChild = false } = {} ) => {
	const [ spotlight, setSpotlight ] = useState( null );

	useEffect( () => {
		if ( ! isActive ) {
			return;
		}

		let pollTimer = null;
		let cleanup = null;

		const attach = ( element ) => {
			// Instant, minimal scroll: only nudge the target into view if it is off-screen.
			element.scrollIntoView( { block: "nearest" } );

			const updatePosition = () => {
				let rects;
				if ( perChild ) {
					rects = [ ...element.children ].filter( isVisible ).map( ( child ) => {
						const rect = child.getBoundingClientRect();
						return {
							top: rect.top,
							left: rect.left,
							width: rect.width,
							height: rect.height,
							rx: cornerRadius( child ),
						};
					} );
				} else {
					const rect = element.getBoundingClientRect();
					// Clamp to the end element's bottom when present, so the rest of the target stays dimmed.
					const endElement = endSelector ? element.querySelector( endSelector ) : null;
					const top = rect.top - SPOTLIGHT_PADDING.top;
					const bottom = endElement
						? endElement.getBoundingClientRect().bottom
						: rect.bottom + SPOTLIGHT_PADDING.bottom;
					rects = [ {
						top,
						left: rect.left - SPOTLIGHT_PADDING.left,
						width: rect.width + SPOTLIGHT_PADDING.left + SPOTLIGHT_PADDING.right,
						height: bottom - top,
						rx: SINGLE_REGION_RADIUS,
					} ];
				}

				// No visible children yet (e.g. the generate AI actions row before it mounts): render nothing rather than an
				// empty, fully-dimmed overlay.
				if ( rects.length === 0 ) {
					setSpotlight( null );
					return;
				}

				const minLeft = Math.min( ...rects.map( ( rect ) => rect.left ) );
				const minTop = Math.min( ...rects.map( ( rect ) => rect.top ) );
				const maxRight = Math.max( ...rects.map( ( rect ) => rect.left + rect.width ) );
				const maxBottom = Math.max( ...rects.map( ( rect ) => rect.top + rect.height ) );

				setSpotlight( {
					rects,
					bounds: {
						top: `${ minTop }px`,
						left: `${ minLeft }px`,
						width: `${ maxRight - minLeft }px`,
						height: `${ maxBottom - minTop }px`,
					},
					viewport: { width: window.innerWidth, height: window.innerHeight },
				} );
			};
			updatePosition();

			window.addEventListener( "scroll", updatePosition, true );
			window.addEventListener( "resize", updatePosition );
			const observer = new ResizeObserver( updatePosition );
			observer.observe( element );

			cleanup = () => {
				window.removeEventListener( "scroll", updatePosition, true );
				window.removeEventListener( "resize", updatePosition );
				observer.disconnect();
			};
		};

		// The target may not be in the DOM yet (e.g. the generate action buttons appear only after step 4 selects rows),
		// so poll briefly until it shows up.
		const deadline = Date.now() + TARGET_WAIT_MS;
		const tryAttach = () => {
			const element = findVisibleTarget( targetSelector );
			if ( element ) {
				attach( element );
				return;
			}
			if ( Date.now() < deadline ) {
				pollTimer = setTimeout( tryAttach, TARGET_POLL_MS );
			}
		};
		tryAttach();

		return () => {
			if ( pollTimer ) {
				clearTimeout( pollTimer );
			}
			if ( cleanup ) {
				cleanup();
			}
			setSpotlight( null );
		};
	}, [ targetSelector, isActive, endSelector, perChild ] );

	return { spotlight };
};
