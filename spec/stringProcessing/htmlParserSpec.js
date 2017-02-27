var htmlParser = require ( "../../js/stringProcessing/htmlParser.js" );

describe( "A function to remove the entire HTML style/script tag block.", function( ) {
	it( "filters an entire style block", function() {
		expect( htmlParser( "<style>h1 {color:red;}p {color:blue;}</style>" ) ).toEqual( "" );
	})
	it( "filters out all style blocks", function() {
		expect(htmlParser("Hi, this is a <style>h1 {color:red;} p {color:blue;}</style>test.")).toEqual("Hi, this is a test.");
	} )
	it( "returns an entire script block", function() {
		expect( htmlParser( "<script>Test</script>" ) ).toEqual ( "" );
	})
	it( "filters out all script blocks", function() {
		expect(htmlParser("Hi, this is a <script>Test</script>test.")).toEqual("Hi, this is a test.");
	} )
	it( "removes the script block when there is a type", function() {
		expect( htmlParser( "<script type='text/javascript'>test</script>") ).toEqual("");
	} )
	it( "doesn't remove a div block", function() {
		expect( htmlParser( "<div>Hello</div>" ) ).toEqual( "<div>Hello</div>" );
	} )
})