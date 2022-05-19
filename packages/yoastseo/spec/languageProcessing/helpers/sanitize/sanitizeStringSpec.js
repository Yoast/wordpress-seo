import sanitizeString from "../../../../src/languageProcessing/helpers/sanitize/sanitizeString.js";

describe( "Test for removing unwanted characters.", function() {
	it( "returns cleaned string", function() {
		// Because regexes are now properly escaped, there is no need to strip characters like * from the keyword.
		expect( sanitizeString( "keyword*?!.+-[]()<>«»:;/\\‹›" ) ).toBe( "keyword*?!.+-[]()<>«»:;/\\‹›" );
		expect( sanitizeString( "keyword<p></p>" ) ).toBe( "keyword" );
	} );
	it( "returns cleaned string containing /", function() {
		expect( sanitizeString( "50/50" ) ).toBe( "50/50" );
		expect( sanitizeString( "<p>50/50</p>" ) ).toBe( "50/50" );
	} );
	it( "excludes Table of Content from the text", () => {
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

		expect( sanitizeString( text ) ).toEqual(  "Here is the list of food you can give your cat. Food that are raw Lorem ipsum dolor sit amet, " +
			"est minim reprimique et, impetus interpretaris eos ea. Food from fresh meat Aperiri scripserit per cu, at mea graeci numquam." +
			" Food that contains vegetables Ne vix clita soluta persecuti, vel at fugit labores, mentitum intellegebat ius ex. " +
			"Cu semper comprehensam duo, pro fugit animal reprehendunt et. Food that are cooked Has an natum errem, vix oratio mediocrem an, " +
			"pro ponderum senserit dignissim ut."
		);
	} );
	it( "unifies whitespaces and non-breaking spaces", () => {
		const text = "A&nbsp;text\u0020string.";

		expect( sanitizeString( text ) ).toEqual( "A text string." );
	} );
} );
