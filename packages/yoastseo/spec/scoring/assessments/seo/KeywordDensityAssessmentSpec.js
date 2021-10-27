import KeywordDensityAssessment from "../../../../src/scoring/assessments/seo/KeywordDensityAssessment";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import GermanResearcher from "../../../../src/languageProcessing/languages/de/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import Paper from "../../../../src/values/Paper.js";
import Mark from "../../../../src/values/Mark.js";
import factory from "../../../specHelpers/factory.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const i18n = factory.buildJed();
const morphologyData = getMorphologyData( "en" );
const morphologyDataDe = getMorphologyData( "de" );
const nonkeyword = "nonkeyword, ";
const keyword = "keyword, ";

describe( "Tests for the keywordDensity assessment for languages without morphology", function() {
	it( "runs the keywordDensity on the paper without keyword in the text", function() {
		const paper = new Paper( nonkeyword.repeat( 1000 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 0 times. That's less than the recommended minimum of 5 times for a text of this length." +
			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a low keyphrase density (0.1%)", function() {
		const paper = new Paper( nonkeyword.repeat( 999 ) + keyword, { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 1 time. That's less than the recommended minimum of 5 times for a text of this length." +
			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (0.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 995 ) + keyword.repeat( 5 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 5 times. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (2%)", function() {
		const paper = new Paper( nonkeyword.repeat( 980 ) + keyword.repeat( 20 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 20 times. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a slightly too high keyphrase density (3.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 965 ) + keyword.repeat( 35 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 35 times. That's more than the recommended maximum of 29 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very high keyphrase density (10%)", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + keyword.repeat( 100 ), { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 100 times. That's way more than the recommended maximum of 29 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );


	it( "adjusts the keyphrase density based on the length of the keyword with the actual density remaining at 2% - short keyphrase", function() {
		const paper = new Paper( nonkeyword.repeat( 960 ) + "b c, ".repeat( 20 ), { keyword: "b c" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 20 times. This is great!" );
	} );

	it( "adjusts the keyphrase density based on the length of the keyword with the actual density remaining at 2% - long keyphrase", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + "b c d e f, ".repeat( 20 ), { keyword: "b c d e f" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 20 times. That's way more than the recommended maximum of 12 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "returns a bad result if the keyword is only used once, regardless of the density", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ) + keyword, { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 1 time. That's less than the recommended minimum of 2 times " +
			"for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "returns a good result if the keyword is used twice and " +
		"the recommended count is smaller than or equal to 2, regardless of the density", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ) + "a b c, a b c", { keyword: "a b c", locale: "xx_XX" } );
		const researcher = new DefaultResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 2 times. This is great!" );
	} );

	it( "applies to a paper with a keyword and a text of at least 100 words", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ), { keyword: "keyword" } );
		expect( new KeywordDensityAssessment().isApplicable( paper ) ).toBe( true );
	} );

	it( "does not apply to a paper with text of 100 words but without a keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 100 ), { keyword: "" } );
		expect( new KeywordDensityAssessment().isApplicable( paper ) ).toBe( false );
	} );

	it( "does not apply to a paper with a text containing less than 100 words and with a keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 99 ), { keyword: "keyword" } );
		expect( new KeywordDensityAssessment().isApplicable( paper ) ).toBe( false );
	} );

	it( "does not apply to a paper with a text containing less than 100 words and without a keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 99 ), { keyword: "" } );
		expect( new KeywordDensityAssessment().isApplicable( paper ) ).toBe( false );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages with morphology", function() {
	it( "gives a GOOD result when keyword density is between 3 and 3.5%", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "en_EN" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 32 times. This is great!" );
	} );

	it( "gives a GOOD result when keyword density is between 3 and 3.5%, also for other languages with morphology support", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "de_DE" } );
		const researcher = new GermanResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataDe );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 32 times. This is great!" );
	} );

	it( "gives a BAD result when keyword density is between 3 and 3.5%, if morphology support is added, but there is no morphology data", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "de_DE" } );
		const researcher = new GermanResearcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 32 times. That's more than the recommended maximum of 29 times for a text of this length. " +
			"<a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );
} );
describe( "A test for marking the keyword", function() {
	it( "returns markers", function() {
		const keywordDensityAssessment = new KeywordDensityAssessment();
		const paper = new Paper( "This is a very interesting paper with a keyword and another keyword.", { keyword: "keyword" }  );
		const researcher = new DefaultResearcher( paper );
		keywordDensityAssessment.getResult( paper, researcher, i18n );
		const expected = [
			new Mark( {
				marked: "This is a very interesting paper with a " +
					"<yoastmark class='yoast-text-mark'>keyword</yoastmark> and another " +
					"<yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
				original: "This is a very interesting paper with a keyword and another keyword.",
			} ) ];
		expect( keywordDensityAssessment.getMarks() ).toEqual( expected );
	} );

	it( "returns markers for a keyphrase containing numbers", function() {
		const keywordDensityAssessment = new KeywordDensityAssessment();
		const paper = new Paper( "This is the release of YoastSEO 9.3.", { keyword: "YoastSEO 9.3" }  );
		const researcher = new DefaultResearcher( paper );
		keywordDensityAssessment.getResult( paper, researcher, i18n );
		const expected = [
			new Mark( { marked: "This is the release of <yoastmark class='yoast-text-mark'>YoastSEO 9.3</yoastmark>.",
				original: "This is the release of YoastSEO 9.3." } ) ];
		expect( keywordDensityAssessment.getMarks() ).toEqual( expected );
	} );
} );
