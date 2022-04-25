import socialReducer, { socialActions, socialSelectors } from "../../../../src/form/slice/social";

describe( "a test for social slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		facebook: {},
		twitter: {},
		template: {},
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
				"updateSocialDescTemplate",
				"updateSocialTitleTemplate",
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
				"selectSocialDescTemplate",
				"selectSocialTitleTemplate",
			].forEach( ( selector ) => {
				expect( socialSelectors[ selector ] ).toBeDefined();
			} );
		} );
	} );
} );
