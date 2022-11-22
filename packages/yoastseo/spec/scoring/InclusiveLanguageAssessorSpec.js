import Paper from "../../src/values/Paper";
import InclusiveLanguageAssessor from "../../src/scoring/inclusiveLanguageAssessor";
import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher";

describe( "a test for the inclusive language assessor", () => {
	const options = {
		infoLinks: {
			age: "https://yoa.st/inclusive-language-age-shopify",
			appearance: "https://yoa.st/inclusive-language-appearance-shopify",
		},
	};
	it( "test", () => {
		const mockPaper = new Paper( "This is a test with seniors." );
		const researcher = new EnglishResearcher( mockPaper );
		const assessor = new InclusiveLanguageAssessor( researcher, options );
		assessor._assessments.forEach( assessment => {
			expect( assessment.category ).toEqual( "age" );
			expect( assessment.learnMoreUrl ).toEqual( "<a href='https://yoa.st/inclusive-language-age-shopify' target='_blank'>" );
		} );
	} );
} );

