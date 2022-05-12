/* eslint-disable capitalized-comments */
import MetaDescriptionKeywordAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const mockResearcherNoMatches = Factory.buildMockResearcher( 0 );
const mockResearcherOneMatch = Factory.buildMockResearcher( 1 );
const mockResearcherTwoMatches = Factory.buildMockResearcher( 2 );
const mockResearcherThreeMatches = Factory.buildMockResearcher( 3 );

const morphologyData = getMorphologyData( "en" );

describe( "a test for the meta description keyword assessment", function() {
	it( "returns a bad result when the meta description doesn't contain the keyword", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherNoMatches );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"The meta description has been specified, but it does not contain the keyphrase. " +
			"<a href='https://yoa.st/33l' target='_blank'>Fix that</a>!" );
	} );

	it( "returns a good result and an appropriate feedback message when at least one sentence contains every keyword term " +
		"at least once in the same sentence.", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherOneMatch );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "returns a good result and an appropriate feedback message when the meta description contains the keyword " +
		"two times in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherTwoMatches );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "returns a bad result when the meta description contains the keyword three times in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherThreeMatches );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: The meta description contains the keyphrase 3 times, which is over the advised maximum " +
			"of 2 times. <a href='https://yoa.st/33l' target='_blank'>Limit that</a>!" );
	} );

	it( "is not applicable when the paper doesn't have a keyword", function() {
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text", { description: "description" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable when the paper doesn't have a meta description", function() {
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text", { keyword: "keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is  applicable when the paper has a meta description and a keyword", function() {
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text",
			{ keyword: "keyword", description: "description" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );

describe( "a test for the meta description keyword assessment when the exact match is requested", function() {
	it( "returns a bad result when the meta description doesn't contain the exact match of the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "\"walking in nature\"", description: "A cat is enjoying a walk in nature." } );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"The meta description has been specified, but it does not contain the keyphrase. " +
			"<a href='https://yoa.st/33l' target='_blank'>Fix that</a>!" );
	} );

	it( "returns a good result when the meta description contains the exact match of the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "\"walking in nature\"", description: "A cat is enjoying walking in nature." } );
		const researcher = new EnglishResearcher( mockPaper );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "still returns a good result when the meta description doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const mockPaper = new Paper( "", { keyword: "\"walking in nature\"",
			synonyms: "activity in nature",
			description: "A cat loves an activity in nature." } );
		const researcher = new EnglishResearcher( mockPaper );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "still returns a good result when the meta description doesn't contain the exact match of the keyphrase," +
		" but it does contain the exact match of the synonym", function() {
		const mockPaper = new Paper( "", { keyword: "\"walking in nature\"",
			synonyms: "\"activity in nature\"",
			description: "A cat loves an activity in nature. A walk in nature." } );
		const researcher = new EnglishResearcher( mockPaper );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );


	/*it( "returns a bad result when the meta description doesn't contain the exact match of the keyphrase in Japanese", function() {
		const mockPaper = new Paper( "", { keyword: "『小さい花の刺繍』",
			synonyms: "野生のハーブの刺繡",
			description: "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。" }  );
		const researcher = new JapaneseResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"The meta description has been specified, but it does not contain the keyphrase. " +
			"<a href='https://yoa.st/33l' target='_blank'>Fix that</a>!" );
	} );

	it( "returns a good result when the meta description contains the exact match of the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "「小さい花の刺繍」", synonyms: "野生のハーブの刺繡", description: "小さい花の刺繍。" }  );
		const researcher = new JapaneseResearcher( mockPaper );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "still returns a good result when the meta description doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const mockPaper = new Paper( "", { keyword: "「小さい花の刺繍」",
			synonyms: "野生のハーブの刺繡",
			description: "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。" }  );
		const researcher = new JapaneseResearcher( mockPaper );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "still returns a good result when the meta description doesn't contain the exact match of the keyphrase," +
		" but it does contain the exact match of the synonym", function() {
		const mockPaper = new Paper( "", { keyword: "『小さい花の刺繍』",
			synonyms: "『野生のハーブの刺繡』",
			description: "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。" }  );
		const researcher = new JapaneseResearcher( mockPaper );
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );*/
} );
