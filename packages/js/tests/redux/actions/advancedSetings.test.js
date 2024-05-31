import * as actions from "../../../src/redux/actions/advancedSettings";

describe( "setNoIndex", () => {
	it( "Returns a setNoIndex action and populates the advanced hidden fields", () => {
		const expected = {
			type: "SET_NO_INDEX",
			value: "testNoIndex",

		};
		const actual = actions.setNoIndex( "testNoIndex" );

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
	} );
} );
describe( "setBreadcrumbsTitle", () => {
	it( "Returns a setBreadcrumbsTitle action and populates the advanced hidden fields", () => {
		const expected = {
			type: "SET_BREADCRUMBS_TITLE",
			value: "testBcTitle",

		};

		const actual = actions.setBreadcrumbsTitle( "testBcTitle" );
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
		expect( actual ).toEqual( expected );
	} );
} );

