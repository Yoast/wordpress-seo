import IntroductionHasKeywordAssessment from "../../js/assessments/seo/IntroductionHasKeywordAssessment";
import Paper from "../../js/values/Paper";
import Factory from "../helpers/factory";

const i18n = Factory.buildJed();

describe( "An assessment for finding the keyword in the first paragraph", function() {
	it( "returns a keyword found in the first paragraph", function() {
		const assessment = new IntroductionHasKeywordAssessment().getResult(
			new Paper( "some text with some keyword", { keyword: "some keyword" } ),
			Factory.buildMockResearcher( 1 ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The focus keyword appears in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy." );
	} );

	it( "returns multiple keywords found in the first paragraph", function() {
		const assessment = new IntroductionHasKeywordAssessment().getResult(
			new Paper( "some text, more text, even more text", { keyword: "text" } ),
			Factory.buildMockResearcher( 3 ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The focus keyword appears in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy." );
	} );

	it( "returns no keyword found in the first paragraph", function() {
		const assessment = new IntroductionHasKeywordAssessment().getResult(
			new Paper( "some text", { keyword: "some keyword" } ),
			Factory.buildMockResearcher( 0 ),
			i18n
		);
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The focus keyword doesn't appear in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy." +
			" Make sure the topic is clear immediately." );
	} );

	it( "returns no score if no keyword is defined", function() {
		const isApplicableResult = new IntroductionHasKeywordAssessment().isApplicable( new Paper( "some text" ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns no score if no text is defined", function() {
		const isApplicableResult = new IntroductionHasKeywordAssessment().isApplicable( new Paper( "" ), { keyword: "some keyword" } );
		expect( isApplicableResult ).toBe( false );
	} );
} );
