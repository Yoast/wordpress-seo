import { primaryCategory, tag } from "../../../src/classic-editor/replacement-variables/configurations";
import * as data from "@wordpress/data";

self.wpseoPrimaryCategoryL10n = {
	taxonomies: {
		category: {
			primary: 1,
		},
	},
};

let selectTerms = jest.fn().mockReturnValue( [
	{
		id: "1",
		name: "category 1",
	},
	{
		id: "2",
		name: "category 2",
	},
] );

describe( "a test for getting the replacement of the primary category variable in classic editor", () => {
	it( "should return the replacement for primary category variable when the id from the store is not undefined", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( 2 ),
				selectTerms: selectTerms,
			};
		} );

		expect( primaryCategory.getReplacement() ).toEqual( "category 2" );
	} );

	it( "should return the replacement for primary category variable when the id from the store is undefined", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( undefined ),
				selectTerms: selectTerms,
			};
		} );

		expect( primaryCategory.getReplacement() ).toEqual( "category 1" );
	} );

	it( "should return the replacement for primary category variable when the id from both the store " +
		"and from wpseoPrimaryCategoryL10n is undefined, but there is one category that is selected for a post:" +
		" the selected category is also assigned as the primary", () => {
		self.wpseoPrimaryCategoryL10n = {
			taxonomies: {
				category: {
					primary: "",
				},
			},
		};
		selectTerms = jest.fn().mockReturnValue( [
			{
				id: "4",
				name: "a new category",
			},
		] );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( undefined ),
				selectTerms: selectTerms,
			};
		} );

		expect( primaryCategory.getReplacement() ).toEqual( "a new category" );
	} );

	it( "should return the replacement for primary category variable when the id from both the store " +
		"and from wpseoPrimaryCategoryL10n is undefined, and there is no category that is selected for a post:" +
		" the primary category should be an empty string", () => {
		self.wpseoPrimaryCategoryL10n = {
			taxonomies: {
				category: {
					primary: "",
				},
			},
		};
		selectTerms = jest.fn().mockReturnValue( [] );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( undefined ),
				selectTerms: selectTerms,
			};
		} );

		expect( primaryCategory.getReplacement() ).toEqual( "" );
	} );
} );

self.wpseoScriptData = {
	analysis: {
		plugins: {
			replaceVars: {
				replace_vars: {
					tag: "cats",
				},
			},
		},
	},
};

describe( "a test for getting the replacement of the tag variable in classic editor", () => {
	it( "should return the replacement for tag variable when the store doesn't return an empty array of tag(s)", () => {
		selectTerms = jest.fn().mockReturnValue( [ "tortie cat", "tortoiseshell cat" ] );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTerms: selectTerms,
			};
		} );

		expect( tag.getReplacement() ).toEqual( "tortie cat, tortoiseshell cat" );
	} );

	it( "should return the replacement for tag variable when the store returns an empty array of tag(s): " +
		"it should return the tags from wpseoScriptData", () => {
		selectTerms = jest.fn().mockReturnValue( [] );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTerms: selectTerms,
			};
		} );

		expect( tag.getReplacement() ).toEqual( "cats" );
	} );
} );
