import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import transitionWordsAssessment from "../../../../src/scoring/assessments/readability/transitionWordsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
const i18n = Factory.buildJed();

describe( "An assessment for transition word percentage", function() {
	it( "returns the score for 0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for a paper with text but no sentences (e.g. only images)", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 0,
			transitionWordSentences: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 10.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 10% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 20.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 5,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 20% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 25.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 4,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 35.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 20,
			transitionWordSentences: 7 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 40% sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 4 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 47% sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 100,
			transitionWordSentences: 47 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 66.7% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 3,
			transitionWordSentences: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "is not applicable for empty papers", function() {
		const mockPaper = new Paper();
		const assessment = transitionWordsAssessment.isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable when used with a supported researcher, e.g. the English researcher", function() {
		const mockPaper = new Paper( "This is a string", { locale: "en_US" } );
		const assessment = transitionWordsAssessment.isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when used with a non-supported researcher, e.g. the default researcher", function() {
		const mockPaper = new Paper( "This is a string", { locale: "xx_YY" } );
		const assessment = transitionWordsAssessment.isApplicable( mockPaper, new DefaultResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking sentences containing a transition word", function() {
	it( "returns markers for too long sentences", function() {
		const paper = new Paper( "This sentence is marked, because it contains a transition word." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ { sentence: "This sentence is marked, " +
					"because it contains a transition word.", transitionWords: [ "because" ] } ] } );
		const expected = [
			new Mark( { original: "This sentence is marked, because it contains a transition word.", marked: "<yoastmark " +
					"class='yoast-text-mark'>This sentence is marked, because it contains a transition word.</yoastmark>" } ),
		];
		expect( transitionWordsAssessment.getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences contain a transition word", function() {
		const paper = new Paper( "This sentence is not marked." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ ] } );
		const expected = [];
		expect( transitionWordsAssessment.getMarks( paper, transitionWords ) ).toEqual( expected );
	} );
} );
