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
		describe( "setLinkParams", () => {
			it( "exists", () => {
				expect( linkParamsActions.setLinkParams ).toBeTruthy();
			} );

			it( "is a function", () => {
				expect( typeof linkParamsActions.setLinkParams ).toBe( "function" );
			} );

			it( "returns an action object", () => {
				expect( linkParamsActions.setLinkParams( { foo: "bar" } ) ).toEqual( {
					type: "linkParams/setLinkParams",
					payload: { foo: "bar" },
				} );
			} );

			it( "sets the state", () => {
				const actual = linkParamsReducer( {}, linkParamsActions.setLinkParams( { foo: "bar" } ) );
				expect( actual ).toEqual( { foo: "bar" } );
			} );
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

			it( "adds extra params to the given url", () => {
				expect( linkParamsSelectors.selectLink( state, "https://example.com", { extra: true } ) ).toBe( "https://example.com?foo=bar&one=two&extra=true" );
			} );
		} );
	} );
} );
