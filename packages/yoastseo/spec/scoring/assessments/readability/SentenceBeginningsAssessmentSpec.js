import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import ItalianResearcher from "../../../../src/languageProcessing/languages/it/Researcher";
import SentenceBeginningsAssessment from "../../../../src/scoring/assessments/readability/SentenceBeginningsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import buildTree from "../../../specHelpers/parse/buildTree";

let paper = new Paper();

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

	it( "returns a good score when there are no words in the text.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "is applicable when the researcher that has the getSentenceBeginnings research.", function() {
		paper = new Paper( "", { locale: "it_IT" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new ItalianResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when the researcher doesn't have the sentence beginning support.", function() {
		paper = new Paper( "hello", { locale: "jv_ID" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new DefaultResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking consecutive sentences", function() {
	it( "returns markers", function() {
		paper = new Paper( "Hey, hello. Hey, hey. Hey you. Hey. " );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SentenceBeginningsAssessment();

		const expected = [
			new Mark( { position: { startOffset: 0, endOffset: 11 } } ),
			new Mark( { position: { startOffset: 12, endOffset: 21 } } ),
			new Mark( { position: { startOffset: 22, endOffset: 30 } } ),
			new Mark( { position: { startOffset: 31, endOffset: 35 } } ),
		];

		const marks = assessment.getMarks( paper, researcher );
		marks.forEach( ( mark, i ) => {
			expect( mark ).toMatchObject( expected[ i ] );
		} );
	} );

	it( "returns no markers if there are not too many repetitions", function() {
		paper = new Paper( "Hey, hello. Hey, hey. Yes you. Hey there! Hey, everything alright?" );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );
		const assessment = new SentenceBeginningsAssessment();
		const marks = assessment.getMarks( paper, researcher );
		expect( marks ).toEqual( [] );
	} );
} );
