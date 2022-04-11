import socialReducer, { socialActions, socialSelectors } from "../../../../src/form/slice/social";

describe( "a test for social slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		facebook: {},
	};

	describe( "a test for social reducer", () => {
		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should return initial state with social media data", () => {
			expect( socialReducer( previousState, {} ) ).toMatchObject( initialState );
		} );

		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should include social actions", () => {
			[
				"updateFacebookTitle",
				"updateFacebookDescription",
				"updateFacebookImage",
				"updateTwitterTitle",
				"updateTwitterDescription",
				"updateTwitterImage",
			].forEach( ( action ) => {
				expect( socialActions[ action ] ).toBeDefined();
			} );
		} );
	} );

	describe( "a test for social selectors", () => {
		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should include all social selectors", () => {
			[
				"selectFacebook",
				"selectFacebookTitle",
				"selectFacebookDescription",
				"selectFacebookImage",
				"selectTwitter",
				"selectTwitterTitle",
				"selectTwitterDescription",
				"selectTwitterImage",
			].forEach( ( selector ) => {
				expect( socialSelectors[ selector ] ).toBeDefined();
			} );
		} );
	} );
} );
