import PropTypes from "prop-types";
import { renderHook } from "../../test-utils";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useFeatureHighlight } from "../../../src/general/hooks/use-feature-highlight";

/**
 * Builds a MemoryRouter wrapper for renderHook with the given initial entries.
 *
 * @param {Array} initialEntries The initial router entries.
 *
 * @returns {Function} A wrapper component that provides a MemoryRouter.
 */
const createWrapper = ( initialEntries ) => {
	const RouterWrapper = ( { children } ) => <MemoryRouter initialEntries={ initialEntries }>{ children }</MemoryRouter>;
	RouterWrapper.displayName = "RouterWrapper";
	RouterWrapper.propTypes = { children: PropTypes.node.isRequired };
	return RouterWrapper;
};

describe( "useFeatureHighlight", () => {
	it( "is active when the location state highlight matches", () => {
		const { result } = renderHook( () => useFeatureHighlight( "task-list" ), {
			wrapper: createWrapper( [ { pathname: "/task-list", state: { highlight: "task-list" } } ] ),
		} );

		expect( result.current[ 0 ] ).toBe( true );
	} );

	it( "is inactive when there is no highlight state", () => {
		const { result } = renderHook( () => useFeatureHighlight( "task-list" ), {
			wrapper: createWrapper( [ "/task-list" ] ),
		} );

		expect( result.current[ 0 ] ).toBe( false );
	} );

	it( "is inactive when the highlight value does not match", () => {
		const { result } = renderHook( () => useFeatureHighlight( "task-list" ), {
			wrapper: createWrapper( [ { pathname: "/task-list", state: { highlight: "other-feature" } } ] ),
		} );

		expect( result.current[ 0 ] ).toBe( false );
	} );

	it( "consumes the highlight on mount while preserving the search and hash", () => {
		const { result } = renderHook( () => ( { highlight: useFeatureHighlight( "task-list" ), location: useLocation() } ), {
			wrapper: createWrapper( [ { pathname: "/task-list", search: "?tab=overview", hash: "#section", state: { highlight: "task-list" } } ] ),
		} );

		// The highlight stays active for this render, but the signal is stripped from the location.
		expect( result.current.highlight[ 0 ] ).toBe( true );
		expect( result.current.location.pathname ).toBe( "/task-list" );
		expect( result.current.location.search ).toBe( "?tab=overview" );
		expect( result.current.location.hash ).toBe( "#section" );
		expect( result.current.location.state ).toBeNull();
	} );

	it( "removes only the highlight key and keeps other state", () => {
		const { result } = renderHook( () => ( { highlight: useFeatureHighlight( "task-list" ), location: useLocation() } ), {
			wrapper: createWrapper( [ { pathname: "/task-list", state: { highlight: "task-list", returnTo: "/dashboard" } } ] ),
		} );

		expect( result.current.location.state ).toEqual( { returnTo: "/dashboard" } );
	} );
} );
