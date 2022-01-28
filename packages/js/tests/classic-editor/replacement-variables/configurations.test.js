import { primaryCategory } from "../../../src/classic-editor/replacement-variables/configurations";

jest.mock( "@wordpress/data", () => {
	return {
		select: () => {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( 2 ),
				selectCategories: jest.fn().mockReturnValue( [
					{
						id: "1",
						name: "category 1",
					},
					{
						id: "2",
						name: "category 2",
					},
				] ),
			};
		},
		combineReducers: jest.fn(),
	};
} );

self.wpseoPrimaryCategoryL10n = {
	taxonomies: {
		category: {
			primary: 1,
		},
	},
};

describe( "a test for getting the replacement of the variables in classic editor", () => {
	it( "should return the replacement for primary category variable", () => {
		expect( primaryCategory.getReplacement() ).toEqual( "category 2" );
	} );
} );
