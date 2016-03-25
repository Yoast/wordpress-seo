var AssessmentResult = require("../../js/values/AssessmentResult.js");

describe( "creating a new empty assessmentResult", function() {
	it( "returns an assessmentResult", function(){
		var assessmentResult = new AssessmentResult();
		expect( assessmentResult.hasScore() ).toBe( false );
		expect( assessmentResult.getScore() ).toBe( 0 );
		expect( assessmentResult.hasText() ).toBe( false );
		expect( assessmentResult.getText()).toBe( "" );
	})
});

describe( "creating a new empty assessmentResult", function() {
	it( "returns an assessmentResult", function(){
		var assessmentResult = new AssessmentResult();
		assessmentResult.setScore( 6 );
		assessmentResult.setText ( "this is text" );
		expect( assessmentResult.hasScore() ).toBe( true );
		expect( assessmentResult.getScore() ).toBe( 6 );
		expect( assessmentResult.hasText() ).toBe( true );
		expect( assessmentResult.getText()).toBe( "this is text" );
	})
});
