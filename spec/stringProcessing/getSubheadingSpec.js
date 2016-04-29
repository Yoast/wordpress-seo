var getSubheadings = require( "../../js/stringProcessing/getSubheadings.js" );

describe("A test for getting subheadings", function(){
	it("returns subheadings", function(){
		var text = "<h2>1</h2><h2>2</h2><h2>3</h2>";
		expect( getSubheadings( text ) ).toContain( "<h2>1</h2>" );
		expect( getSubheadings( text ) ).toContain( "<h2>2</h2>" );
		expect( getSubheadings( text ) ).toContain( "<h2>3</h2>" );
	});
});
