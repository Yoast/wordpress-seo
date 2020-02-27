import { getDescriptionFallback, getTitleFallback, getImageUrlFallback } from "../../../src/redux/selectors/fallbackSelectors";

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

describe( getImageUrlFallback, () => {
	it( "returns the site wide image as a fallback", () => {
		const actual = getImageUrlFallback( testState );

		const expected = "side-wide.png";

		expect( actual ).toEqual( expected );
	} );
} );
