import htmlParser from "../../../../src/languageProcessing/helpers/html/htmlParser.js";

describe( "Filters various elements from HTML", function() {
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
	it( "filters out all textareas", function() {
		expect( htmlParser( "Hi, this is a <textarea>Test</textarea>test." ) ).toEqual( "Hi, this is a test." );
	} );
	it( "filters out comments", function() {
		expect( htmlParser( "<!--more Continue reading-->" ) ).toEqual( "" );
	} );
	it( "filters out elements that have a class name that should be ignored", function() {
		const text = '<div class="elementor-button-wrapper">' +
			'<a class="elementor-button elementor-button-link elementor-size-sm" href="#">' +
			'<span class="elementor-button-content-wrapper">' +
			'<span class="elementor-button-text">Click here</span>' +
			"</span>" +
			"</a>" +
			"</div>" +
			'<div class="elementor-spacer">' +
			'<div class="elementor-spacer-inner">' +
			"</div>" +
			"</div>";
		expect( htmlParser( text ) ).toEqual( "" );
	} );
	it( "filters out elements with multiple classes correctly", function() {
		expect( htmlParser( "<div class='test elementor-progress-wrapper test'><div>Test</div></div><div><p>Hi, this is a test.</p></div>" ) )
			.toEqual( "<div><p>Hi, this is a test.</p></div>" );
	} );
} );

describe( "Strips the table of contents from the text.", function() {
	it( "should return a text without the table of contents", function() {
		const text = "<p></p> <div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'> <h2>Table of contents</h2> " +
			"<a href='#h-food-that-are-raw' data-level='2'>Food that are raw</a> <a href='#h-food-from-fresh-meat'" +
			" data-level='3'>Food from fresh meat</a> <a href='#h-food-that-contains-vegetables' " +
			"data-level='3'>Food that contains vegetables</a> <a href='#h-food-that-are-cooked' " +
			"data-level='2'>Food that are cooked</a> </div> <p>Here is the list of food you can give your cat.</p>" +
			" <h2 id='h-food-that-are-raw'>Food that are raw</h2> " +
			"<p>Lorem ipsum dolor sit amet, est minim reprimique et, impetus interpretaris eos ea.</p> " +
			"<h3 id='h-food-from-fresh-meat'>Food from fresh meat</h3> " +
			"<p>Aperiri scripserit per cu, at mea graeci numquam.</p> " +
			"<h3 id='h-food-that-contains-vegetables'>Food that contains vegetables</h3> " +
			"<p>Ne vix clita soluta persecuti, vel at fugit labores, mentitum intellegebat ius ex. " +
			"Cu semper comprehensam duo, pro fugit animal reprehendunt et.</p> " +
			"<h2 id='h-food-that-are-cooked'>Food that are cooked</h2> " +
			"<p>Has an natum errem, vix oratio mediocrem an, pro ponderum senserit dignissim ut.</p>";

		expect( htmlParser( text ) ).toBe( "<p></p>  <p>Here is the list of food you can give your cat.</p> " +
			"<h2 id='h-food-that-are-raw'>Food that are raw</h2> <p>Lorem ipsum dolor sit amet, est minim " +
			"reprimique et, impetus interpretaris eos ea.</p> <h3 id='h-food-from-fresh-meat'>Food from fresh meat</h3> " +
			"<p>Aperiri scripserit per cu, at mea graeci numquam.</p> <h3 id='h-food-that-contains-vegetables'>Food that contains vegetables</h3> " +
			"<p>Ne vix clita soluta persecuti, vel at fugit labores, mentitum intellegebat ius ex. Cu semper comprehensam duo, " +
			"pro fugit animal reprehendunt et.</p> <h2 id='h-food-that-are-cooked'>Food that are cooked</h2> " +
			"<p>Has an natum errem, vix oratio mediocrem an, pro ponderum senserit dignissim ut.</p>" );
	} );
} );

describe( "Strips the estimated reading time from the analysis text.", function() {
	it( "should return a text without the estimated reading time", function() {
		const text = "<p class='yoast-reading-time__wrapper'>" +
			"<span class='yoast-reading-time__icon'><svg><path></path></svg></span>" +
			"<span class='yoast-reading-time__spacer' style='display:inline-block;width:1em'></span>" +
			"<span class='yoast-reading-time__descriptive-text'>Estimated reading time:  </span>" +
			"<span class='yoast-reading-time__reading-time'>2</span><span class='yoast-reading-time__time-unit'> minutes</span></p>" +
			"<p>For the first time in 70 years, India’s forests will be home to cheetahs.</p>" +
			"<p>Eight of them are set to arrive in August from Namibia, home to one of the world’s largest populations of the wild cat.</p>" +
			"<p>Their return comes decades after India’s indigenous population was declared officially extinct in 1952.</p>" +
			"<p>The world’s fastest land animal, the cheetah can reach speeds of 70 miles (113km) an hour.</p>";
		expect( htmlParser( text ) ).toEqual(
			"<p>For the first time in 70 years, India’s forests will be home to cheetahs.</p>" +
			"<p>Eight of them are set to arrive in August from Namibia, home to one of the world’s largest populations of the wild cat.</p>" +
			"<p>Their return comes decades after India’s indigenous population was declared officially extinct in 1952.</p>" +
			"<p>The world’s fastest land animal, the cheetah can reach speeds of 70 miles (113km) an hour.</p>" );
	} );

	it( "should return a text without the estimated reading time, even if additional classes are added to the p element", function() {
		const text = "<p class='yoast-reading-time__wrapper some-additional-class some-other-additional-class'>" +
			"<span class='yoast-reading-time__icon'><svg><path></path></svg></span>" +
			"<span class='yoast-reading-time__spacer' style='display:inline-block;width:1em'></span>" +
			"<span class='yoast-reading-time__descriptive-text'>Estimated reading time:  </span>" +
			"<span class='yoast-reading-time__reading-time'>2</span><span class='yoast-reading-time__time-unit'> minutes</span></p>" +
			"<p>This test has some more class(es).</p>";
		expect( htmlParser( text ) ).toEqual(
			"<p>This test has some more class(es).</p>" );
	} );
} );
