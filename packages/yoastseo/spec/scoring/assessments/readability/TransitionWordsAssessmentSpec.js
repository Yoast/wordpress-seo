import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import TransitionWordsAssessment from "../../../../src/scoring/assessments/readability/TransitionWordsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";

const shortText = "a ".repeat( 199 );
const longText = "a ".repeat( 201 );
const shortTextJapanese = "熱".repeat( 390 );
const longTextJapanese = "熱".repeat( 400 );

describe( "An assessment for checking the percentage of transition words in the text", function() {
	it( "returns the score for 0% of the sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for a paper with a long text but no sentences (e.g. only images)", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 0,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 10.0% of the sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 10% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 20.0% of the sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 5,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 20% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 25.0% of the sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 4,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 35.0% of the sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 20,
			transitionWordSentences: 7 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 40% sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 4 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 47% sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 100,
			transitionWordSentences: 47 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 66.7% of the sentences with transition words in a long text", function() {
		const mockPaper = new Paper( longText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 3,
			transitionWordSentences: 2 } ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "should match transition word in image caption", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"However, a cat with the toy looks happier. She is given raw food. Seniors don't like it.<br></br>\n" +
			"</p>" );
		const researcher = new EnglishResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
	} );

	it( "returns the score for a short text with a low percentage of sentences with transition words", function() {
		const mockPaper = new Paper( shortText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for a short text with no transition words", function() {
		const mockPaper = new Paper( shortText );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>:" +
			" You are not using any transition words, but your text is short enough and probably doesn't need them." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
} );
describe( "An assessment for checking the percentage of transition words in a Japanese text ", function() {
	it( "returns the score for a short Japanese text with a low percentage of sentences with transition words.", function() {
		const mockPaper = new Paper( "ならば。" + shortTextJapanese );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for a short Japanese text with no transition words.", function() {
		const mockPaper = new Paper( shortTextJapanese );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>:" +
			" You are not using any transition words, but your text is short enough and probably doesn't need them." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "returns the score for a long Japanese text with no transition words.", function() {
		const mockPaper = new Paper( longTextJapanese );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );
} );

describe( "A test for applicability", function() {
	it( "is applicable when used with a supported researcher, e.g. the English researcher", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, ne sed agam oblique alterum.", { locale: "en_US" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when used with a non-supported researcher, e.g. the default researcher", function() {
		const mockPaper = new Paper( "This is a string", { locale: "xx_YY" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new DefaultResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking sentences containing a transition word", function() {
	it( "returns markers for sentences containing transition words", function() {
		const paper = new Paper( "This sentence is marked, because it contains a transition word." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ { sentence: "This sentence is marked, " +
					"because it contains a transition word.", transitionWords: [ "because" ] } ] } );
		const expected = [
			new Mark( { original: "This sentence is marked, because it contains a transition word.", marked: "<yoastmark " +
					"class='yoast-text-mark'>This sentence is marked, because it contains a transition word.</yoastmark>" } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences contain a transition word", function() {
		const paper = new Paper( "This sentence is not marked." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ ] } );
		const expected = [];
		expect( new TransitionWordsAssessment().getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns markers for an image caption containing transition words", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"However, a cat with the toy looks happier. She is given raw food. Seniors don't like it.<br></br>\n" +
			"</p>" );
		const researcher = new EnglishResearcher( paper );
		const expected = [
			new Mark( {
				original: "However, a cat with the toy looks happier.",
				marked: "<yoastmark class='yoast-text-mark'>However, a cat with the toy looks happier.</yoastmark>" } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, researcher ) ).toEqual( expected );
	} );
} );
