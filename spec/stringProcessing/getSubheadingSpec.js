var getSubheadingContents = require( "../../js/stringProcessing/getSubheadings.js" ).getSubheadingContents;
var getSubheadings = require( "../../js/stringProcessing/getSubheadings.js" ).getSubheadings;

describe("A test for getting subheadings", function(){
	it("returns subheadings", function(){
		var text = "<h2>1</h2><h2>2</h2><h2>3</h2>";
		expect( getSubheadingContents( text ) ).toContain( "<h2>1</h2>" );
		expect( getSubheadingContents( text ) ).toContain( "<h2>2</h2>" );
		expect( getSubheadingContents( text ) ).toContain( "<h2>3</h2>" );
	});
});

describe("A function for matching subheadings", function() {
	it("should return empty for no subheadings", function() {
		expect( getSubheadings( "" ) ).toEqual( [] );
	});

	it("should return all matches in the text", function() {
		var text = "<h2>1</h2><h3>2</h3><h4>3</h4>";

		var subheadings = getSubheadings( text );
		var expectations = [
			["<h2>1</h2>", "2", "1"],
			["<h3>2</h3>", "3", "2"],
			["<h4>3</h4>", "4", "3"]
		];

		expectations.forEach( function( expectation, i ) {
			expectation.forEach( function( value, j ) {
				expect( subheadings[ i ][ j ] ).toBe( value );
			})
		});
	})
});
