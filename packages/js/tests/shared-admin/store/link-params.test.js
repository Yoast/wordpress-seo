import {
	getInitialLinkParamsState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
} from "../../../src/shared-admin/store";

describe( "linkParams", () => {
	it( "LINKS_PARAMS_NAME is linkParams", () => {
		expect( LINK_PARAMS_NAME ).toBe( "linkParams" );
	} );

	describe( "actions", () => {
		it( "has no actions", () => {
			expect( linkParamsActions ).toEqual( {} );
		} );
	} );

	describe( "initial state", () => {
		it( "has an empty default state", () => {
			expect( getInitialLinkParamsState() ).toEqual( {} );
		} );
	} );

	describe( "reducer", () => {
		it( "has an empty default state", () => {
			expect( linkParamsReducer( {}, { type: "" } ) ).toEqual( {} );
		} );
	} );

	describe( "selectors", () => {
		const state = {
			[ LINK_PARAMS_NAME ]: {
				foo: "bar",
				one: "two",
			},
		};

		describe( "selectLinkParams", () => {
			it( "exists", () => {
				expect( linkParamsSelectors.selectLinkParams ).toBeTruthy();
			} );

			it( "returns an empty object by default", () => {
				expect( linkParamsSelectors.selectLinkParams( {} ) ).toEqual( {} );
			} );

			it( "returns all the link params", () => {
				expect( linkParamsSelectors.selectLinkParams( state ) ).toEqual( { foo: "bar", one: "two" } );
			} );
		} );

		describe( "selectLinkParam", () => {
			it( "exists", () => {
				expect( linkParamsSelectors.selectLinkParam ).toBeTruthy();
			} );

			it( "returns the link param", () => {
				expect( linkParamsSelectors.selectLinkParam( state, "foo", "" ) ).toBe( "bar" );
			} );

			it( "returns the default if the link param is not found", () => {
				expect( linkParamsSelectors.selectLinkParam( state, "baz" ) ).toEqual( {} );
			} );

			it( "returns the given default if the link param is not found", () => {
				expect( linkParamsSelectors.selectLinkParam( state, "baz", 3 ) ).toBe( 3 );
			} );
		} );

		describe( "selectLink", () => {
			it( "exists", () => {
				expect( linkParamsSelectors.selectLink ).toBeTruthy();
			} );

			it( "adds the link params to the given url", () => {
				expect( linkParamsSelectors.selectLink( state, "https://example.com" ) ).toBe( "https://example.com?foo=bar&one=two" );
			} );
		} );
	} );
} );
