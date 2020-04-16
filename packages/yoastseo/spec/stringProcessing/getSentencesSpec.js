import getSentences from "../../src/stringProcessing/getSentences.js";

import { forEach } from "lodash-es";

/**
 * Helper to test sentence detection.
 *
 * @param {array} testCases Cases to test.
 *
 * @returns {void}
 */
function testGetSentences( testCases ) {
	forEach( testCases, function( testCase ) {
		expect( getSentences( testCase.input ) ).toEqual( testCase.expected );
	} );
}

describe( "Get sentences from text", function() {
	it( "returns sentences", function() {
		var sentence = "Hello. How are you? Bye";
		expect( getSentences( sentence ) ).toEqual( [ "Hello.", "How are you?", "Bye" ] );
	} );
	it( "returns sentences with digits", function() {
		var sentence = "Hello. 123 Bye";
		expect( getSentences( sentence ) ).toEqual( [ "Hello.", "123 Bye" ] );
	} );

	it( "returns sentences with abbreviations", function() {
		var sentence = "It was a lot. Approx. two hundred";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot.", "Approx. two hundred" ] );
	} );

	it( "returns sentences with a ! in it (should not be converted to . )", function() {
		var sentence = "It was a lot. Approx! two hundred";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot.", "Approx!", "two hundred" ] );
	} );

	it( "returns sentences with multiple sentence delimiters at the end", function() {
		var sentence = "Was it a lot!?!??! Yes, it was!";
		expect( getSentences( sentence ) ).toEqual( [ "Was it a lot!?!??!", "Yes, it was!" ] );
	} );

	it( "returns sentences with multiple periods at the end", function() {
		var sentence = "It was a lot... Approx. two hundred.";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot...", "Approx. two hundred." ] );
	} );

	it( "returns sentences, with :", function() {
		var sentence = "One. Two. Three: Four! Five.";
		expect( getSentences( sentence ).length ).toBe( 4 );
	} );

	it( "returns sentences with a text with H2 tags", function() {
		var text = "<h2>Four types of comments</h2>" +
			"The comments people leave on blogs can be divided into four types: " +
			"<h2>Positive feedback</h2>" +
			"First, the positive feedback. ";
		var expected = [ "Four types of comments", "The comments people leave on blogs can be divided into four types:", "Positive feedback", "First, the positive feedback." ];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a sentence with incomplete tags", function() {
		var text = "<p>Some text. More Text.</p>";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text." ] );
	} );

	it( "returns a sentence with incomplete tags per sentence", function() {
		var text = "<p><span>Some text. More Text.</span></p>";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text." ] );
	} );

	it( "returns a sentence with incomplete tags with a link", function() {
		var text = "Some text. More Text with <a href='http://yoast.com'>a link</a>.";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text with <a href='http://yoast.com'>a link</a>." ] );
	} );

	it( "can deal with self-closing tags", function() {
		var text = "A sentence with an image <img src='http://google.com' />";
		expect( getSentences( text ) ).toEqual( [ "A sentence with an image <img src='http://google.com' />" ] );
	} );

	it( "can deal with newlines", function() {
		var testCases = [
			{
				input: "A sentence\nAnother sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "A sentence<br />Another sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "A sentence\rAnother sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "A sentence\n\rAnother sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "<p>A sentence</p><p>Another sentence</p>",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "<div>A sentence</div><div>Another sentence</div>",
				expected: [ "A sentence", "Another sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can deal with headings", function() {
		var testCases = [
			{
				input: "<h1>A sentence</h1>Another sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can detect sentences in parentheses", function() {
		var text = "First sentence. (Second sentence.) [Third sentence.]";
		var expected = [
			"First sentence.",
			"(Second sentence.)",
			"[Third sentence.]",
		];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "should not split on parentheses", function() {
		var text = "A sentence with (parentheses).";
		var expected = [ "A sentence with (parentheses)." ];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "can detect sentences in brackets", function() {
		var text = "[First sentence. Second sentence.] Third sentence";
		var expected = [
			"[First sentence.",
			"Second sentence.]",
			"Third sentence",
		];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "can deal with a longer text", function() {
		var text = "<p>As of today, you'll be able to buy our SEO copywriting training! Everyone who wants to learn how to write quality and SEO-friendly content should definitely look into our online training. Through video tutorials, instructional videos and lots of challenging questions we’ll teach you everything you need to know about SEO copywriting.  If you start our training now, you'll receive $50 discount and pay only $249.</p><p>buyknop our seo copywriting training</p><p>[promofilmpje seo copywriting invoegen]</p><h2>What will you learn?</h2><p>Our SEO copywriting training will take you through all the steps of the copywriting process. We start by executing keyword research. After that, we'll teach you how to prepare a blog post and give lots of tips on how to make your text nice and easy to read. Finally, we'll help you to optimize your text for the search engines.</p><p>The SEO copywriting training contains 6 modules with lots of training video's, texts, quizzes, and assignments.  You will have to do your own keyword research and write a genuine blog post. You will receive feedback from a member of the Yoast-team on both of these assignments.</p><p>Read more about the SEO copywriting training -- linken naar sales pagina</p><p> </p>";
		var expected = [
			"As of today, you'll be able to buy our SEO copywriting training!",
			"Everyone who wants to learn how to write quality and SEO-friendly content should definitely look into our online training.",
			"Through video tutorials, instructional videos and lots of challenging questions we’ll teach you everything you need to know about SEO copywriting.",
			"If you start our training now, you'll receive $50 discount and pay only $249.",
			"buyknop our seo copywriting training",
			"[promofilmpje seo copywriting invoegen]",
			"What will you learn?",
			"Our SEO copywriting training will take you through all the steps of the copywriting process.",
			"We start by executing keyword research.",
			"After that, we'll teach you how to prepare a blog post and give lots of tips on how to make your text nice and easy to read.",
			"Finally, we'll help you to optimize your text for the search engines.",
			"The SEO copywriting training contains 6 modules with lots of training video's, texts, quizzes, and assignments.",
			"You will have to do your own keyword research and write a genuine blog post.",
			"You will receive feedback from a member of the Yoast-team on both of these assignments.",
			"Read more about the SEO copywriting training -- linken naar sales pagina",
		];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );


	it( "ignores decimals with dots in them", function() {
		var testCases = [
			{
				input: "This is 1.0 complete sentence",
				expected: [ "This is 1.0 complete sentence" ],
			},
			{
				input: "This is 255.255.255.255 complete sentence",
				expected: [ "This is 255.255.255.255 complete sentence" ],
			},
			{
				input: "This is an IP (127.0.0.1) 1 sentence",
				expected: [ "This is an IP (127.0.0.1) 1 sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should not break on colons", function() {
		var testCases = [
			{
				input: "This should be: one sentence",
				expected: [ "This should be: one sentence" ],
			},
			{
				input: "This should be: one sentence",
				expected: [ "This should be: one sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should always break on ;, ? and ! even when there is no capital letter", function() {
		var text = "First sentence; second sentence! third sentence? fourth sentence";
		var expected = [ "First sentence;", "second sentence!", "third sentence?", "fourth sentence" ];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "should match correctly with quotation", function() {
		var testCases = [
			{
				input: "First sentence. \"Second sentence\"",
				expected: [ "First sentence.", "\"Second sentence\"" ],
			},
			{
				input: "First sentence. 'Second sentence'",
				expected: [ "First sentence.", "'Second sentence'" ],
			},
			{
				input: "First sentence. ¿Second sentence?",
				expected: [ "First sentence.", "¿Second sentence?" ],
			},
			{
				input: "First sentence. ¡Second sentence!",
				expected: [ "First sentence.", "¡Second sentence!" ],
			},
		];

		testGetSentences( testCases );
	} );
	it( "should ignore non breaking spaces", function() {
		var testCases = [
			{
				input: "First sentence. Second sentence. &nbsp;",
				expected: [ "First sentence.", "Second sentence." ],
			},
		];

		testGetSentences( testCases );
	} );
	it( "should accept the horizontal ellipsis as sentence terminator", function() {
		var testCases = [
			{
				input: "This is the first sentence… Followed by a second one.",
				expected: [ "This is the first sentence…", "Followed by a second one." ],
			},
		];

		testGetSentences( testCases );
	} );
	it( "", function() {
		var testCases = [
			{
				input: "This is a sentence (with blockends.) and is still one sentence.",
				expected: [ "This is a sentence (with blockends.) and is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends.). This is a second sentence.",
				expected: [ "This is a sentence (with blockends.).", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends.) This is a second sentence.",
				expected: [ "This is a sentence (with blockends.)", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends) This is a second sentence.",
				expected: [ "This is a sentence (with blockends)", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends.). this is a second sentence.",
				expected: [ "This is a sentence (with blockends.). this is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends.). 1 this is a second sentence.",
				expected: [ "This is a sentence (with blockends.).", "1 this is a second sentence." ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "Correctly gets sentences with a '<' signs in the middle or at the start.", function() {
		const testCases = [
			{
				input: "This is a sentence with a < and is still one sentence.",
				expected: [ "This is a sentence with a < and is still one sentence." ],
			},
			{
				input: "This is a sentence. < This sentence begins with a smaller than sign.",
				expected: [ "This is a sentence.", "< This sentence begins with a smaller than sign." ],
			},
			{
				input: "This is a < sentence < with three '<' signs. This is another sentence.",
				expected: [ "This is a < sentence < with three '<' signs.", "This is another sentence." ],
			},
			{
				input: "This is a 10 < 20 signs. This is another sentence.",
				expected: [ "This is a 10 < 20 signs.", "This is another sentence." ],
			},
			{
				input: "This is a sentence <. This is another sentence.",
				expected: [ "This is a sentence <.", "This is another sentence." ],
			},
			{
				input: "This is a sentence. <",
				expected: [ "This is a sentence.", "<" ],
			},
			{
				input: "<",
				expected: [ "<" ],
			},
			{
				input: "Hey you! Obviously, 20.0 < 25.0 and 50.0 > 30.0. Do not tell anyone, it is a secret.",
				expected: [ "Hey you!", "Obviously, 20.0 < 25.0 and 50.0 > 30.0.", "Do not tell anyone, it is a secret." ],
			},
			{
				input: "Hey 40 < 50. However, 40 > 50.",
				expected: [ "Hey 40 < 50.",  "However, 40 > 50." ],
			},
		];

		testGetSentences( testCases );
	} );
} );

describe( "Get sentences from texts that have been processed for the keyphrase distribution assessment", function() {
	const paragraph1 = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet semper sem, id faucibus massa.</p>\n";

	const paragraph2 = "<p>Nam sit amet eros faucibus, malesuada purus at, mollis libero. Praesent at ante sit amet elit sollicitudin lobortis.</p>";

	const listWordsLowerCaseProcessed =
		" apple " +
		" pear " +
		" mango ";

	const listWordsUpperCaseProcessed =
		" Apple " +
		" Pear " +
		" Mango ";

	const listNestedProcessed =
		" jonagold " +
		" golden delicious " +
		" pear " +
		" mango ";

	const listSentencesProcessed =
		" This sentence is about an apple. " +
		" This sentence is about a pear. " +
		" This sentence is about a mango. ";

	const listParagraphsProcessed =
		" <p>This is step 1a of an instruction. This is step 1b of an instruction.</p> " +
		" <p>This is step 2a. This is step 2b.</p> " +
		" <p>This is step 3a. This is step 3b.</p> " +
		" <p>This is step 4a. This is step 4b.</p> ";

	const listParagraphsAndSentencesProcessed =
		" <p>This is step 1a of an instruction. This is step 1b of an instruction.</p> " +
		" This is the short step 2. " +
		" This is the short step 3. " +
		" <p>This is step 4a. This is step 4b.</p> ";

	const realWordULExample1Processed = "<p>Besides all of these great developments, you really should use the block editor" +
		" now and stop using the classic editor. Let me give you an overview of simple and clear reasons. With" +
		" the block editor:</p> You will be able to build layouts that you can’t make in TinyMCE." +
		" Most of the stuff we did for our" +
		"<a href=\"https://developer.yoast.com/digital-storytelling-in-the-age-of-blocks/\">recent digital story</a>" +
		" required <em>no coding</em>. Plugins like <a href=\"https://wordpress.org/plugins/grids/\">Grids</a> " +
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

	it( "parses merged list items containing single words as one sentence", function() {
		const testCases = [
			{
				input: listWordsLowerCaseProcessed,
				expected: [ "apple  pear  mango" ],
			},
			{
				input: listWordsUpperCaseProcessed,
				expected: [ "Apple  Pear  Mango" ],
			},
			{
				input: listNestedProcessed,
				expected: [ "jonagold  golden delicious  pear  mango" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "parses merged list items containing sentences as multiple sentences", function() {
		const testCases = [
			{
				input: listSentencesProcessed,
				expected: [
					"This sentence is about an apple.",
					"This sentence is about a pear.",
					"This sentence is about a mango.",
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing single lower-case words and surrounding test", function() {
		const testCases = [
			{
				input: paragraph1 + listWordsLowerCaseProcessed + paragraph2,
				expected: [
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					"In sit amet semper sem, id faucibus massa.",
					"apple  pear  mango",
					"Nam sit amet eros faucibus, malesuada purus at, mollis libero.",
					"Praesent at ante sit amet elit sollicitudin lobortis.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing single upper-case words and surrounding test", function() {
		const testCases = [
			{
				input: paragraph1 + listWordsUpperCaseProcessed + paragraph2,
				expected: [
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					"In sit amet semper sem, id faucibus massa.",
					"Apple  Pear  Mango",
					"Nam sit amet eros faucibus, malesuada purus at, mollis libero.",
					"Praesent at ante sit amet elit sollicitudin lobortis.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing sentences and surrounding text", function() {
		const testCases = [
			{
				input: paragraph1 + listSentencesProcessed + paragraph2,
				expected: [
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					"In sit amet semper sem, id faucibus massa.",
					"This sentence is about an apple.",
					"This sentence is about a pear.",
					"This sentence is about a mango.",
					"Nam sit amet eros faucibus, malesuada purus at, mollis libero.",
					"Praesent at ante sit amet elit sollicitudin lobortis.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing paragraphs", function() {
		const testCases = [
			{
				input: listParagraphsProcessed,
				expected: [
					"This is step 1a of an instruction.",
					"This is step 1b of an instruction.",
					"This is step 2a.",
					"This is step 2b.",
					"This is step 3a.",
					"This is step 3b.",
					"This is step 4a.",
					"This is step 4b.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing paragraphs and sentences", function() {
		const testCases = [
			{
				input: listParagraphsAndSentencesProcessed,
				expected: [
					"This is step 1a of an instruction.",
					"This is step 1b of an instruction.",
					"This is the short step 2.",
					"This is the short step 3.",
					"This is step 4a.",
					"This is step 4b.",
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses a processed real world example list including various html tags", function() {
		const testCases = [
			{
				input: realWordULExample1Processed,
				expected: [
					"Besides all of these great developments, you really should use the block editor now and stop using the classic editor.",
					"Let me give you an overview of simple and clear reasons.",
					"With the block editor:",
					"You will be able to build layouts that you can’t make in TinyMCE.",
					"Most of the stuff we did for our<a href=\"https://developer.yoast.com/digital-storytelling-in-the-age-of-blocks/\">recent digital story</a> required <em>no coding</em>.",
					"Plugins like <a href=\"https://wordpress.org/plugins/grids/\">Grids</a> make it even easier to make very smooth designs.",
					"You can make FAQs and HowTo’s that’ll look awesome in search results.",
					"<span style=\", sans-serif\">Our Yoast SEO Schema blocks are already providing an SEO advantage that is unmatched.",
					"For instance, check out our free <a href=\"https://yoast.com/how-to-build-an-faq-page/\">FAQ</a> and <a href=\"https://yoast.com/wordpress/plugins/seo/howto-schema-content-block/\">How-to</a> blocks.",
					"</span>  Simple things like images next to paragraphs and other things that could be painful in TinyMCE have become so much better in Gutenberg.",
					"Want multiple columns?",
					"You can have them, like that, without extra coding.",
					"Speaking of things you couldn’t do without plugins before: you can now embed tables in your content, just by adding a table block.",
					"No plugins required.",
					"Creating custom blocks is relatively simple, and allows people to do 90% of the custom things they would do with plugins in the past, but easier.",
					"It becomes even easier when you use a plugin like <a href=\"https://www.advancedcustomfields.com/pro/\">ACF Pro</a> or <a href=\"https://getblocklab.com\">Block Lab</a> to build those custom blocks.",
					"Custom blocks, or blocks you’ve added with plugins, can be easily found by users just by clicking the + sign in the editor.",
					"Shortcodes, in the classic editor, didn’t have such a discovery method.",
					"Re-usable blocks allow you to easily create content you can re-use across posts or pages, see this <a href=\"https://www.wpbeginner.com/beginners-guide/how-to-create-a-reusable-block-in-wordpress/\">nice tutorial on WP Beginner</a>.",
					"There are many more nice features;",
					"please share yours in the comments!",
				],
			},
		];

		testGetSentences( testCases );
	} );
} );
