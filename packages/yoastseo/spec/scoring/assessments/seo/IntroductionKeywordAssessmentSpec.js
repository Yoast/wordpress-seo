import IntroductionKeywordAssessment from "../../../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const i18n = Factory.buildJed();

describe( "An assessment for finding the keyword in the first paragraph", function() {
	it( "returns keyphrase words found in one sentence of the first paragraph", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "some text with some keyword", { keyword: "some keywords", synonyms: "", locale: "en_EN" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: true,
				foundInParagraph: true,
				keyphraseOrSynonym: "keyphrase",
			} ),
			i18n
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
			} ),
			i18n
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
			} ),
			i18n
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
			} ),
			i18n
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
			} ),
			i18n
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
