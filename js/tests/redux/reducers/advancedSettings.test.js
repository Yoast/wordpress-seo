import advancedSettingsReducer from "../../../src/redux/reducers/advancedSettings";
import * as actions from "../../../src/redux/actions/advancedSettings";

describe( "Analysis data reducer", () => {
	const initialState = {
		noIndex: "",
		noFollow: "",
		advanced: [],
		breadcrumbsTitle: "",
		canonical: "",
		isLoading: true,
	};

	it( "has a default state", () => {
		const result = advancedSettingsReducer( initialState, { type: "undefined" } );

		expect( result ).toEqual( initialState );
	} );

	it( "handles setNoIndex actions", () => {
		const result = advancedSettingsReducer( initialState, { type: actions.SET_NO_INDEX, value: "newValue" } );

		expect( result ).toEqual( Object.assign( {}, initialState, {
			noIndex: "newValue",
		} ) );
	} );

	it( "handles setNoFollow actions", () => {
		const result = advancedSettingsReducer( initialState, { type: actions.SET_NO_FOLLOW, value: "newValue" } );

		expect( result ).toEqual( Object.assign( {}, initialState, {
			noFollow: "newValue",
		} ) );
	} );

	it( "handles setAdvanced actions", () => {
		const result = advancedSettingsReducer( initialState, { type: actions.SET_ADVANCED, value: [ "newValue", "newValue2" ] } );

		expect( result ).toEqual( Object.assign( {}, initialState, {
			advanced: [ "newValue", "newValue2" ],
		} ) );
	} );

	it( "handles setBreadcrumbsTitle actions", () => {
		const result = advancedSettingsReducer( initialState, { type: actions.SET_BREADCRUMBS_TITLE, value: "newValue" } );

		expect( result ).toEqual( Object.assign( {}, initialState, {
			breadcrumbsTitle: "newValue",
		} ) );
	} );

	it( "handles setCanonicalUrl actions", () => {
		const result = advancedSettingsReducer( initialState, { type: actions.SET_CANONICAL_URL, value: "newValue" } );

		expect( result ).toEqual( Object.assign( {}, initialState, {
			canonical: "newValue",
		} ) );
	} );
} );
