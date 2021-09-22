import InternalLinksAssessment from "../../../../src/scoring/assessments/seo/InternalLinksAssessment";

import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";
const i18n = factory.buildJed();

describe( "An assessor running the linkStatistics for internal links", function() {
	it( "A paper with one internal link, which is do-follow", function() {
		const mockPaper = new Paper( "some text" );

		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalDofollow: 1,
			internalNofollow: 0, internalTotal: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough" +
			" internal links. Good job!" );
	} );

	it( "A paper with one internal link which is do-follow, and one internal link which is no-follow", function() {
		const mockPaper = new Paper( "some text" );

		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalDofollow: 1,
			internalNofollow: 1, internalTotal: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 8 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: There are both" +
			" nofollowed and normal internal links on this page. Good job!" );
	} );

	it( "A paper with one internal link, which is no-follow", function() {
		const mockPaper = new Paper( "some text" );

		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalDofollow: 0,
			internalNofollow: 1, internalTotal: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: " +
			"The internal links in this page are all nofollowed. <a href='https://yoa.st/34a' target='_blank'>Add some good internal links</a>." );
	} );

	it( "A paper without internal links", function() {
		const mockPaper = new Paper( "some text" );
		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalTotal: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: " +
			"No internal links appear in this page, <a href='https://yoa.st/34a' target='_blank'>make sure to add some</a>!" );
	} );

	it( "A paper without text", function() {
		const isApplicableResult = new InternalLinksAssessment().isApplicable( new Paper( "", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );
