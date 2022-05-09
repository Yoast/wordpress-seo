import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import IntroductionKeywordAssessment from "../../../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );
const morphologyDataJA = getMorphologyData( "ja" );

describe( "An assessment for finding the keyword in the first paragraph", function() {
	it( "returns keyphrase words found in one sentence of the first paragraph", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "some text with some keyword", { keyword: "some keywords", synonyms: "", locale: "en_EN" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: true,
				foundInParagraph: true,
				keyphraseOrSynonym: "keyphrase",
			} )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "returns synonym words found in one sentence of the first paragraph", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "some text with some keywords", { keyword: "something", synonyms: "some keyword", locale: "en_EN" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: true,
				foundInParagraph: true,
				keyphraseOrSynonym: "synonym",
			} )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "returns keyphrase words found within the first paragraph, but not in one sentence", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "Some text with some keyword. A keyphrase comes here.", { keyword: "keyword and keyphrases", synonyms: "", locale: "en_EN" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: false,
				foundInParagraph: true,
				keyphraseOrSynonym: "keyphrase",
			} )
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence." +
			" <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!" );
	} );

	it( "returns synonym words found within the first paragraph, but not in one sentence", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "Some text with some keyword. A keyphrase comes here.", { keyword: "unrelated keyword", synonyms: "keyword and keyphrases",
				locale: "en_EN" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: false,
				foundInParagraph: true,
				keyphraseOrSynonym: "synonym",
			} )
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence." +
			" <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!" );
	} );


	it( "returns keyphrase words not found within the first paragraph", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "Some text with some keyword. A keyphrase comes here.", { keyword: "ponies", synonyms: "doggies" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: false,
				foundInParagraph: false,
				keyphraseOrSynonym: "",
			} )
		);
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:" +
			" Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure" +
			" the topic is clear immediately</a>." );
	} );

	it( "returns no score if no keyword is defined", function() {
		const isApplicableResult = new IntroductionKeywordAssessment().isApplicable( new Paper( "some text" ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns no score if no text is defined", function() {
		const isApplicableResult = new IntroductionKeywordAssessment().isApplicable( new Paper( "", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );

describe( "a test for the keyphrase in first paragraph assessment when the exact match is requested", function() {
	it( "returns a bad result when the first paragraph doesn't contain the exact match of the keyphrase", function() {
		const mockPaper = new Paper(  "A cat is enjoying a walk in nature.", { keyword: "\"walking in nature\"" } );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: " +
			"Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' " +
			"target='_blank'>Make sure the topic is clear immediately</a>." );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase", function() {
		const mockPaper = new Paper( "A cat is enjoying walking in nature.", { keyword: "\"walking in nature\"" } );
		const researcher = new EnglishResearcher( mockPaper );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const mockPaper = new Paper( "A cat loves an activity in nature. A cat is enjoying a walk in nature.", {
			keyword: "\"walking in nature\"",
			synonyms: "activity in nature",
		} );
		const researcher = new EnglishResearcher( mockPaper );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the exact match of the synonym", function() {
		const mockPaper = new Paper( "A cat loves an activity in nature. A cat is enjoying a walk in nature.", {
			keyword: "\"walking in nature\"",
			synonyms: "\"activity in nature\"",
		} );
		const researcher = new EnglishResearcher( mockPaper );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	/*it( "returns a bad result when the first paragraph doesn't contain the exact match of the keyphrase in Japanese", function() {
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。",
			{
				keyword: "『小さい花の刺繍』",
				synonyms: "野生のハーブの刺繡",
			} );
		const researcher = new JapaneseResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: " +
			"Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f'" +
			" target='_blank'>Make sure the topic is clear immediately</a>." );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase", function() {
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。小さい花の刺繍。",
			{ keyword: "「小さい花の刺繍」", synonyms: "野生のハーブの刺繡" }  );
		const researcher = new JapaneseResearcher( mockPaper );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。",
			{
				keyword: "「小さい花の刺繍」",
				synonyms: "野生のハーブの刺繡",
			}  );
		const researcher = new JapaneseResearcher( mockPaper );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the exact match of the synonym", function() {
		const mockPaper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。",
			{
				keyword: "「小さい花の刺繍」",
				synonyms: "『野生のハーブの刺繡』",
			}  );
		const researcher = new JapaneseResearcher( mockPaper );
		const assessment = new IntroductionKeywordAssessment().getResult( mockPaper, researcher );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!" );
	} );*/
} );
