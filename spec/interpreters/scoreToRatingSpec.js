var scoreToRating = require( "../../js/interpreters/scoreToRating.js" );

describe( "An interpreter that turns numeric scores into ratings", function() {
	it( "returns 'bad' for a score lower than or equal to 4", function() {
		var score = 3;
		scoreToRating( score );
		expect( scoreToRating( score ) ).toEqual( "bad" );
	} );

	it( "returns 'ok' for a score between 4 and 7", function() {
		var score = 5;
		scoreToRating( score );
		expect( scoreToRating( score ) ).toEqual( "ok" );
	} );

	it( "returns 'good' for a score higher than 7", function() {
		var score = 8;
		scoreToRating( score );
		expect( scoreToRating( score ) ).toEqual( "good" );
	} );

	it( "returns 'feedback' for a score of 0", function() {
		var score = 0;
		scoreToRating( score );
		expect( scoreToRating( score ) ).toEqual( "feedback" );
	} );

	it( "returns an empty string for non-numeric scores ", function() {
		var score = "textstring";
		scoreToRating( score );
		expect( scoreToRating( score ) ).toEqual( "" );
	} );
} );
