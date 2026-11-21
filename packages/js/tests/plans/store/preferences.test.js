import { describe, expect, it } from "@jest/globals";
import {
	getInitialPreferencesState,
	PREFERENCES_NAME,
	preferencesActions,
	preferencesReducer,
	preferencesSelectors,
} from "../../../src/plans/store/preferences";

it( "PREFERENCES_NAME is preferences", () => {
	expect( PREFERENCES_NAME ).toBe( "preferences" );
} );

describe( "actions", () => {
	it( "has no actions", () => {
		expect( preferencesActions ).toEqual( {} );
	} );
} );

describe( "initial state", () => {
	it( "has an empty default state", () => {
		expect( getInitialPreferencesState() ).toEqual( {} );
	} );
} );

describe( "reducer", () => {
	it( "has an empty default state", () => {
		expect( preferencesReducer( {}, { type: "" } ) ).toEqual( {} );
	} );
} );

describe( "selectors", () => {
	const state = {
		[ PREFERENCES_NAME ]: {
			foo: "bar",
		},
	};

	describe( "selectPreferences", () => {
		it( "exists", () => {
			expect( preferencesSelectors.selectPreferences ).toBeTruthy();
		} );

		it( "returns an empty object by default", () => {
			expect( preferencesSelectors.selectPreferences( {} ) ).toEqual( {} );
		} );

		it( "returns all the preferences", () => {
			expect( preferencesSelectors.selectPreferences( state ) ).toEqual( state[ PREFERENCES_NAME ] );
		} );
	} );

	describe( "selectPreference", () => {
		it( "exists", () => {
			expect( preferencesSelectors.selectPreference ).toBeTruthy();
		} );

		it( "returns the link param", () => {
			expect( preferencesSelectors.selectPreference( state, "foo" ) ).toBe( "bar" );
		} );

		it( "returns the default if the preference is not found", () => {
			expect( preferencesSelectors.selectPreference( state, "baz" ) ).toEqual( false );
			expect( preferencesSelectors.selectPreference( state, "baz", "foo" ) ).toEqual( "foo" );
		} );

		it( "returns the given default if the preference is not found", () => {
			expect( preferencesSelectors.selectPreference( state, "baz", 3 ) ).toBe( 3 );
		} );
	} );
} );
