import { act, renderHook } from "@testing-library/react";
import { useTourAnchor } from "../../../src/bulk-editor/components/tour/use-tour-anchor";

let resizeObserverDisconnect;

/**
 * Stubs an element's layout, since jsdom has none.
 *
 * @param {HTMLElement} element The element.
 * @param {Object}      rect    The bounding rect it should report.
 *
 * @returns {HTMLElement} The element.
 */
const stubLayout = ( element, rect ) => {
	// findVisibleTarget/isVisible skip elements whose offsetParent is null; jsdom always reports null.
	Object.defineProperty( element, "offsetParent", { get: () => document.body, configurable: true } );
	element.getBoundingClientRect = () => ( { ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height } );
	return element;
};

/**
 * Adds a tour target to the DOM with a stubbed layout.
 *
 * @param {Object} rect The bounding rect the target should report.
 *
 * @returns {HTMLElement} The target element.
 */
const addTarget = ( rect = { top: 10, left: 20, width: 100, height: 30 } ) => {
	document.body.innerHTML = "<div data-tour-id=\"x\"></div>";
	return stubLayout( document.querySelector( "[data-tour-id=\"x\"]" ), rect );
};

/**
 * Appends a stubbed child to a target.
 *
 * @param {HTMLElement} target The target.
 * @param {Object}      rect   The child's bounding rect.
 *
 * @returns {HTMLElement} The child.
 */
const addChild = ( target, rect ) => {
	const child = document.createElement( "div" );
	target.appendChild( child );
	return stubLayout( child, rect );
};

describe( "useTourAnchor", () => {
	beforeEach( () => {
		Element.prototype.scrollIntoView = jest.fn();
		resizeObserverDisconnect = jest.fn();
		global.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {
				resizeObserverDisconnect();
			}
		};
	} );

	afterEach( () => {
		document.body.innerHTML = "";
	} );

	it( "returns no spotlight when inactive", () => {
		addTarget();

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", false ) );

		expect( result.current.spotlight ).toBeNull();
	} );

	it( "cuts one padded rectangle for the whole target when active", () => {
		const target = addTarget( { top: 10, left: 20, width: 100, height: 30 } );

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true ) );

		// The target rect grows by the uniform 6px spotlight padding on every side.
		expect( result.current.spotlight.rects ).toEqual( [ { top: 4, left: 14, width: 112, height: 42, rx: 8 } ] );
		expect( result.current.spotlight.bounds ).toEqual( { top: "4px", left: "14px", width: "112px", height: "42px" } );
		expect( result.current.spotlight.viewport ).toEqual( { width: window.innerWidth, height: window.innerHeight } );
		expect( target.scrollIntoView ).toHaveBeenCalled();
	} );

	it( "clamps a single-region rectangle to the end element's bottom", () => {
		const target = addTarget( { top: 10, left: 20, width: 100, height: 90 } );
		const end = addChild( target, { top: 40, left: 20, width: 100, height: 20 } );
		end.setAttribute( "data-tour-highlight-end", "true" );

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true, { endSelector: "[data-tour-highlight-end]" } ) );

		// Height spans from the padded top (4) to the end element's bottom (60), not the target's own 90-tall rect.
		expect( result.current.spotlight.rects ).toEqual( [ { top: 4, left: 14, width: 112, height: 56, rx: 8 } ] );
	} );

	it( "cuts one rectangle per visible child with perChild", () => {
		const target = addTarget( { top: 10, left: 20, width: 200, height: 30 } );
		addChild( target, { top: 12, left: 22, width: 16, height: 16 } );
		addChild( target, { top: 10, left: 60, width: 80, height: 28 } );

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true, { perChild: true } ) );

		// Each cut-out matches its child's exact size (no padding), so the gap between them stays dimmed.
		expect( result.current.spotlight.rects ).toEqual( [
			{ top: 12, left: 22, width: 16, height: 16, rx: 0 },
			{ top: 10, left: 60, width: 80, height: 28, rx: 0 },
		] );
		// The bounds union spans both children.
		expect( result.current.spotlight.bounds ).toEqual( { top: "10px", left: "22px", width: "118px", height: "28px" } );
	} );

	it( "cuts one rectangle per matching descendant with childSelector, leaving siblings dimmed", () => {
		const target = addTarget( { top: 10, left: 20, width: 300, height: 30 } );
		// A non-button sibling (e.g. Premium's AI usage counter) that must stay dimmed.
		addChild( target, { top: 12, left: 22, width: 40, height: 16 } );
		const button = document.createElement( "button" );
		target.appendChild( button );
		stubLayout( button, { top: 10, left: 100, width: 80, height: 28 } );

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true, { perChild: true, childSelector: "button" } ) );

		// Only the button is cut out; the sibling counter keeps no hole.
		expect( result.current.spotlight.rects ).toEqual( [ { top: 10, left: 100, width: 80, height: 28, rx: 0 } ] );
	} );

	it( "returns no spotlight for perChild when the target has no visible children", () => {
		addTarget();

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true, { perChild: true } ) );

		expect( result.current.spotlight ).toBeNull();
	} );

	it( "disconnects the observer on cleanup", () => {
		addTarget();

		const { unmount } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true ) );
		unmount();

		expect( resizeObserverDisconnect ).toHaveBeenCalled();
	} );

	it( "returns no spotlight when the target is absent", () => {
		document.body.innerHTML = "";

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"missing\"]", true ) );

		expect( result.current.spotlight ).toBeNull();
	} );

	it( "flags the target as missing once the poll gives up", () => {
		jest.useFakeTimers();
		try {
			document.body.innerHTML = "";

			const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"missing\"]", true ) );
			expect( result.current.targetMissing ).toBe( false );

			// Advance past the 2s poll window so it stops looking and reports the target missing.
			act( () => {
				jest.advanceTimersByTime( 2500 );
			} );

			expect( result.current.targetMissing ).toBe( true );
		} finally {
			jest.useRealTimers();
		}
	} );
} );
