import { renderHook } from "@testing-library/react";
import { useTourAnchor } from "../../../src/bulk-editor/components/tour/use-tour-anchor";

let resizeObserverDisconnect;

/**
 * Adds a tour target to the DOM with a stubbed layout, since jsdom has none.
 *
 * @param {Object} rect The bounding rect the element should report.
 * @returns {HTMLElement} The target element.
 */
const addTarget = ( rect = { top: 10, left: 20, width: 100, height: 30 } ) => {
	document.body.innerHTML = "<div data-tour-id=\"x\"></div>";
	const target = document.querySelector( "[data-tour-id=\"x\"]" );
	// findVisibleTarget skips elements whose offsetParent is null; jsdom always reports null.
	Object.defineProperty( target, "offsetParent", { get: () => document.body, configurable: true } );
	target.getBoundingClientRect = () => ( { ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height } );
	return target;
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

	it( "returns no style and does not highlight when inactive", () => {
		const target = addTarget();

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", false ) );

		expect( result.current.style ).toBeNull();
		expect( target.classList.contains( "yst-feature-highlight" ) ).toBe( false );
	} );

	it( "positions against the target and applies the spotlight when active", () => {
		const target = addTarget( { top: 10, left: 20, width: 100, height: 30 } );

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true ) );

		expect( result.current.style ).toEqual( { top: "10px", left: "20px", width: "100px", height: "30px" } );
		expect( target.classList.contains( "yst-feature-highlight" ) ).toBe( true );
		expect( target.scrollIntoView ).toHaveBeenCalled();
	} );

	it( "removes the spotlight and disconnects the observer on cleanup", () => {
		const target = addTarget();

		const { unmount } = renderHook( () => useTourAnchor( "[data-tour-id=\"x\"]", true ) );
		unmount();

		expect( target.classList.contains( "yst-feature-highlight" ) ).toBe( false );
		expect( resizeObserverDisconnect ).toHaveBeenCalled();
	} );

	it( "returns no style when the target is absent", () => {
		document.body.innerHTML = "";

		const { result } = renderHook( () => useTourAnchor( "[data-tour-id=\"missing\"]", true ) );

		expect( result.current.style ).toBeNull();
	} );
} );
