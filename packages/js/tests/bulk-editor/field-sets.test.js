import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, getFieldSets } from "../../src/bulk-editor/field-sets";

describe( "getFieldSets", () => {
	it( "returns the Search and Social field sets keyed by id", () => {
		const fieldSets = getFieldSets();

		expect( Object.keys( fieldSets ) ).toEqual( [ FIELD_SET_SEARCH, FIELD_SET_SOCIAL ] );
		expect( fieldSets[ FIELD_SET_SEARCH ].id ).toBe( FIELD_SET_SEARCH );
		expect( fieldSets[ FIELD_SET_SOCIAL ].id ).toBe( FIELD_SET_SOCIAL );
	} );

	it( "gives each field set a label", () => {
		const fieldSets = getFieldSets();

		expect( fieldSets[ FIELD_SET_SEARCH ].label ).toBe( "Search appearance" );
		expect( fieldSets[ FIELD_SET_SOCIAL ].label ).toBe( "Social appearance" );
	} );

	it( "maps the Search field set to the SEO title and meta description fields", () => {
		const { fields } = getFieldSets()[ FIELD_SET_SEARCH ];

		expect( fields ).toEqual( [
			{ key: "seoTitle", label: "SEO title" },
			{ key: "metaDescription", label: "Meta description" },
		] );
	} );

	it( "maps the Social field set to the social title and description fields", () => {
		const { fields } = getFieldSets()[ FIELD_SET_SOCIAL ];

		expect( fields ).toEqual( [
			{ key: "socialTitle", label: "Social title" },
			{ key: "socialDescription", label: "Social description" },
		] );
	} );

	it( "returns a fresh object each call so callers cannot mutate shared state", () => {
		const first = getFieldSets();
		const second = getFieldSets();

		expect( first ).not.toBe( second );
		expect( first ).toEqual( second );
	} );
} );
