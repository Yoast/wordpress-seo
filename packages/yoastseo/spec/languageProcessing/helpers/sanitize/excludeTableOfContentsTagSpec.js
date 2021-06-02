import excludeTableOfContentsTag from "../../../../src/languageProcessing/helpers/sanitize/excludeTableOfContentsTag.js";

describe( "Strips the HTML tags from a string.", function() {
	it( "returns a string without HTML tags", function() {
		const text = "<p><\/p> <div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'> <h2>Table of contents<\/h2> " +
			"<a href='#h-food-that-are-raw' data-level='2'>Food that are raw<\/a> <a href='#h-food-from-fresh-meat'" +
			" data-level='3'>Food from fresh meat<\/a> <a href='#h-food-that-contains-vegetables' " +
			"data-level='3'>Food that contains vegetables<\/a> <a href='#h-food-that-are-cooked' " +
			"data-level='2'>Food that are cooked<\/a> <\/div> <p>Here is the list of food you can give your cat.<\/p>" +
			" <h2 id='h-food-that-are-raw'>Food that are raw<\/h2> " +
			"<p>Lorem ipsum dolor sit amet, est minim reprimique et, impetus interpretaris eos ea.<\/p> " +
			"<h3 id='h-food-from-fresh-meat'>Food from fresh meat<\/h3> " +
			"<p>Aperiri scripserit per cu, at mea graeci numquam.<\/p> " +
			"<h3 id='h-food-that-contains-vegetables'>Food that contains vegetables<\/h3> " +
			"<p>Ne vix clita soluta persecuti, vel at fugit labores, mentitum intellegebat ius ex. " +
			"Cu semper comprehensam duo, pro fugit animal reprehendunt et.<\/p> " +
			"<h2 id='h-food-that-are-cooked'>Food that are cooked<\/h2> " +
			"<p>Has an natum errem, vix oratio mediocrem an, pro ponderum senserit dignissim ut.<\/p>";

		expect( excludeTableOfContentsTag( text ) ).toBe( "<p></p>  <p>Here is the list of food you can give your cat.</p> " +
			"<h2 id='h-food-that-are-raw'>Food that are raw</h2> <p>Lorem ipsum dolor sit amet, est minim " +
			"reprimique et, impetus interpretaris eos ea.</p> <h3 id='h-food-from-fresh-meat'>Food from fresh meat</h3> " +
			"<p>Aperiri scripserit per cu, at mea graeci numquam.</p> <h3 id='h-food-that-contains-vegetables'>Food that contains vegetables</h3> " +
			"<p>Ne vix clita soluta persecuti, vel at fugit labores, mentitum intellegebat ius ex. Cu semper comprehensam duo, " +
			"pro fugit animal reprehendunt et.</p> <h2 id='h-food-that-are-cooked'>Food that are cooked</h2> " +
			"<p>Has an natum errem, vix oratio mediocrem an, pro ponderum senserit dignissim ut.</p>" );
	} );
} );
