/* eslint-disable camelcase */
import { primaryCategory, tag, termTitle, getCTReplacement } from "../../../src/classic-editor/replacement-variables/configurations";
import * as data from "@wordpress/data";
import { get, map } from "lodash";

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

let selectTitle;

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
					custom_taxonomies: {
						actors: {
							description: "",
							name: "actors",
						},
						directors: {
							description: "",
							name: "directors",
						},
					},
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

	it( "should return an empty string as the replacement for tag variable when the store returns an empty array of tag(s)", () => {
		selectTerms = jest.fn().mockReturnValue( [] );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTerms: selectTerms,
			};
		} );

		expect( tag.getReplacement() ).toEqual( "" );
	} );
} );

describe( "a test for getting the replacement of the custom taxonomies (CT) variable in classic editor", () => {
	const names = map( get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_taxonomies", {} ), ( ( { name } ) => name ) );

	it( "should return the replacement for both hierarchical and non-hirarchical CT variable when the store " +
		"doesn't return an empty object of custom taxonomies", () => {
		selectTerms = jest.fn().mockReturnValue( {
			actors: [
				{
					id: "1",
					name: "actor 1",
				},
				{
					id: "2",
					name: "actor 2",
				},
			],
			directors: [ "Spike Lee", "Steven Spielberg" ],
		} );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTerms: selectTerms,
			};
		} );

		expect( getCTReplacement( names[ 0 ] ) ).toEqual( "actor 1, actor 2" );
		expect( getCTReplacement( names[ 1 ] ) ).toEqual( "Spike Lee, Steven Spielberg" );
	} );

	it( "should return an empty string as the replacement for both hierarchical and non-hirarchical CT variable when the store " +
		"returns an empty object of custom taxonomies", () => {
		selectTerms = jest.fn().mockReturnValue( {} );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTerms: selectTerms,
			};
		} );

		expect( getCTReplacement( names[ 0 ] ) ).toEqual( "" );
		expect( getCTReplacement( names[ 1 ] ) ).toEqual( "" );
	} );
} );

describe( "a test for getting the replacement variable of the title of a taxonomy term in classic editor", () => {
	it( "should return the replacement variable of the title of a term", () => {
		selectTitle = jest.fn().mockReturnValue( "a title" );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTitle: selectTitle,
			};
		} );
		expect( termTitle.getReplacement() ).toEqual( "a title" );
	} );

	it( "should return an empty string in case there is no title for a term", () => {
		selectTitle = jest.fn().mockReturnValue( "" );
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectTitle: selectTitle,
			};
		} );
		expect( termTitle.getReplacement() ).toEqual( "" );
	} );
} );

