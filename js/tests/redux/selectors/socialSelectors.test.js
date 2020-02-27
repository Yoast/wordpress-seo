import { fallbackSelectors } from "../../../src/redux/selectors/socialSelectors";

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

describe( "fallbackSelectors", () => {
	it( "is an Object", () => {
		const actual = fallbackSelectors;
		const expected = {};

		expect( typeof actual ).toEqual( typeof expected );
	} );
} );

describe( fallbackSelectors.getTitleFallback, () => {
	it( "returns the snippit title as a fallback", () => {
		const actual = fallbackSelectors.getTitleFallback( testState );

		const expected = "Hello World!";

		expect( actual ).toEqual( expected );
	} );
} );

describe( fallbackSelectors.getDescriptionFallback, () => {
	it( "returns the snippit description as a fallback", () => {
		const actual = fallbackSelectors.getDescriptionFallback( testState );

		const expected = "I describe something?";

		expect( actual ).toEqual( expected );
	} );
} );

describe( fallbackSelectors.getImageUrlFallback, () => {
	it( "returns the site wide image as a fallback", () => {
		const actual = fallbackSelectors.getImageUrlFallback( testState );

		const expected = "side-wide.png";

		expect( actual ).toEqual( expected );
	} );
} );
