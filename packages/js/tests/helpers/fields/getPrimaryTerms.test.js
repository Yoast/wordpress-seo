import { getPrimaryTerms } from "../../../src/helpers/fields/primaryTaxonomiesFieldsStore";
import { STORES } from "../../../src/shared-admin/constants";
import { select } from "@wordpress/data";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );

let windowSpy;

beforeEach(
	() => {
		windowSpy = jest.spyOn( global, "window", "get" );
	}
);

afterEach(
	() => {
	  windowSpy.mockRestore();
	}
);

describe( "getPrimaryTerm - should returns an object with taxonomies keys and fuctions that returns primary term id", () => {
	it( "should return primary id from the primary term getter", () => {
		const getPrimaryTaxonomyId = jest.fn();
		getPrimaryTaxonomyId.mockReturnValue( 1 );

		select.mockImplementation( ( store ) => {
			if ( store === STORES.editor ) {
				return {
					getPrimaryTaxonomyId,
				};
			}
		} );

		windowSpy.mockImplementation(
			() => (
				{
					wpseoPrimaryCategoryL10n: {
						taxonomies: {
							category: {
								title: "Category",
								name: "category",
								primary: 1,
								singularLabel: "Category",
								fieldId: "yoast_wpseo_primary_category",
								restBase: "categories",
								terms: [
									{
										id: 1,
										name: "Uncategorized",
									},
								],
							},
						},
					},
				}
			)
		);

		const actual = getPrimaryTerms();
		expect( actual ).toHaveProperty( "primary_category" );
		const primaryCategory = actual.primary_category();
		expect( primaryCategory ).toEqual( 1 );
	} );
} );
