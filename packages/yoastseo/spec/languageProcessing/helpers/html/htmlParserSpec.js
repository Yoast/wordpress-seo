import htmlParser from "../../../../src/languageProcessing/helpers/html/htmlParser.js";

describe( "A function to remove the entire HTML style/script tag block.", function() {
	it( "filters an entire style block", function() {
		expect( htmlParser( "<style>h1 {color:red;}p {color:blue;}</style>" ) ).toEqual( "" );
	} );
	it( "filters out all style blocks", function() {
		expect( htmlParser( "Hi, this is a <style>h1 {color:red;} p {color:blue;}</style>test." ) ).toEqual( "Hi, this is a test." );
	} );
	it( "returns an entire script block", function() {
		expect( htmlParser( "<script>Test</script>" ) ).toEqual( "" );
	} );
	it( "filters out all script blocks", function() {
		expect( htmlParser( "Hi, this is a <script>Test</script>test." ) ).toEqual( "Hi, this is a test." );
	} );
	it( "removes the script block when there is a type", function() {
		expect( htmlParser( "<script type='text/javascript'>test</script>" ) ).toEqual( "" );
	} );
	it( "doesn't remove a div block", function() {
		expect( htmlParser( "<div class='hello'>Hello</div>" ) ).toEqual( "<div class='hello'>Hello</div>" );
	} );
	it( "doesn't remove an image block", function() {
		expect( htmlParser( "<img src='yoast_logo.png' alt='Yoast logo' width='50px' height='50px' />" ) )
			.toEqual( "<img src='yoast_logo.png' alt='Yoast logo' width='50px' height='50px'></img>" );
	} );
	it( "filters an entire code block", function() {
		expect( htmlParser( "<code>Test</code>" ) ).toEqual( "" );
	} );
	it( "filters out all code blocks", function() {
		expect( htmlParser( "Hi, this is a <code>Test</code>test." ) ).toEqual( "Hi, this is a test." );
	} );
	it( "filters an entire pre block", function() {
		expect( htmlParser( "<pre>Test</pre>" ) ).toEqual( "" );
	} );
	it( "filters out all pre blocks", function() {
		expect( htmlParser( "Hi, this is a <pre>Test</pre>test." ) ).toEqual( "Hi, this is a test." );
	} );
	it( "filters an entire blockquote", function() {
		expect( htmlParser( "<blockquote>Test</blockquote>" ) ).toEqual( "" );
	} );
	it( "filters out all blockquotes", function() {
		expect( htmlParser( "Hi, this is a <blockquote>Test</blockquote>test." ) ).toEqual( "Hi, this is a test." );
	} );
	it( "filters out all blockquotes, including elements in it", function() {
		expect( htmlParser( "This quote:<blockquote>Time spent with <strong>cats</strong> is never wasted." +
			"<cite>Sigmund Freud</cite></blockquote> is great." ) ).toEqual( "This quote: is great." );
	} );
} );
