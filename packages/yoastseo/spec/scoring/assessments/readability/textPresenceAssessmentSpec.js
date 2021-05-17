import textPresence from "../../../../src/scoring/assessments/readability/textPresenceAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

describe( "Assesses presence of text", function() {
	it( "returns a score of 3 and a feedback string for a text under 50 words", function() {
		const mockPaper = new Paper( "Hallo" );
		const assessment = textPresence.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/35h' target='_blank'>Not enough content</a>:" +
			" <a href='https://yoa.st/35i' target='_blank'>Please add some content to enable a good analysis</a>." );
	} );

	it( "returns a score of 0 and an empty feedback string for a text over 50 words", function() {
		const mockPaper = new Paper( "Hello. This is a text with over 50 words. We want to see if this assessment is working well." +
			" What do you think? This is a very interesting paper, with a lot of words. More words are better, don't you think?" +
			" I am almost done. This is word number fifty. Yay!" );
		const assessment = textPresence.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "" );
	} );

	it( "returns a score of 0 and an empty feedback string for a text with exactly 50 words", function() {
		const mockPaper = new Paper( "Hello. This is a text with exactly 50 words. We want to see if this assessment is working well." +
			" What do you think? This is a very interesting paper, with a lot of words. More words are better, don't you think?" +
			" I am almost done. This is word number fifty. Yay!" );
		const assessment = textPresence.getResult( mockPaper, Factory.buildMockResearcher( 4 ), i18n );

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "" );
	} );
} );
