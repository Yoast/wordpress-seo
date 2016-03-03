var fleschReadingAssessment = require( "../../js/assessments/countWords.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

console.log( i18n );

describe( "An assessment for the fleschReading", function(){
	it( "runs the fleschReading on the paper", function(){
		var paper = { text: "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" };
		var result = fleschReadingAssessment( paper, i18n );
	} );
} );
