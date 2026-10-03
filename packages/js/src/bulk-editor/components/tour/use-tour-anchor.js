import { useState, useEffect } from "@wordpress/element";

// How long to keep looking for a target that mounts asynchronously (e.g. the generate actions bar that only appears once
// rows are selected), and how often to re-check, before giving up on the step.
const TARGET_WAIT_MS = 2000;
const TARGET_POLL_MS = 100;

// How many animation frames to keep re-measuring after the tour opens, so a target that shifts while the page settles
// is followed until it stops moving, then left to the scroll/resize/ResizeObserver listeners.
const SETTLE_MAX_FRAMES = 40;

// Space (px) around a single-region spotlight so it surrounds the target without looking clipped.
const SPOTLIGHT_PADDING = { top: 6, right: 6, bottom: 6, left: 6 };
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
 * Whether an element exists and is visible.
 *
 * @param {HTMLElement} element The element.
 *
 * @returns {boolean} Whether it is visible.
 */
const isVisible = ( element ) => element.offsetParent !== null && element.getBoundingClientRect().width > 0;

/**
 * Measures the spotlight rectangles in viewport coordinates for a target.
 *
 * @param {HTMLElement} element       The target element.
 * @param {boolean}     perChild      Whether to spotlight per matching child rather than the whole target.
 * @param {?string}     childSelector With `perChild`, the descendants to spotlight; otherwise every direct child.
 * @param {?string}     endSelector   For a single-region spotlight, the element whose bottom clamps its height.
 *
 * @returns {Array<Object>} The rectangles ({ top, left, width, height, rx }).
 */
const measureRects = ( element, perChild, childSelector, endSelector ) => {
	if ( perChild ) {
		const children = childSelector ? [ ...element.querySelectorAll( childSelector ) ] : [ ...element.children ];
		return children.filter( isVisible ).map( ( child ) => {
			const childRect = child.getBoundingClientRect();
			return { top: childRect.top, left: childRect.left, width: childRect.width, height: childRect.height, rx: cornerRadius( child ) };
		} );
	}

	const rect = element.getBoundingClientRect();
	const endElement = endSelector ? element.querySelector( endSelector ) : null;
	const top = rect.top - SPOTLIGHT_PADDING.top;
	const bottom = endElement ? endElement.getBoundingClientRect().bottom : rect.bottom + SPOTLIGHT_PADDING.bottom;
	return [ {
		top,
		left: rect.left - SPOTLIGHT_PADDING.left,
		width: rect.width + SPOTLIGHT_PADDING.left + SPOTLIGHT_PADDING.right,
		height: bottom - top,
		rx: SINGLE_REGION_RADIUS,
	} ];
};

/**
 * Re-bases rects onto the fixed spotlight overlay. Its origin is not always the viewport's (an RTL document scrollbar
 * shifts a fixed element's left edge), so subtracting it keeps the cut-outs and card aligned with their targets, which
 * were measured in viewport coordinates. A no-op when the overlay sits at the origin (the LTR case).
 *
 * @param {Array<Object>} rects The rectangles in viewport coordinates.
 *
 * @returns {Array<Object>} The rectangles relative to the overlay.
 */
const rebaseToOverlay = ( rects ) => {
	const overlay = document.querySelector( ".yst-tour-spotlight" );
	if ( ! overlay ) {
		return rects;
	}
	const { left, top } = overlay.getBoundingClientRect();
	if ( left === 0 && top === 0 ) {
		return rects;
	}
	return rects.map( ( rect ) => ( { ...rect, left: rect.left - left, top: rect.top - top } ) );
};

/**
 * The bounding box enclosing every rectangle.
 *
 * @param {Array<Object>} rects The rectangles.
 *
 * @returns {{top: string, left: string, width: string, height: string}} The bounds.
 */
const boundsOf = ( rects ) => {
	const minLeft = Math.min( ...rects.map( ( rect ) => rect.left ) );
	const minTop = Math.min( ...rects.map( ( rect ) => rect.top ) );
	const maxRight = Math.max( ...rects.map( ( rect ) => rect.left + rect.width ) );
	const maxBottom = Math.max( ...rects.map( ( rect ) => rect.top + rect.height ) );
	return { top: `${ minTop }px`, left: `${ minLeft }px`, width: `${ maxRight - minLeft }px`, height: `${ maxBottom - minTop }px` };
};

/**
 * Tracks a target element and returns the spotlight rectangles.
 *
 * @param {string}  targetSelector The `[data-tour-id="…"]` selector of the element the step points at.
 * @param {boolean} isActive       Whether this step is the active one; only then is the target measured.
 * @param {Object}  [options]      Extra options.
 * @param {string}  [options.endSelector] Selector, resolved within the target, whose bottom clamps a single-region spotlight.
 * @param {boolean} [options.perChild]    Whether to spotlight per visible direct child instead of one for the target.
 * @param {string}  [options.childSelector] With `perChild`, spotlight the matching descendants instead of every direct
 *                                          child, so slot-filled siblings (e.g. Premium's AI usage counter) stay dimmed.
 *
 * @returns {{spotlight: ({rects: Array<Object>, bounds: Object, viewport: Object}|null), targetMissing: boolean}} The
 *          spotlight area (or null), and whether the target could not be found before the poll gave up.
 */
export const useTourAnchor = ( targetSelector, isActive, { endSelector = null, perChild = false, childSelector = null } = {} ) => {
	const [ spotlight, setSpotlight ] = useState( null );
	const [ targetMissing, setTargetMissing ] = useState( false );
	// Reset the flag synchronously when the step changes, so a stale `true` from the previous step can't make the caller
	// skip the new one before the effect below re-runs.
	const [ trackedSelector, setTrackedSelector ] = useState( targetSelector );
	if ( targetSelector !== trackedSelector ) {
		setTrackedSelector( targetSelector );
		setTargetMissing( false );
	}

	useEffect( () => {
		if ( ! isActive ) {
			return;
		}

		let pollTimer = null;
		let cleanup = null;

		const attach = ( element ) => {
			// Instant, minimal scroll: only nudge the target into view if it is off-screen.
			element.scrollIntoView( { block: "nearest" } );

			// The JSON of the last rendered spotlight; the frequent re-measures only re-render when it actually changed.
			let renderedKey = "";

			const updatePosition = () => {
				const rects = measureRects( element, perChild, childSelector, endSelector );

				// No visible children yet (e.g. the generate AI actions row before it mounts): render nothing rather than
				// an empty, fully-dimmed overlay.
				if ( rects.length === 0 ) {
					if ( renderedKey !== "none" ) {
						renderedKey = "none";
						setSpotlight( null );
					}
					return;
				}

				const overlaid = rebaseToOverlay( rects );
				const next = {
					rects: overlaid,
					bounds: boundsOf( overlaid ),
					viewport: { width: window.innerWidth, height: window.innerHeight },
				};
				const key = JSON.stringify( next );
				if ( key !== renderedKey ) {
					renderedKey = key;
					setSpotlight( next );
				}
			};
			updatePosition();

			window.addEventListener( "scroll", updatePosition, true );
			window.addEventListener( "resize", updatePosition );
			const resizeObserver = new ResizeObserver( updatePosition );
			resizeObserver.observe( element );

			// Premium fills the generate step's slot asynchronously: its AI usage counter arrives after a fetch and, in
			// RTL, shifts the buttons sideways without changing the container's own size — which the ResizeObserver would
			// miss. Watch the subtree so an added/updated node re-measures the (now moved) buttons.
			const mutationObserver = new MutationObserver( updatePosition );
			mutationObserver.observe( element, { childList: true, subtree: true, attributes: true, characterData: true } );

			// The target can also shift while the page first settles (sidebar/table layout, fonts, the RTL scrollbar),
			// before any observer fires. Re-measure each frame for a short, capped window; the signature guard keeps this
			// from re-rendering when nothing changed.
			let settleFrame = null;
			let settleTicks = 0;
			const settle = () => {
				updatePosition();
				settleTicks += 1;
				if ( settleTicks < SETTLE_MAX_FRAMES ) {
					settleFrame = requestAnimationFrame( settle );
				}
			};
			settleFrame = requestAnimationFrame( settle );

			cleanup = () => {
				if ( settleFrame !== null ) {
					cancelAnimationFrame( settleFrame );
				}
				window.removeEventListener( "scroll", updatePosition, true );
				window.removeEventListener( "resize", updatePosition );
				resizeObserver.disconnect();
				mutationObserver.disconnect();
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
			} else {
				setTargetMissing( true );
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
	}, [ targetSelector, isActive, endSelector, perChild, childSelector ] );

	return { spotlight, targetMissing };
};
