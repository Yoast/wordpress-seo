// import { KeywordInput } from "../../../src/components/contentAnalysis/KeywordInput";

describe( "KeywordInput", () => {
	let props = {};

	beforeEach( () => {
		props = {
			onFocusKeyword: jest.fn(),
			onFocusKeywordChange: jest.fn(),
			onBlurKeyword: jest.fn(),
		};
	} );

	describe( "validate", () => {
		it( "successfully validates that there is no keyphrase present", () => {
			props = {
				...props,
				displayNoKeyphraseMessage: true,
			};
		} );

		it( "successfully validates that there is a comma in the keyphrase", () => {
			props = {
				...props,
				keyword: "yoast seo,",
			};
		} );

		it( "successfully validates that the keyphrase is longer than 191 characters", () => {
			props = {
				...props,
				keyword: "yoast seo wordpress plugin to help improve your SEO through WordPress" +
				         "yoast seo wordpress plugin to help improve your SEO through WordPress" +
				         "yoast seo wordpress plugin to help improve your SEO through WordPress",
			};
		} );

		it( "doesn't return any errors when the keyphrase is valid", () => {
			props = {
				...props,
				keyword: "yoast seo",
			};
		} );
	} );
} );
