import { getImageFallback } from "../../../src/redux/selectors/fallbacks";

// This mimics parts of the yoast-seo/editor store.
const testState = {
	settings: {
		socialPreviews: {
			sitewideImage: "site-wide.png",
		},
	},
	snippetEditor: {
		data: {
			snippetPreviewImageURL: "featured.png",
		},
		replacementVariables: [
			{
				name: "title",
				value: "Not Hello World!",
			},
			{
				name: "term_title",
				value: "A term title",
			},
		],
	},
};

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

describe( getImageFallback, () => {
	it( "returns the featured image if it's set", () => {
		const actual = getImageFallback( testState );

		const expected = "featured.png";

		expect( actual ).toEqual( expected );
	} );

	it( "returns the siteWide image as a fallback when og is active", () => {
		windowSpy.mockImplementation(
			() => (
				{
					wpseoScriptData: {
						metabox: {
							showSocial: {
								facebook: true,
							},
						},
					},
				}
			)
		);

		const state = {
			...testState,
			snippetEditor: {
				data: {
					snippetPreviewImageURL: undefined,
				},
			},
		};
		const actual = getImageFallback( state );

		const expected = "site-wide.png";

		expect( actual ).toEqual( expected );
	} );

	it( "does not return the siteWide image as a fallback when og is disabled", () => {
		windowSpy.mockImplementation(
			() => (
				{
					wpseoScriptData: {
						metabox: {
							showSocial: {
								facebook: false,
							},
						},
					},
				}
			)
		);

		const state = {
			...testState,
			snippetEditor: {
				data: {
					snippetPreviewImageURL: undefined,
				},
			},
		};
		const actual = getImageFallback( state );

		const expected = "";

		expect( actual ).toEqual( expected );
	} );
} );
