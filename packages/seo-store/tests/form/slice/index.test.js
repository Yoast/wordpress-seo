import formReducer, { formActions, formSelectors } from "../../../src/form/slice/index";

describe( "a test for form slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		seo: {},
		keyphrases: {},
		social: {},
	};

	describe( "a test for form reducer", () => {
		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should return initial state with form data", () => {
			expect( formReducer( previousState, {} ) ).toMatchObject( initialState );
		} );

		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should include all form actions", () => {
			[
				"updateKeyphrase",
				"updateSynonyms",
				"addRelatedKeyphrase",
				"updateSeoTitle",
				"updateMetaDescription",
				"updateSlug",
				"updateFacebookTitle",
				"updateFacebookDescription",
				"updateFacebookImage",
				"updateTwitterTitle",
				"updateTwitterDescription",
				"updateTwitterImage",
				"updateSocialDescriptionTemplate",
				"updateSocialTitleTemplate",
				"updateDescriptionTemplate",
				"updateTitleTemplate",
			].forEach( ( action ) => {
				expect( formActions[ action ] ).toBeDefined();
			} );
		} );
	} );

	describe( "a test for form selectors", () => {
		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should include all form selectors", () => {
			[
				"selectSeo",
				"selectSeoTitle",
				"selectMetaDescription",
				"selectSlug",
				"selectKeyphrases",
				"selectSynonyms",
				"selectFacebook",
				"selectFacebookTitle",
				"selectFacebookDescription",
				"selectFacebookImage",
				"selectTwitter",
				"selectTwitterTitle",
				"selectTwitterDescription",
				"selectTwitterImage",
				"selectSocialDescriptionTemplate",
				"selectSocialTitleTemplate",
				"selectDescriptionTemplate",
				"selectTitleTemplate",
			].forEach( ( selector ) => {
				expect( formSelectors[ selector ] ).toBeDefined();
			} );
		} );
	} );
} );
