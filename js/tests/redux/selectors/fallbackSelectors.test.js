import { getDescriptionFallback, getTitleFallback, getSitewideImage, getFeaturedImage } from "../../../src/redux/selectors/fallbackSelectors";

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
			siteWideImage: "side-wide.png",
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

describe( getSitewideImage, () => {
	it( "returns the site wide image as a fallback", () => {
		const actual = getSitewideImage( testState );

		const expected = "side-wide.png";

		expect( actual ).toEqual( expected );
	} );
} );

describe( getFeaturedImage, () => {
	it( "returns the featured image as a fallback", () => {
		const actual = getFeaturedImage( testState );

		const expected = "featured.png";

		expect( actual ).toEqual( expected );
	} );
} );
