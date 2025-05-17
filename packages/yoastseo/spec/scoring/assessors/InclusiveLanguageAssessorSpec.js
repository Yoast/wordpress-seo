import Paper from "../../../src/values/Paper.js";
import InclusiveLanguageAssessor from "../../../src/scoring/assessors/inclusiveLanguageAssessor.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";

// Note that the order of the testing suites is important because, "Jest executes all describe handlers before it executes any of the actual tests."
// Source: https://jestjs.io/docs/setup-teardown

describe( "a test for for the inclusive language assessor when run without its second parameter, options", () => {
	it( "tests whether the assessor will be run without throwing an error using a ses assessment as an example", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive phrase illegal immigrants." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "ses" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-ses' target='_blank'>" );
			}
		} );
	} );
} );

describe( "a test for for the inclusive language assessor when run in WordPress", () => {
	const options = {
		infoLinks: {},
	};
	it( "tests the category of the age assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word elderly." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "age" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-age' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the appearance assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word obesity." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "appearance" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-appearance' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the culture assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word civilized." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "culture" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-culture' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the disability assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word narcissistic." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "disability" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-disability' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the gender assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive phrase girls and boys." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "gender" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-gender' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the other assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word minorities." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "other" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-other' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Sexual orientation assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word homosexuals." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "sexualOrientation" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-orientation' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the SES assessments and the correct WP link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive phrase illegal immigrants." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "ses" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-ses' target='_blank'>" );
			}
		} );
	} );
	it( "tests when multiple assessments with WordPress shortlinks are triggered for the same Paper", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive words daft AND albinos AND firemen AND felon." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.learnMoreUrl ).toEqual( `<a href='https://yoa.st/inclusive-language-${ assessment.category }' target='_blank'>` );
			}
		} );
	} );
} );

describe( "a test for the inclusive language assessor when run in Shopify", () => {
	const options = {
		infoLinks: {
			age: "https://yoa.st/inclusive-language-age-shopify",
			appearance: "https://yoa.st/inclusive-language-appearance-shopify",
			culture: "https://yoa.st/inclusive-language-culture-shopify",
			disability: "https://yoa.st/inclusive-language-disability-shopify",
			gender: "https://yoa.st/inclusive-language-gender-shopify",
			other: "https://yoa.st/inclusive-language-other-shopify",
			ses: "https://yoa.st/inclusive-language-ses-shopify",
			sexualOrientation: "https://yoa.st/inclusive-language-orientation-shopify",
		},
	};
	it( "tests the category of the Age assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word seniors." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "age" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-age-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Appearance assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word albinos." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "appearance" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-appearance-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Culture assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word exotic." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "culture" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-culture-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Disability assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word daft." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "disability" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-disability-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Gender assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word firemen." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "gender" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-gender-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the SES assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word felon." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "ses" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-ses-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Sexual orientation assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive word homosexuals." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "sexualOrientation" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-orientation-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests the category of the Other assessments and the correct Shopify link", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive phrase minorities." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.category ).toEqual( "other" );
				expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-other-shopify' target='_blank'>" );
			}
		} );
	} );
	it( "tests when multiple assessments with Shopify shortlinks are triggered for the same Paper", () => {
		const mockPaper = new Paper( "This is a test with the non-inclusive words daft AND albinos AND firemen AND felon." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			if ( assessment.isApplicable( mockPaper, researcher ) ) {
				expect( assessment.learnMoreUrl ).toEqual(
					`<a href='https://yoa.st/inclusive-language-${ assessment.category }-shopify' target='_blank'>`
				);
			}
		} );
	} );
} );

describe( "The inclusive language assessor", () => {
	it( "should target 'ex-offenders' only once", () => {
		const paper = new Paper( "This sentence contains the word ex-offenders." );
		const researcher = new EnglishResearcher( paper );

		const assessor = new InclusiveLanguageAssessor( researcher, {} );

		assessor.assess( paper );

		expect( assessor.getValidResults() ).toHaveLength( 1 );
	} );
} );
