import { mergeListItems } from "../../src/stringProcessing/mergeListItems";

describe.skip( "A test for merging list items in texts for the purpuse of making the keyphrase distribution assessment" +
	"less sensitive to lists", function() {

	const paragraph1 = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet semper sem, id faucibus massa.</p>\n";

	const paragraph2 = "<p>Nam sit amet eros faucibus, malesuada purus at, mollis libero. Praesent at ante sit amet elit sollicitudin lobortis.</p>";

	const ulWordsLowerCase =
		"<ul>\n" +
		"<li>apple</li>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ul>";

	const olWordsLowerCase =
		"<ul>\n" +
		"<li>apple</li>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ul>";

	const olWithOLAttributes =
		"<ol type=\"I\">\n" +
		"<li>apple</li>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ol>";

	const olWithLIAttributes =
		"<ol type=\">\n" +
		"<li value=\"3\">apple</li>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ol>";

	const ulWithoutClosingLITags =
		"<ul>\n" +
		"<li>apple\n" +
		"<li>pear\n" +
		"<li>mango\n" +
		"</ul>";

	const listWordsLowerCaseProcessed =
		" apple " +
		"pear " +
		"mango ";

	const ulWordsUpperCase = "<ul>\n" +
		"<li>Apple</li>\n" +
		"<li>Pear</li>\n" +
		"<li>Mango</li>\n" +
		"</ul>";

	const ulWordsUpperCaseProcessed =
		" Apple " +
		"Pear " +
		"Mango ";

	const ulSentences = "<ul>\n" +
		"<li>This sentence is about an apple.</li>\n" +
		"<li>This sentence is about a pear.</li>\n" +
		"<li>This sentence is about a mango.</li>\n" +
		"</ul>";

	const listSentencesProcessed =
		" This sentence is about an apple. " +
		" This sentence is about a pear. " +
		" This sentence is about a mango. ";

	const ulWithNestedUL =
		"<ul>\n" +
		"<ul>" +
		"<li>jonagold</li>" +
		"<li>golden delicious</li>" +
		"</ul>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ul>";

	const ulWithNestedOL =
		"<ul>\n" +
		"<ol>" +
		"<li>jonagold</li>" +
		"<li>golden delicious</li>" +
		"</ol>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ul>";

	const olWithNestedOL =
		"<ol>\n" +
		"<ol>" +
		"<li>jonagold</li>" +
		"<li>golden delicious</li>" +
		"</ol>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ol>";

	const olWithNestedUL =
		"<ol>\n" +
		"<ul>" +
		"<li>jonagold</li>" +
		"<li>golden delicious</li>" +
		"</ul>\n" +
		"<li>pear</li>\n" +
		"<li>mango</li>\n" +
		"</ol>";

	const listNestedProcessed =
		" jonagold " +
		" golden delicious " +
		" pear " +
		" mango ";

	const ulParagraphs =
		"<ul>\n" +
		"<li><p>This is step 1a of an instruction. This is step 1b of an instruction.</p></li>\n" +
		"<li><p>This is step 2a. This is step 2b.</p></li>\n" +
		"<li><p>This is step 3a. This is step 3b.</p></li>\n" +
		"<li><p>This is step 4a. This is step 4b.</p></li>\n" +
		"</ul>";

	const listParagraphsProcessed =
		" <p>This is step 1a of an instruction. This is step 1b of an instruction.</p> " +
		" <p>This is step 2a. This is step 2b.</p> " +
		" <p>This is step 3a. This is step 3b.</p> " +
		" <p>This is step 4a. This is step 4b.</p> ";

	const ulParagraphsAndSentences =
		"<ul>\n" +
		"<li><p>This is step 1a of an instruction. This is step 1b of an instruction.</p></li>\n" +
		"<li>This is the short step 2.</li>\n" +
		"<li>This is the short step 3.</li>\n" +
		"<li><p>This is step 4a. This is step 4b.</p></li>\n" +
		"</ul>";

	const listParagraphsAndSentencesProcessed =
		" <p>This is step 1a of an instruction. This is step 1b of an instruction.</p> " +
		" This is the short step 2. " +
		" This is the short step 3. " +
		" <p>This is step 4a. This is step 4b.</p> ";

	const realWordULExample1 = "<p>Besides all of these great developments, you really should use the block editor" +
		" now and stop using the classic editor. Let me give you an overview of simple and clear reasons. With" +
		" the block editor:</p><ul><li>You will be able to build layouts that you can’t make in TinyMCE." +
		" Most of the stuff we did for our" +
		"<a href=\"https://developer.yoast.com/digital-storytelling-in-the-age-of-blocks/\">recent digital story</a>" +
		" required <em>no coding</em>. Plugins like <a href=\"https:\//wordpress.org/plugins/grids/\">Grids</a> " +
		"make it even easier to make very smooth designs.</li><li>You can make FAQs and HowTo’s that’ll look awesome " +
		"in search results. <span style=\", sans-serif\">Our Yoast SEO Schema blocks are already providing an SEO " +
		"advantage that is unmatched. For instance, check out our free" +
		" <a href=\"https://yoast.com/how-to-build-an-faq-page/\">FAQ</a> and" +
		" <a href=\"https://yoast.com/wordpress/plugins/seo/howto-schema-content-block/\">How-to</a> blocks." +
		"</span></li><li>Simple things like images next to paragraphs and other things that could be painful " +
		"in TinyMCE have become so much better in Gutenberg. Want multiple columns? You can have them, like that, " +
		"without extra coding.</li><li>Speaking of things you couldn’t do without plugins before: you can now embed" +
		" tables in your content, just by adding a table block. No plugins required.</li><li>Creating custom blocks" +
		" is relatively simple, and allows people to do 90% of the custom things they would do with plugins in the " +
		"past, but easier. It becomes even easier when you use a plugin like " +
		"<a href=\"https://www.advancedcustomfields.com/pro/\">ACF Pro</a> or <a href=\"https://getblocklab.com\">" +
		"Block Lab</a> to build those custom blocks.</li><li>Custom blocks, or blocks you’ve added with plugins, " +
		"can be easily found by users just by clicking the + sign in the editor. Shortcodes, in the classic editor, " +
		"didn’t have such a discovery method.</li><li>Re-usable blocks allow you to easily create content you can " +
		"re-use across posts or pages, see this" +
		" <a href=\"https://www.wpbeginner.com/beginners-guide/how-to-create-a-reusable-block-in-wordpress/\">nice " +
		"tutorial on WP Beginner</a>.</li></ul><p>There are many more nice features; please share yours in the comments!</p>";

	const realWordULExample1Processed = "<p>Besides all of these great developments, you really should use the block editor" +
		" now and stop using the classic editor. Let me give you an overview of simple and clear reasons. With" +
		" the block editor:</p> You will be able to build layouts that you can’t make in TinyMCE." +
		" Most of the stuff we did for our" +
		"<a href=\"https://developer.yoast.com/digital-storytelling-in-the-age-of-blocks/\">recent digital story</a>" +
		" required <em>no coding</em>. Plugins like <a href=\"https:\//wordpress.org/plugins/grids/\">Grids</a> " +
		"make it even easier to make very smooth designs.  You can make FAQs and HowTo’s that’ll look awesome " +
		"in search results. <span style=\", sans-serif\">Our Yoast SEO Schema blocks are already providing an SEO " +
		"advantage that is unmatched. For instance, check out our free" +
		" <a href=\"https://yoast.com/how-to-build-an-faq-page/\">FAQ</a> and" +
		" <a href=\"https://yoast.com/wordpress/plugins/seo/howto-schema-content-block/\">How-to</a> blocks." +
		"</span>  Simple things like images next to paragraphs and other things that could be painful " +
		"in TinyMCE have become so much better in Gutenberg. Want multiple columns? You can have them, like that, " +
		"without extra coding.  Speaking of things you couldn’t do without plugins before: you can now embed" +
		" tables in your content, just by adding a table block. No plugins required.  Creating custom blocks" +
		" is relatively simple, and allows people to do 90% of the custom things they would do with plugins in the " +
		"past, but easier. It becomes even easier when you use a plugin like " +
		"<a href=\"https://www.advancedcustomfields.com/pro/\">ACF Pro</a> or <a href=\"https://getblocklab.com\">" +
		"Block Lab</a> to build those custom blocks.  Custom blocks, or blocks you’ve added with plugins, " +
		"can be easily found by users just by clicking the + sign in the editor. Shortcodes, in the classic editor, " +
		"didn’t have such a discovery method.  Re-usable blocks allow you to easily create content you can " +
		"re-use across posts or pages, see this" +
		" <a href=\"https://www.wpbeginner.com/beginners-guide/how-to-create-a-reusable-block-in-wordpress/\">nice " +
		"tutorial on WP Beginner</a>. <p>There are many more nice features; please share yours in the comments!</p>";

	it( "should remove ul/ol tags, li tags and line breaks within a list and add a space before and after each list item -" +
		"list with lower-case single words", function() {
		expect( mergeListItems( ulWordsLowerCase ) ).toEqual( listWordsLowerCaseProcessed );
		expect( mergeListItems( olWordsLowerCase ) ).toEqual( listWordsLowerCaseProcessed );
		expect( mergeListItems( olWithOLAttributes ) ).toEqual( listWordsLowerCaseProcessed );
		expect( mergeListItems( olWithLIAttributes ) ).toEqual( listWordsLowerCaseProcessed );
		expect( mergeListItems( ulWithoutClosingLITags ) ).toEqual( listWordsLowerCaseProcessed );
	} );

	it( "should correctly process lists consisting of words starting with upper case letters", function() {
		expect( mergeListItems( ulWordsUpperCase ) ).toEqual( ulWordsUpperCaseProcessed );
	} );

	it( "should correctly process lists consisting of sentences", function() {
		expect( mergeListItems( ulSentences ) ).toEqual( listSentencesProcessed );
	} );

	it( "should correctly process nested lists", function() {
		expect( mergeListItems( ulWithNestedUL ) ).toEqual( listNestedProcessed );
		expect( mergeListItems( ulWithNestedOL ) ).toEqual( listNestedProcessed );
		expect( mergeListItems( olWithNestedOL ) ).toEqual( listNestedProcessed );
		expect( mergeListItems( olWithNestedUL ) ).toEqual( listNestedProcessed );
	} );

	it( "should replace original lists with a processed list in a text", function() {
		expect( mergeListItems( paragraph1 + ulWordsLowerCase + paragraph2 ) ).toEqual( listParagraphsProcessed );
	} );

	it( "should correctly process lists consisting of paragraphs", function() {
		expect( mergeListItems( ulParagraphs ) ).toEqual( paragraph1 +  listWordsLowerCaseProcessed + paragraph2
		);
	} );

	it( "should correctly process mixed lists consisting of paragraphs and sentences", function() {
		expect( mergeListItems( ulParagraphsAndSentences ) ).toEqual( listParagraphsAndSentencesProcessed );
	} );

	it( "should correctly process a real world example list including various html tags", function() {
		expect( mergeListItems( realWordULExample1 ) ).toEqual( realWordULExample1Processed );
	} );
} );
