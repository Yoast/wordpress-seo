import IntroductionKeywordAssessment from "../../js/assessments/seo/IntroductionKeywordAssessment";
const Paper = require( "../../js/values/Paper" );
const Factory = require( "../helpers/factory" );

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
		expect( assessment.getText() ).toBe( "All topic words appear within one sentence in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy." );
	} );

	it( "returns synonyms words found in one sentence of the first paragraph", function() {
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
		expect( assessment.getText() ).toBe( "All topic words appear within one sentence in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy." );
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
		expect( assessment.getText() ).toBe( "All topic words appear in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy, but not within one sentence." );
	} );

	it( "returns synonym words found within the first paragraph, but not in one sentence", function() {
		const assessment = new IntroductionKeywordAssessment().getResult(
			new Paper( "Some text with some keyword. A keyphrase comes here.", { keyword: "unrelated keyword", synonyms: "keyword and keyphrases", locale: "en_EN" } ),
			Factory.buildMockResearcher( {
				foundInOneSentence: false,
				foundInParagraph: true,
				keyphraseOrSynonym: "synonym",
			} ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "All topic words appear in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy, but not within one sentence." );
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
		expect( assessment.getText() ).toBe( "Not all topic words appear in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy. Make sure the topic is clear immediately." );
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
