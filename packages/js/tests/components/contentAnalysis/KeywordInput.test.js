import { shallow } from "enzyme";
import { KeywordInput } from "../../../src/components/contentAnalysis/KeywordInput";

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

			const component = shallow( <KeywordInput { ...props } /> );
			const expected = [ "Please enter a focus keyphrase first to get related keyphrases" ];
			const actual = component.instance().validate();

			expect( actual ).toEqual( expect.arrayContaining( expected ) );
		} );

		it( "successfully validates that there is a comma in the keyphrase", () => {
			props = {
				...props,
				keyword: "yoast seo,",
			};

			const component = shallow( <KeywordInput { ...props } /> );
			const expected = [ "Are you trying to use multiple keyphrases? You should add them separately below." ];
			const actual = component.instance().validate();

			expect( actual ).toEqual( expect.arrayContaining( expected ) );
		} );

		it( "successfully validates that the keyphrase is longer than 191 characters", () => {
			props = {
				...props,
				keyword: "yoast seo wordpress plugin to help improve your SEO through WordPress" +
				         "yoast seo wordpress plugin to help improve your SEO through WordPress" +
				         "yoast seo wordpress plugin to help improve your SEO through WordPress",
			};

			const component = shallow( <KeywordInput { ...props } /> );
			const expected = [ "Your keyphrase is too long. It can be a maximum of 191 characters." ];
			const actual = component.instance().validate();

			expect( actual ).toEqual( expect.arrayContaining( expected ) );
		} );

		it( "doesn't return any errors when the keyphrase is valid", () => {
			props = {
				...props,
				keyword: "yoast seo",
			};

			const component = shallow( <KeywordInput { ...props } /> );
			const actual = component.instance().validate();

			expect( actual ).toHaveLength( 0 );
		} );
	} );
} );
