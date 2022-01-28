import { primaryCategory } from "../../../src/classic-editor/replacement-variables/configurations";
import * as data from "@wordpress/data";

self.wpseoPrimaryCategoryL10n = {
	taxonomies: {
		category: {
			primary: 1,
		},
	},
};

const categories = jest.fn().mockReturnValue( [
	{
		id: "1",
		name: "category 1",
	},
	{
		id: "2",
		name: "category 2",
	},
] );

describe( "a test for getting the replacement of the variables in classic editor", () => {
	it( "should return the replacement for primary category variable when the id from the store is not undefined", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( 2 ),
				selectCategories: categories,
			};
		} );

		expect( primaryCategory.getReplacement() ).toEqual( "category 2" );
	} );

	it( "should return the replacement for primary category variable when the id from the store is undefined", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( undefined ),
				selectCategories: categories,
			};
		} );

		expect( primaryCategory.getReplacement() ).toEqual( "category 1" );
	} );
} );
