var AssessmentResult = require("../../js/values/AssessmentResult.js");

describe( "a result of an assessment", function() {
	it( "should receive a text and a score in the constructor", function() {
		var assessmentResult = new AssessmentResult({
			score: 9,
			text: "The text"
		});

		expect( assessmentResult.getScore() ).toBe( 9 );
		expect( assessmentResult.getText() ).toBe( "The text" );
	});
});

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
