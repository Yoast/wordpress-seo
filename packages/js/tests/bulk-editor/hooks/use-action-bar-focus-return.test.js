import { renderHook } from "@testing-library/react";
import { useSelect } from "@wordpress/data";
import { useActionBarFocusReturn } from "../../../src/bulk-editor/hooks/use-action-bar-focus-return";

jest.mock( "@wordpress/data", () => ( { useSelect: jest.fn() } ) );

describe( "useActionBarFocusReturn", () => {
	let getElementByIdSpy;

	beforeEach( () => {
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( {
			selectActiveFieldSet: () => "search",
		} ) ) );
		getElementByIdSpy = jest.spyOn( document, "getElementById" );
	} );

	afterEach( () => {
		getElementByIdSpy.mockRestore();
	} );

	it( "focuses the Select menu button when it exists in the DOM", () => {
		const focus = jest.fn();
		getElementByIdSpy.mockReturnValue( { focus } );

		const { result } = renderHook( () => useActionBarFocusReturn() );
		result.current( { currentTarget: { blur: jest.fn() } } );

		expect( focus ).toHaveBeenCalledTimes( 1 );
	} );

	it( "blurs the current target when the Select menu button is absent", () => {
		getElementByIdSpy.mockReturnValue( null );

		const blur = jest.fn();
		const { result } = renderHook( () => useActionBarFocusReturn() );
		result.current( { currentTarget: { blur } } );

		expect( blur ).toHaveBeenCalledTimes( 1 );
	} );

	it( "looks up the button ID built from the active field set", () => {
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( {
			selectActiveFieldSet: () => "seo-title",
		} ) ) );
		getElementByIdSpy.mockReturnValue( null );

		const { result } = renderHook( () => useActionBarFocusReturn() );
		result.current( { currentTarget: { blur: jest.fn() } } );

		expect( getElementByIdSpy ).toHaveBeenCalledWith( "yst-bulk-editor-select-menu-seo-title-button" );
	} );

	it( "looks up the correct button ID for the default field set", () => {
		getElementByIdSpy.mockReturnValue( null );

		const { result } = renderHook( () => useActionBarFocusReturn() );
		result.current( { currentTarget: { blur: jest.fn() } } );

		expect( getElementByIdSpy ).toHaveBeenCalledWith( "yst-bulk-editor-select-menu-search-button" );
	} );

	it( "returns a stable callback reference when activeFieldSet has not changed", () => {
		const { result, rerender } = renderHook( () => useActionBarFocusReturn() );
		const first = result.current;
		rerender();
		expect( result.current ).toBe( first );
	} );

	it( "returns a new callback when activeFieldSet changes", () => {
		let fieldSet = "search";
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( {
			selectActiveFieldSet: () => fieldSet,
		} ) ) );

		const { result, rerender } = renderHook( () => useActionBarFocusReturn() );
		const first = result.current;

		fieldSet = "seo-title";
		rerender();

		expect( result.current ).not.toBe( first );
	} );
} );
