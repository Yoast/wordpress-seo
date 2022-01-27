import { primaryCategory } from "../../../src/classic-editor/replacement-variables/configurations";

jest.mock( "@wordpress/data", () => {
	return {
		select: () => {
			return {
				getReplaceVars: jest.fn().mockReturnValue( [
					{ label: "Primary category", name: "primary_category", value: "a different primary category" } ] ),
			};
		},
		combineReducers: jest.fn(),
	};
} );

self.wpseoPrimaryCategoryL10n = {
	taxonomies: {
		category: {
			primary: 1,
			terms: [
				{ id: 1, name: "a primary category" },
				{ id: 2, name: "a non-primary category" },
			],
		},
	},
};

describe( "a test for getting the replacement of the variables in classic editor", () => {
	it( "should return the replacement for primary category variable", () => {
		expect( primaryCategory.getReplacement() ).toEqual( "a different primary category" );
	} );
} );
