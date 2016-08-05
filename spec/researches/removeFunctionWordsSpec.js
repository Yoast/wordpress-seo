var removeFunctionWords = require( "../../js/researches/removeFunctionWords" );
var Paper = require( "../../js/values/Paper.js"  );

describe( "the remove function words research", function() {
	it( "returns an array with all words from the text, except for the filtered function words", function() {
		var paper = new Paper( "Think before you drink – about how to recycle your coffee cup Less than 1% of takeaway coffee cups get recycled – or “dramatically less than 1%” in the striking phrase of Peter Goodwin, co-founder of the UK’s only paper-coffee-cup recycling business. It takes a specialist company, because the plastic used to laminate the cups has to be removed before the paper is pulped. ");
		var result = removeFunctionWords( paper );
		expect( result ).toEqual( [{"word":"coffee","occurrence":2},{"word":"cups","occurrence":2},{"word":"–","occurrence":2},{"word":"business","occurrence":1},{"word":"co-founder","occurrence":1},{"word":"company","occurrence":1},{"word":"cup","occurrence":1},{"word":"dramatically","occurrence":1},{"word":"drink","occurrence":1},{"word":"goodwin","occurrence":1},{"word":"laminate","occurrence":1},{"word":"paper","occurrence":1},{"word":"paper-coffee-cup","occurrence":1},{"word":"peter","occurrence":1},{"word":"phrase","occurrence":1},{"word":"plastic","occurrence":1},{"word":"pulped","occurrence":1},{"word":"recycle","occurrence":1},{"word":"recycled","occurrence":1},{"word":"recycling","occurrence":1},{"word":"removed","occurrence":1},{"word":"specialist","occurrence":1},{"word":"striking","occurrence":1},{"word":"takeaway","occurrence":1},{"word":"uk's","occurrence":1}] );
	} );
});
