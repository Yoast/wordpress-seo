import { KeywordInput } from "../../../src/components/contentAnalysis/KeywordInput";
import { render, screen } from "../../test-utils";

beforeAll( () => {
	global.wpseoAdminL10n = { "shortlinks.focus_keyword_info": "https://example.com/focus_keyword_info" };
} );

afterAll( () => {
	delete global.wpseoAdminL10n;
} );

describe( "KeywordInput", () => {
	let props;

	beforeEach( () => {
		props = {
			onFocusKeyword: jest.fn(),
			onFocusKeywordChange: jest.fn(),
			onBlurKeyword: jest.fn(),
		};
	} );

	describe( "validate", () => {
		it( "successfully validates that there is no keyphrase present", () => {
			render( <KeywordInput { ...props } displayNoKeyphraseMessage={ true } /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Please enter a focus keyphrase first to get related keyphrases" );
		} );

		it( "successfully validates that there is a comma in the keyphrase", () => {
			render( <KeywordInput { ...props } keyword="yoast seo," /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Are you trying to use multiple keyphrases? You should add them separately below." );
		} );

		it( "successfully validates that the keyphrase is longer than 191 characters", () => {
			render( <KeywordInput
				{ ...props }
				keyword={ "yoast seo wordpress plugin to help improve your SEO through WordPress" +
					"yoast seo wordpress plugin to help improve your SEO through WordPress" +
					"yoast seo wordpress plugin to help improve your SEO through WordPress" }
			/> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Your keyphrase is too long. It can be a maximum of 191 characters." );
		} );

		it( "doesn't return any errors when the keyphrase is valid", () => {
			render( <KeywordInput { ...props } keyword="yoast seo" /> );

			expect( screen.queryByRole( "alert" ) ).not.toBeInTheDocument();
		} );
	} );
} );
