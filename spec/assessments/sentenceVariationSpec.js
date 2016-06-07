var sentenceVariationAssessment = require( "../../js/assessments/sentenceVariationAssessment" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An assessment for sentence variation", function(){
	it( "returns the score when deviation 4 ", function() {
		var mockPaper = new Paper();
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 4 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 4, " +
			"which is more than or equal to the recommended minimum of 3. The text contains a nice combination of long and short sentences." );
	} );

	it( "returns the score when deviation is 2 ", function() {
		var mockPaper = new Paper();
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 2 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 2, " +
			"which is less than the recommended minimum of 3. Try to alternate more between long and short sentences." );
	} );

	it( "returns the score when deviation is zero ", function() {
		var mockPaper = new Paper();
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 0, " +
			"which is less than the recommended minimum of 3. Try to alternate more between long and short sentences." );
	} );

	it( "returns the score when deviation is 20 ", function() {
		var mockPaper = new Paper();
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 20, " +
			"which is more than or equal to the recommended minimum of 3. The text contains a nice combination of long and short sentences." );
	} );

} );
