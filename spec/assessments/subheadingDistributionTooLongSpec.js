import SubheadingDistributionTooLong from "../../js/assessments/readability/subheadingDistributionTooLongAssessment.js";
import Paper from "../../js/values/Paper.js";
import Factory from "../helpers/factory.js";
import Mark from "../../js/values/Mark.js";
let i18n = Factory.buildJed();

let paper = new Paper();
let subheadingDistributionTooLong = new SubheadingDistributionTooLong();

describe( "An assessment for scoring too long text fragments following a subheading.", function() {
	it( "scores 3 text fragments, 0 are too long", function() {
		let assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ { text: "", wordCount: 60 },  { text: "", wordCount: 100 }, { text: "", wordCount: 300 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The amount of words following each of the subheadings doesn't exceed the recommended maximum of 300 words, which is great." );
	} );

	it( "scores 3 text fragments, 0 are too long", function() {
		let assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ { text: "", wordCount: 60 },  { text: "", wordCount: 100 }, { text: "", wordCount: 200 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The amount of words following each of the subheadings doesn't exceed the recommended maximum of 300 words, which is great." );
	} );

	it( "returns score 2 for no subheadings", function() {
		let assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [] ), i18n );
		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "The text does not contain any <a href='https://yoa.st/headings' target='_blank'>subheadings</a>. Add at least one subheading." );
	} );
	it( "returns score 3 for a text fragment over 350 words", function() {
		let assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ { text: "", wordCount: 60 },  { text: "", wordCount: 400 }, { text: "", wordCount: 300 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 subheading is followed by more than the recommended maximum of 300 words. Try to insert another subheading." );
	} );

	it( "returns score 6 for text fragments between 300 and 350 words", function() {
		let assessment = subheadingDistributionTooLong.getResult( paper, Factory.buildMockResearcher( [ { text: "", wordCount: 60 },  { text: "", wordCount: 310 }, { text: "", wordCount: 310 }, { text: "", wordCount: 310 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "3 of the subheadings are followed by more than the recommended maximum of 300 words. Try to insert additional subheadings." );
	} );

	it( "returns false because the paper has no text", function() {
		let assessment = subheadingDistributionTooLong.isApplicable( paper );
		expect( assessment ).toBe( false );
	} );

	it( "returns true because the paper has text", function() {
		let assessment = subheadingDistributionTooLong.isApplicable( new Paper( "text" ) );
		expect( assessment ).toBe( true );
	} );
} );

describe( "A test for marking too long text fragments following a subheading", function() {
	it( "returns markers for too long text fragments", function() {
		let paper = new Paper( "This is a too long sentence, because it has over twenty words, and that is hard too read, don't you think?" );
		let textFragment = Factory.buildMockResearcher( [ { text: "This is a too long fragment. It contains 301 words.", wordCount: 301 } ] );
		let expected = [
			new Mark( { original: "This is a too long fragment. It contains 301 words.", marked: "<yoastmark class='yoast-text-mark'>This is a too long fragment. It contains 301 words.</yoastmark>" } ),
		];
		expect( subheadingDistributionTooLong.getMarks( paper, textFragment ) ).toEqual( expected );
	} );

	it( "returns no markers if no text fragment is too long", function() {
		let paper = new Paper( "This is a short sentence." );
		let textFragment = Factory.buildMockResearcher( [ { text: "This is a short fragment.", wordCount: 5 } ] );
		let expected = [];
		expect( subheadingDistributionTooLong.getMarks( paper, textFragment ) ).toEqual( expected );
	} );
} );
