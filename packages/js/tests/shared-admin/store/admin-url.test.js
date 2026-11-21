import { describe, expect, it, test } from "@jest/globals";
import { ADMIN_URL_NAME, adminUrlActions, adminUrlReducer, adminUrlSelectors, getInitialAdminUrlState } from "../../../src/shared-admin/store";

describe( "adminUrl", () => {
	it( "ADMIN_URL_NAME is adminUrl", () => {
		expect( ADMIN_URL_NAME ).toBe( "adminUrl" );
	} );

	describe( "actions", () => {
		describe( "setAdminUrl", () => {
			it( "exists", () => {
				expect( adminUrlActions.setAdminUrl ).toBeTruthy();
			} );

			it( "is a function", () => {
				expect( typeof adminUrlActions.setAdminUrl ).toBe( "function" );
			} );

			it( "returns an action object", () => {
				expect( adminUrlActions.setAdminUrl( "https://example.com" ) ).toEqual( {
					type: "adminUrl/setAdminUrl",
					payload: "https://example.com",
				} );
			} );

			it( "sets the state", () => {
				const actual = adminUrlReducer( "", adminUrlActions.setAdminUrl( "https://example.com" ) );
				expect( actual ).toBe( "https://example.com" );
			} );
		} );
	} );

	describe( "initial state", () => {
		it( "has an empty default state", () => {
			expect( getInitialAdminUrlState() ).toBe( "" );
		} );
	} );

	describe( "reducer", () => {
		it( "has an empty default state", () => {
			expect( adminUrlReducer( undefined, { type: "" } ) ).toBe( "" );
		} );
	} );

	describe( "selectors", () => {
		const state = {
			[ ADMIN_URL_NAME ]: "https://example.com/",
		};

		describe( "selectAdminUrl", () => {
			it( "exists", () => {
				expect( adminUrlSelectors.selectAdminUrl ).toBeTruthy();
			} );

			it( "returns an empty string by default", () => {
				expect( adminUrlSelectors.selectAdminUrl( {} ) ).toBe( "" );
			} );

			it( "returns the admin URL", () => {
				expect( adminUrlSelectors.selectAdminUrl( state ) ).toBe( "https://example.com/" );
			} );
		} );

		describe( "selectAdminLink", () => {
			it( "exists", () => {
				expect( adminUrlSelectors.selectAdminLink ).toBeTruthy();
			} );

			it( "returns the admin URL without parameters", () => {
				expect( adminUrlSelectors.selectAdminLink( state ) ).toBe( "https://example.com/" );
			} );

			test.each( [
				[ "foo", "https://example.com/foo" ],
				// Takes just the base from the current admin URL.
				[ "plugin.php", "https://example.com/plugin.php", "https://example.com/admin.php" ],
				// Can handle query parameters.
				[ "?page=foo", "https://example.com/admin.php?page=foo", "https://example.com/admin.php" ],
				// Can handle hash parameters.
				[ "#foo", "https://example.com/admin.php#foo", "https://example.com/admin.php" ],
				// Can handle query and hash parameters.
				[ "?page=foo#bar", "https://example.com/admin.php?page=foo#bar", "https://example.com/admin.php" ],
				// Can handle full URLs: overriding the admin URL.
				[ "https://other.com/foo", "https://other.com/foo" ],
			] )( "returns a combined URL when passing %p", ( link, expected, adminUrl = "https://example.com/" ) => {
				expect( adminUrlSelectors.selectAdminLink( { [ ADMIN_URL_NAME ]: adminUrl }, link ) ).toBe( expected );
			} );

			it( "returns the admin URL if not able to combine", () => {
				/**
				 * Fake class to throw an error when calling toString.
				 */
				class Test {
					toString() {
						throw new Error( "Test error" );
					}
				}

				expect( adminUrlSelectors.selectAdminLink( state, new Test() ) ).toBe( "https://example.com/" );
			} );
		} );
	} );
} );
