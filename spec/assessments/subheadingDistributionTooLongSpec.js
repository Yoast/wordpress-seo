import SubheadingDistributionTooLong from "../../js/assessments/readability/subheadingDistributionTooLongAssessment.js";
import Paper from "../../js/values/Paper.js";
import Factory from "../helpers/factory.js";
import Mark from "../../js/values/Mark.js";
let i18n = Factory.buildJed();

let subheadingDistributionTooLong = new SubheadingDistributionTooLong();

const shortText = "a ".repeat( 200 );
const longText = "a ".repeat( 330 );
const veryLongText = "a ".repeat( 360 );
const subheading = "<h2> some subheading </h2>";

describe( "An assessment for scoring too long text fragments without a subheading.", function() {
	it( "Scores a short text (<300 words), which does not have subheadings.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 200 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "You are not using any <a href='https://yoa.st/headings' target='_blank'>subheadings</a>, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a short text (<300 words), which has subheadings.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( "a " + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 1 }, { text: "", wordCount: 200 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "Great job with using <a href='https://yoa.st/headings' target='_blank'>subheadings</a>!" );
	} );

	it( "Scores a long text (>300 words), which does not have subheadings.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( longText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 330 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "You are not using any subheadings, although your text is rather long. Try and add  some <a href='https://yoa.st/headings' target='_blank'>subheadings</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 200 }, { text: "", wordCount: 200 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "Great job with using <a href='https://yoa.st/headings' target='_blank'>subheadings</a>!" );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, which is between 300 and 350 words long.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + longText + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 200 }, { text: "", wordCount: 330 }, { text: "", wordCount: 200 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "1 section of your text is longer than 300 words and is not separated by any subheadings. Add <a href='https://yoa.st/headings' target='_blank'>subheadings</a> to improve readability." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for two, which are between 300 and 350 words long.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + longText + subheading + longText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 200 }, { text: "", wordCount: 330 }, { text: "", wordCount: 330 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "2 sections of your text are longer than 300 words and are not separated by any subheadings. Add <a href='https://yoa.st/headings' target='_blank'>subheadings</a> to improve readability." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, which is above 350 words long.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + veryLongText + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 200 }, { text: "", wordCount: 360 }, { text: "", wordCount: 200 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "1 section of your text is longer than 300 words and is not separated by any subheadings. Add <a href='https://yoa.st/headings' target='_blank'>subheadings</a> to improve readability." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and some sections of the text are above 350 words long.", function() {
		let assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + longText + subheading + longText ),
			Factory.buildMockResearcher( [ { text: "", wordCount: 200 }, { text: "", wordCount: 360 }, { text: "", wordCount: 330 } ] ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "2 sections of your text are longer than 300 words and are not separated by any subheadings. Add <a href='https://yoa.st/headings' target='_blank'>subheadings</a> to improve readability." );
	} );


	it( "Returns false from isApplicable to the paper without text", function() {
		let assessment = subheadingDistributionTooLong.isApplicable( new Paper( "" ) );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true from isApplicable to the paper with text", function() {
		let assessment = subheadingDistributionTooLong.isApplicable( new Paper( shortText ) );
		expect( assessment ).toBe( true );
	} );

	it( "Returns false from hasSubheadings to the paper without text", function() {
		let assessment = subheadingDistributionTooLong.hasSubheadings( new Paper( shortText ) );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true from hasSubheadings to the paper with text", function() {
		let assessment = subheadingDistributionTooLong.hasSubheadings( new Paper( shortText + subheading + longText ) );
		expect( assessment ).toBe( true );
	} );
} );

describe( "A test for marking too long text segments not separated by a subheading", function() {
	it( "returns markers for too long text segments", function() {
		let paper = new Paper( longText + subheading + veryLongText );
		let textFragment = Factory.buildMockResearcher( [ { text: "This is a too long fragment. It contains 330 words.", wordCount: 330 }, { text: "This is another too long fragment. It contains 360 words.", wordCount: 360 } ] );
		let expected = [
			new Mark( {
				original: "This is another too long fragment. It contains 360 words.",
				marked: "<yoastmark class='yoast-text-mark'>This is another too long fragment. It contains 360 words.</yoastmark>",
			} ),
			new Mark( {
				original: "This is a too long fragment. It contains 330 words.",
				marked: "<yoastmark class='yoast-text-mark'>This is a too long fragment. It contains 330 words.</yoastmark>",
			} ),
		];
		expect( subheadingDistributionTooLong.getResult( paper, textFragment, i18n )._marker ).toEqual( expected );
	} );

	it( "returns no markers if no text segments is too long", function() {
		let paper = new Paper( shortText );
		let textFragment = Factory.buildMockResearcher( [ { text: "This is a short segment.", wordCount: 200 } ] );
		expect( subheadingDistributionTooLong.getResult( paper, textFragment, i18n )._hasMarks ).toEqual( false );
	} );
} );
