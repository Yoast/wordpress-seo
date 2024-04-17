import getPrimaryTerms from "../../../src/helpers/fields/primaryTaxonomiesFieldsStore";
import { STORE_NAME_EDITOR } from "../../../src/shared-admin/constants";
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
	{ termId: 1, expected: "1" },
	{ termId: -1, expected: "" },
	{ termId: 0, expected: "" },
	{ termId: null, expected: "" },
	{ termId: undefined, expected: "" },
];

describe.each( testCases )( "getPrimaryTerm - should returns an object with taxonomies keys and fuctions that returns primary term id", ( { termId, expected } ) => {
	it( `should returns ${expected ? expected : "empty string"} when the primary term id is ${termId}`, () => {
		const wpseoScriptDataMetaData = {
			// eslint-disable-next-line camelcase
			primary_category: 1,
			// eslint-disable-next-line camelcase
			primary_post_tag: 2,
		};

		const getPrimaryTaxonomyId = jest.fn();
		getPrimaryTaxonomyId.mockReturnValue( termId );

		select.mockImplementation( ( store ) => {
			if ( store === STORE_NAME_EDITOR.free ) {
				return {
					getPrimaryTaxonomyId,
				};
			}
		} );

		windowSpy.mockImplementation(
			() => (
				{
					wpseoScriptData: {
						metabox: {
							metadata: wpseoScriptDataMetaData,
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
