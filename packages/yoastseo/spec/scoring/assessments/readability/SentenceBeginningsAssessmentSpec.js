import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import ItalianResearcher from "../../../../src/languageProcessing/languages/it/Researcher";
import SentenceBeginningsAssessment from "../../../../src/scoring/assessments/readability/SentenceBeginningsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";

let paper = new Paper();
// eslint-disable-next-line max-statements
describe( "An assessment for scoring repeated sentence beginnings.", function() {
	it( "scores one instance with 4 consecutive sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 },
			{ word: "cup", count: 2 },
			{ word: "laptop", count: 1 },
			{ word: "table", count: 4 } ] ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>:" +
			" The text contains 4 consecutive sentences starting with the same word." +
			" <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores two instance with too many consecutive sentences starting with the same word, 5 being the lowest count.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 },
			{ word: "banana", count: 6 }, { word: "pencil", count: 1 },
			{ word: "bottle", count: 5 } ] ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 2 instances where 5 or more consecutive sentences start with the same word. <a href='https://yoa.st/35g' " +
			"target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores zero instance with too many consecutive sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 1 },
			{ word: "telephone", count: 2 }, { word: "towel", count: 2 },
			{ word: "couch", count: 1 } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "is not applicable for a paper without text and a researcher that has the getSentenceBeginnings research.", function() {
		paper = new Paper( "", { locale: "it_IT" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new ItalianResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for an paper with text and a researcher that has the getSentenceBeginnings research.", function() {
		paper = new Paper( "ciao", { locale: "it_IT" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new ItalianResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a paper with text and a researcher without sentence beginning support.", function() {
		paper = new Paper( "hello", { locale: "jv_ID" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new DefaultResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		const sentenceBeginnings = Factory.buildMockResearcher( [ { word: "hey", count: 4,
			sentences: [ "Hey, hello.", "Hey, hey.", "Hey you.", "Hey." ] } ] );
		const expected = [
			new Mark( { original: "Hey, hello.", marked: "<yoastmark class='yoast-text-mark'>Hey, hello.</yoastmark>" } ),
			new Mark( { original: "Hey, hey.", marked: "<yoastmark class='yoast-text-mark'>Hey, hey.</yoastmark>" } ),
			new Mark( { original: "Hey you.", marked: "<yoastmark class='yoast-text-mark'>Hey you.</yoastmark>" } ),
			new Mark( { original: "Hey.", marked: "<yoastmark class='yoast-text-mark'>Hey.</yoastmark>" } ),
		];
		expect( new SentenceBeginningsAssessment().getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const sentenceBeginnings = Factory.buildMockResearcher( [ { word: "hey", count: 2, sentences: [ "Hey, hello.", "Hey, hey." ] } ] );
		const expected = [];
		expect( new SentenceBeginningsAssessment().getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );
} );
