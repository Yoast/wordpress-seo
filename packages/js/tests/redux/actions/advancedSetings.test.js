import * as actions from "../../../src/redux/actions/advancedSettings";
import AdvancedFields from "../../../src/helpers/fields/AdvancedFields.js";

jest.mock( "../../../src/helpers/fields/AdvancedFields.js", () => {
	return {};
} );

const populatedFields = {
	noIndex: "testNoIndex",
	noFollow: "testNoFollow",
	advanced: "testAdvanced1,testAdvanced2",
	breadcrumbsTitle: "testBcTitle",
	canonical: "www.testCanonicalUrl.com",
};

describe( "setNoIndex", () => {
	it( "Returns a setNoIndex action and populates the advanced hidden fields", () => {
		const expected = {
			type: "SET_NO_INDEX",
			value: "testNoIndex",

		};
		const actual = actions.setNoIndex( "testNoIndex" );

		expect( AdvancedFields.noIndex ).toEqual( "testNoIndex" );
		expect( actual ).toEqual( expected );
	} );
} );
describe( "setNoFollow", () => {
	it( "Returns a setNoFollow action and populates the advanced hidden fields", () => {
		const expected = {
			type: "SET_NO_FOLLOW",
			value: "testNoFollow",

		};
		const actual = actions.setNoFollow( "testNoFollow" );

		expect( AdvancedFields.noFollow ).toEqual( "testNoFollow" );
		expect( actual ).toEqual( expected );
	} );
} );
describe( "setAdvanced", () => {
	it( "Returns a setAdvanced action", () => {
		const expected = {
			type: "SET_ADVANCED",
			value: [ "testAdvanced1", "testAdvanced2" ],

		};
		const actual = actions.setAdvanced( [ "testAdvanced1", "testAdvanced2" ] );

		expect( actual ).toEqual( expected );
	} );
	it( "Joins the passed array into a comma separated string", () => {
		actions.setAdvanced( [ "testAdvanced1", "testAdvanced2" ] );
		expect( AdvancedFields.advanced ).toEqual( "testAdvanced1,testAdvanced2" );
	} );
} );
describe( "setBreadcrumbsTitle", () => {
	it( "Returns a setBreadcrumbsTitle action and populates the advanced hidden fields", () => {
		const expected = {
			type: "SET_BREADCRUMBS_TITLE",
			value: "testBcTitle",

		};

		const actual = actions.setBreadcrumbsTitle( "testBcTitle" );
		expect( AdvancedFields.breadcrumbsTitle ).toEqual( "testBcTitle" );
		expect( actual ).toEqual( expected );
	} );
} );
describe( "setCanonical", () => {
	it( "Returns a setCanonical action and populates the advanced hidden fields", () => {
		const expected = {
			type: "SET_CANONICAL_URL",
			value: "www.testCanonicalUrl.com",

		};

		const actual = actions.setCanonical( "www.testCanonicalUrl.com" );
		expect( AdvancedFields.canonical ).toEqual( "www.testCanonicalUrl.com" );
		expect( actual ).toEqual( expected );
	} );
} );
describe( "loadAdvancedSettingsData", () => {
	it( "Returns a loadAdvancedSettings action and populates the advanced hidden fields", () => {
		const expected = {
			type: "LOAD_ADVANCED_SETTINGS",
			settings: {
				...populatedFields,
				isLoading: false,
				advanced: populatedFields.advanced.split( "," ),
			},

		};

		const actual = actions.loadAdvancedSettingsData();
		expect( actual ).toEqual( expected );
	} );
	it( "Retrieves the advanced settings string, and splits it into an array", () => {
		const actual = actions.loadAdvancedSettingsData().settings.advanced;
		expect( typeof AdvancedFields.advanced ).toEqual( "string" );
		expect( Array.isArray( actual ) ).toBeTruthy();
	} );
} );

