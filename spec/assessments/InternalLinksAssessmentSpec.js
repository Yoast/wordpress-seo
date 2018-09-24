import InternalLinksAssessment from "../../src/assessments/seo/InternalLinksAssessment";

import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
const i18n = factory.buildJed();

describe( "An assessor running the linkStatistics for internal links", function() {
	it( "A paper with one internal link, which is do-follow", function() {
		const mockPaper = new Paper( "some text" );

		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalDofollow: 1, internalNofollow: 0, internalTotal: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "This page has 1 <a href='https://yoa.st/2pm' target='_blank'>internal link(s)</a>." );
	} );

	it( "A paper with one internal link which is do-follow, and one internal link which is no-follow", function() {
		const mockPaper = new Paper( "some text" );

		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalDofollow: 1, internalNofollow: 1, internalTotal: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 8 );
		expect( assessment.getText() ).toEqual( "This page has 1 nofollowed <a href='https://yoa.st/2pm' target='_blank'>internal link(s)</a> and 1 normal internal link(s)." );
	} );

	it( "A paper with one internal link, which is no-follow", function() {
		const mockPaper = new Paper( "some text" );

		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalDofollow: 0, internalNofollow: 1, internalTotal: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "This page has 1 <a href='https://yoa.st/2pm' target='_blank'>internal link(s)</a>, all nofollowed." );
	} );

	it( "A paper without internal links", function() {
		const mockPaper = new Paper( "some text" );
		const assessment = new InternalLinksAssessment().getResult( mockPaper, factory.buildMockResearcher( { internalTotal: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "No <a href='https://yoa.st/2pm' target='_blank'>internal links</a> appear in this page, consider adding some as appropriate." );
	} );

	it( "A paper without text", function() {
		const isApplicableResult = new InternalLinksAssessment().isApplicable( new Paper( "", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );
