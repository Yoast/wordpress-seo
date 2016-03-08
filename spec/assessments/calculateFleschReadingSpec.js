var fleschReadingAssessment = require( "../../js/assessments/calculateFleschReading.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessment for the fleschReading", function(){
	it( "runs the fleschReading on the paper", function(){

		var paper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" );

		var result = fleschReadingAssessment( paper, i18n );

		expect( result.score ).toBe( 8 );
		expect( result.text ).toBe( "The copy scores 63.9 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered ok to read. " );
	} );
} );
