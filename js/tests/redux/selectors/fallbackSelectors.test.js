import selectors from "../../../src/redux/selectors/social";

const { getDescriptionFallback, getTitleFallback, getImageFallback } = selectors;

// This mimics parts of the yoast-seo/editor store.
const testState = {
	analysisData: {
		snippet: {
			title: "Hello World!",
			description: "I describe something?",
		},
	},
	settings: {
		socialPreviews: {
			sitewideImage: "side-wide.png",
		},
	},
	snippetEditor: {
		data: {
			snippetPreviewImageURL: "featured.png",
		},
	},
};

describe( getTitleFallback, () => {
	it( "returns the snippit title as a fallback", () => {
		const actual = getTitleFallback( testState );

		const expected = "Hello World!";

		expect( actual ).toEqual( expected );
	} );
} );

describe( getDescriptionFallback, () => {
	it( "returns the snippit description as a fallback", () => {
		const actual = getDescriptionFallback( testState );

		const expected = "I describe something?";

		expect( actual ).toEqual( expected );
	} );
} );

describe( getImageFallback, () => {
	it( "returns the site wide image if it's set", () => {
		const actual = getImageFallback( testState );

		const expected = "side-wide.png";

		expect( actual ).toEqual( expected );
	} );

	it( "returns the site wide image as a fallback", () => {
		const state = {
			 ...testState,
			settings: {
				socialPreviews: {
					siteWideImage: "",
				},
			},
		};
		const actual = getImageFallback( state );

		const expected = "featured.png";

		expect( actual ).toEqual( expected );
	} );
} );
