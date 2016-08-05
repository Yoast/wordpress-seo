var ExclusionCountIterator = require( "../../js/helpers/exclusionCountIterator.js" );

var mockStep = {
	countSyllables: function( word ){ return { word: "test", syllableCount: 2 } }
};

describe( "Creates an iterator for count steps", function() {
	it( "creates an object with steps for counting syllables", function() {
		var iterator = new ExclusionCountIterator();
		iterator.countSteps = [ mockStep ];
		expect( iterator.countSyllables( "foobar test" ).syllableCount ).toBe( 2 );
		expect( iterator.countSyllables( "foobar test" ).word ).toBe( "test" );
	} )
} );
