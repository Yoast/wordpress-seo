var sentenceVariation = require( "../../js/researches/sentenceVariation" );
var Paper = require( "../../js/values/Paper.js" );

describe( "the sentence length variation research", function() {
	/*
	it( "should calculate the standard deviation of a text containing one line", function() {
		var paper = new Paper( "this is a oneliner." );
		var result = sentenceVariation( paper );
		expect( result ).toBe( 0 );
	} );
*/
	it( "should calculate the standard deviation of a two liner", function() {
		var paper = new Paper(
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam suscipit convallis " +
			"urna at molestie."
		);
		var result = sentenceVariation( paper );
		expect( result ).toBe( 1.41 );
	} );
/*
	it( "should calculate the standard deviation short and long sentences", function() {
		var paper = new Paper(
			"Lorem. Ipsum dolor sit amet, consectetur adipiscing elit. Nam suscipit convallis urna at " +
			"molestie. Phasellus pellentesque sodales erat, scelerisque condimentum dolor ultricies vitae. In " +
			"nisi sem, tristique sit amet congue ut, posuere at lectus. Phasellus volutpat sed nisl sed porttitor. " +
			"Phasellus nulla orci, malesuada a urna quis, efficitur tincidunt diam."
		);

		var result = sentenceVariation( paper );
		expect( result ).toBe( 3.34 );
	} );

	it( "should calculate the standard deviation of a text containing six lines", function() {
		var paper = new Paper(
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit nam suscipit. Convallis urna at molestie " +
			"phasellus pellentesque sodales erat. Scelerisque condimentum dolor ultricies vitae in nisi sem, " +
			"tristique sit. Amet congue ut, posuere at lectus phasellus volutpat. Sed nisl sed porttitor " +
			"phasellus nulla orci, malesuada. A urna quis, efficitur."
		);

		var result = sentenceVariation( paper );
		expect( result ).toBe( 2.19 );
	} );*/
});
