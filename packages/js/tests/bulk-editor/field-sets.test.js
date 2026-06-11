import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL } from "../../src/bulk-editor/constants";
import { getFieldSets } from "../../src/bulk-editor/field-sets";

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

	it( "leads the Search field set with the focus keyphrase, then the SEO title and meta description, with their save params", () => {
		const fieldSet = getFieldSets()[ FIELD_SET_SEARCH ];

		expect( fieldSet.endpoint ).toBe( "update_search" );
		expect( fieldSet.fields ).toEqual( [
			{ key: "focusKeyphrase", label: "Focus keyphrase", param: "focus_keyphrase", endpoint: "update_keyphrase", width: "sm:yst-w-[19%]" },
			{ key: "seoTitle", label: "SEO title", param: "seo_title", width: "sm:yst-w-[19%]" },
			{ key: "metaDescription", label: "Meta description", param: "meta_description", width: "sm:yst-w-[33%]" },
		] );
	} );

	it( "leads the Social field set with the focus keyphrase, then the social title and description, with their save params", () => {
		const fieldSet = getFieldSets()[ FIELD_SET_SOCIAL ];

		expect( fieldSet.endpoint ).toBe( "update_social" );
		expect( fieldSet.fields ).toEqual( [
			{ key: "focusKeyphrase", label: "Focus keyphrase", param: "focus_keyphrase", endpoint: "update_keyphrase", width: "sm:yst-w-[19%]" },
			{ key: "socialTitle", label: "Social title", param: "social_title", width: "sm:yst-w-[19%]" },
			{ key: "socialDescription", label: "Social description", param: "social_description", width: "sm:yst-w-[33%]" },
		] );
	} );

	it( "returns a fresh object each call so callers cannot mutate shared state", () => {
		const first = getFieldSets();
		const second = getFieldSets();

		expect( first ).not.toBe( second );
		expect( first ).toEqual( second );
	} );
} );
