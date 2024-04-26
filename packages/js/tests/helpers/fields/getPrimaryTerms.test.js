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

const testCases = [
	{ termId: 1, expected: 1 },
	{ termId: -1, expected: -1 },
	{ termId: 0, expected: 0 },
];

describe.each( testCases )( "getPrimaryTerm - should returns an object with taxonomies keys and fuctions that returns primary term id", ( { termId, expected } ) => {
	it( `should returns ${expected ? expected : "empty string"} when the primary term id is ${termId}`, () => {
		const getPrimaryTaxonomyId = jest.fn();
		getPrimaryTaxonomyId.mockReturnValue( termId );

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
							post_tag: {
								title: "Post tag",
								name: "post_tag",
								primary: 5,
								singularLabel: "Tag",
								fieldId: "yoast_wpseo_primary_post_tag",
								restBase: "tags",
								terms: [
									{
										id: 5,
										name: "Test Tag",
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
		expect( actual ).toHaveProperty( "primary_post_tag" );

		const primaryCategory = actual.primary_category();
		const primaryPostTag = actual.primary_post_tag();

		expect( primaryCategory ).toEqual( expected );
		expect( primaryPostTag ).toEqual( expected );
	} );
} );
