import { useState, useEffect } from "@wordpress/element";

// How long to keep looking for a target that mounts asynchronously (e.g. the generate actions bar that only appears once
// rows are selected), and how often to re-check, before giving up on the step.
const TARGET_WAIT_MS = 2000;
const TARGET_POLL_MS = 100;

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
 * Positions the tour card against a target element and moves the spotlight highlight onto it.
 *
 * @param {string}  targetSelector The `[data-tour-id="…"]` selector of the element the step points at.
 * @param {boolean} isActive       Whether this step is the active one; only then is the target measured and highlighted.
 *
 * @returns {{style: Object|null}} The wrapper's absolute-position style, or null while no target is found.
 */
export const useTourAnchor = ( targetSelector, isActive ) => {
	const [ style, setStyle ] = useState( null );

	useEffect( () => {
		if ( ! isActive ) {
			return;
		}

		let pollTimer = null;
		let cleanup = null;

		const attach = ( element ) => {
			element.classList.add( "yst-feature-highlight" );
			element.scrollIntoView( { behavior: "smooth", block: "center" } );

			const updatePosition = () => {
				const rect = element.getBoundingClientRect();
				setStyle( {
					top: `${ rect.top }px`,
					left: `${ rect.left }px`,
					width: `${ rect.width }px`,
					height: `${ rect.height }px`,
				} );
			};
			updatePosition();

			window.addEventListener( "scroll", updatePosition, true );
			window.addEventListener( "resize", updatePosition );
			const observer = new ResizeObserver( updatePosition );
			observer.observe( element );

			cleanup = () => {
				element.classList.remove( "yst-feature-highlight" );
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
			setStyle( null );
		};
	}, [ targetSelector, isActive ] );

	return { style };
};
