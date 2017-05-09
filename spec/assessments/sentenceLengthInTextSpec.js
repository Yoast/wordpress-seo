import SentenceLengthInTextAssessment from "../../js/assessments/readability/sentenceLengthInTextAssessment";
import Paper from "../../js/values/Paper.js";
import Factory from "../helpers/factory.js";
import Mark from "../../js/values/Mark.js";
let i18n = Factory.buildJed();

let sentenceLengthInTextAssessment = new SentenceLengthInTextAssessment();

describe( "An assessment for sentence length", function(){
	let mockPaper, assessment;

	it( "returns the score for all short sentences", function(){
		let mockPaper = new Paper();
		let assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 }
		] ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "0% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, " +
			"which is less than or equal to the recommended maximum of 25%." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 50% long sentences", function(){
		mockPaper = new Paper();
		assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 }
		] ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "50% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, " +
			"which is more than the recommended maximum of 25%. Try to shorten the sentences." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 100% long sentences", function(){
		mockPaper = new Paper();
		assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 }
		] ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "100% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, " +
			"which is more than the recommended maximum of 25%. Try to shorten the sentences." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 25% long sentences", function(){
		mockPaper = new Paper();
		assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 }
		] ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "25% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, " +
			"which is less than or equal to the recommended maximum of 25%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 30% long sentences", function(){
		mockPaper = new Paper();
		assessment = sentenceLengthInTextAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 }
		] ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "30% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, " +
			"which is more than the recommended maximum of 25%. Try to shorten the sentences." )
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "is not applicable for empty papers", function(){
		mockPaper = new Paper();
		assessment = sentenceLengthInTextAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking too long sentences", function() {
	it ("returns markers for too long sentences", function() {
		let paper = new Paper( "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?" );
		let sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?", sentenceLength: 21 } ] );
		let expected = [
			new Mark({ original: "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?", marked: "<yoastmark class='yoast-text-mark'>This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?</yoastmark>" })
		];
		expect( sentenceLengthInTextAssessment.getMarks( paper, sentenceLengthInText ) ).toEqual( expected );
	} );

	it ("returns no markers if no sentences are too long", function() {
		let paper = new Paper( "This is a short sentence." );
		let sentenceLengthInText = Factory.buildMockResearcher( [ { sentence: "This is a short sentence.", sentenceLength: 5 } ] );
		let expected = [];
		expect( sentenceLengthInTextAssessment.getMarks( paper, sentenceLengthInText ) ).toEqual( expected );
	} );
} );
