import { getPrimaryTerms } from "../../../src/helpers/fields/primaryTaxonomiesFieldsStore";
import { STORES } from "../../../src/shared-admin/constants";
import { select } from "@wordpress/data";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );

describe( "getPrimaryTerm - should returns an object with taxonomies keys and fuctions that returns primary term id", () => {
	it( "should return primary id from the primary term getter", () => {
		const getPrimaryTaxonomyId = jest.fn( () => 1 );
		const getPrimaryTaxonomies = jest.fn( () => {
			return { category: 1 };
		} );

		select.mockImplementation( ( store ) => {
			if ( store === STORES.editor ) {
				return {
					getPrimaryTaxonomyId,
					getPrimaryTaxonomies,
				};
			}
		} );

		const actual = getPrimaryTerms();
		expect( actual ).toHaveProperty( "primary_category" );
		const primaryCategory = actual.primary_category();
		expect( primaryCategory ).toEqual( 1 );
	} );
} );
