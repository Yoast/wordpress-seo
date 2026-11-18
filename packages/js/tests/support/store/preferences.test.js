import {
	getInitialPreferencesState,
	PREFERENCES_NAME,
	preferencesActions,
	preferencesReducer,
	preferencesSelectors,
} from "../../../src/support/store/preferences";

describe( "preferences", () => {
	it( "the name is linkParams", () => {
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
				upsellSettings: {
					actionId: "id",
					premiumCtbId: "1234",
					otherCtbId: "5678",
				},
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
				expect( preferencesSelectors.selectPreferences( state ) )
					.toEqual( { foo: "bar", upsellSettings: { actionId: "id", premiumCtbId: "1234", otherCtbId: "5678" } } );
			} );
		} );

		describe( "selectPreference", () => {
			it( "exists", () => {
				expect( preferencesSelectors.selectPreference ).toBeTruthy();
			} );

			it( "returns the link param", () => {
				expect( preferencesSelectors.selectPreference( state, "foo", "" ) ).toBe( "bar" );
			} );

			it( "returns the default if the preference is not found", () => {
				expect( preferencesSelectors.selectPreference( state, "baz" ) ).toEqual( {} );
			} );

			it( "returns the given default if the preference is not found", () => {
				expect( preferencesSelectors.selectPreference( state, "baz", 3 ) ).toBe( 3 );
			} );
		} );

		describe( "selectUpsellSettingsAsProps", () => {
			it( "exists", () => {
				expect( preferencesSelectors.selectUpsellSettingsAsProps ).toBeTruthy();
			} );

			it( "return the premium CTB per default", () => {
				expect( preferencesSelectors.selectUpsellSettingsAsProps( state ) ).toEqual( {
					"data-action": "id",
					"data-ctb-id": "1234",
				} );
			} );

			it( "return the props with the requested CTB id", () => {
				expect( preferencesSelectors.selectUpsellSettingsAsProps( state, "otherCtbId" ) ).toEqual( {
					"data-action": "id",
					"data-ctb-id": "5678",
				} );
			} );
		} );
	} );
} );
