import SubheadingsKeywordAssessment from "../../src/assessments/seo/subheadingsKeywordAssessment";
import Paper from "../../src/values/Paper";
import Factory from "../specHelpers/factory.js";
const i18n = Factory.buildJed();

let matchKeywordAssessment = new SubheadingsKeywordAssessment();

describe( "An assessment for matching keywords in subheadings", function() {
	it( "returns a bad score and appropriate feedback when none of the subheadings contain the keyword", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, matches: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "You have not used the focus keyword in any " +
			"<a href='https://yoa.st/2ph' target='_blank'>subheading</a> (such as an H2)." );
	} );

	it( "returns a bad score and appropriate feedback when there are too few subheadings containing the keyword", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 4, matches: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "The focus keyword appears only in 1 out of 4 " +
			"<a href='https://yoa.st/2ph' target='_blank'>subheadings</a>. Try to use it in more subheadings." );
	} );

	it( "returns a good score and appropriate feedback when there is a sufficient number of subheadings containing the keyword", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 4, matches: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "The focus keyword appears in 2 out of 4 " +
			"<a href='https://yoa.st/2ph' target='_blank'>subheadings</a>. That's great." );
	} );

	it( "returns a good score and appropriate feedback when there is only one subheading and that subheading contains the keyword", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, matches: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "The focus keyword appears in 1 out of 1 " +
			"<a href='https://yoa.st/2ph' target='_blank'>subheading</a>. That's great." );
	} );

	it( "returns a bad score and appropriate feedback when there are too many subheadings containing the keyword", function() {
		const mockPaper = new Paper();
		const assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 4, matches: 4 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "The focus keyword appears in 4 out of 4 " +
			"<a href='https://yoa.st/2ph' target='_blank'>subheadings</a>. That might sound a bit repetitive. " +
			"Try to change some of those subheadings to make the flow of your text sound more natural." );
	} );

	it( "checks isApplicable for a paper without text", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without keyword", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper without subheadings", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "<p>some text</p><p>some more text</p>", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "checks isApplicable for a paper with text and keyword", function() {
		const isApplicableResult = new SubheadingsKeywordAssessment().isApplicable( new Paper( "<p>some text</p><h2>heading</h2><p>some more text</p>", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );
