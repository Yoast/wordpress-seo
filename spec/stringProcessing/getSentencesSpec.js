var getSentences = require( "../../js/stringProcessing/getSentences.js" );

var forEach = require( "lodash/forEach" );

function testGetSentences( testCases ) {
	forEach( testCases, function( testCase ) {
		expect( getSentences( testCase.input ) ).toEqual( testCase.expected );
	});
}

describe("Get sentences from text", function(){
	it("returns sentences", function () {
		var sentence = "Hello. How are you? Bye";
		expect( getSentences( sentence ) ).toEqual( ["Hello.","How are you?","Bye"] );
	});
	it("returns sentences with digits", function () {
		var sentence = "Hello. 123 Bye";
		expect( getSentences( sentence ) ).toEqual( [ "Hello.","123 Bye"] );
	});

	it("returns sentences with abbreviations", function () {
		var sentence = "It was a lot. Approx. two hundred";
		expect( getSentences( sentence ) ).toEqual( ["It was a lot.","Approx. two hundred"] );
	});

	it("returns sentences with a ! in it (should not be converted to . )", function () {
		var sentence = "It was a lot. Approx! two hundred";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot.","Approx!", "two hundred" ] );
	});

	it( "returns sentences, with :", function() {
		var sentence = "One. Two. Three: Four! Five."
		expect( getSentences( sentence ).length ).toBe ( 4 );
	});

	it("returns sentences with a text with H2 tags", function() {
		var text = "<h2>Four types of comments</h2>" +
			"The comments people leave on blogs can be divided into four types: " +
			"<h2>Positive feedback</h2>" +
			"First, the positive feedback. ";
		var expected = ["Four types of comments","The comments people leave on blogs can be divided into four types:","Positive feedback","First, the positive feedback."];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	});

	it( "returns a sentence with incomplete tags", function() {
		var text = "<p>Some text. More Text.</p>";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text."] );
	});

	it( "returns a sentence with incomplete tags per sentence", function() {
		var text = "<p><span>Some text. More Text.</span></p>";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text."] );
	});

	it( "returns a sentence with incomplete tags with a link", function() {
		var text = "Some text. More Text with <a href='http://yoast.com'>a link</a>.";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text with <a href='http://yoast.com'>a link</a>."] );
	});

	it( "can deal with self-closing tags", function() {
		var text = "A sentence with an image <img src='http://google.com' />";
		expect( getSentences( text ) ).toEqual( [ "A sentence with an image <img src='http://google.com' />" ] );
	});


	it( "can deal with newlines", function() {
		var testCases = [
			{
				input: "A sentence\nAnother sentence",
				expected: [ "A sentence", "Another sentence" ]
			},
			{
				input: "A sentence<br />Another sentence",
				expected: [ "A sentence", "Another sentence" ]
			},
			{
				input: "A sentence\rAnother sentence",
				expected: [ "A sentence", "Another sentence" ]
			},
			{
				input: "A sentence\n\rAnother sentence",
				expected: [ "A sentence", "Another sentence" ]
			},
			{
				input: "<p>A sentence</p><p>Another sentence</p>",
				expected: [ "A sentence", "Another sentence" ]
			},
			{
				input: "<div>A sentence</div><div>Another sentence</div>",
				expected: [ "A sentence", "Another sentence" ]
			}
		];

		testGetSentences( testCases );
	});

	it( "can deal with headings", function() {
		var testCases = [
			{
				input: "<h1>A sentence</h1>Another sentence",
				expected: [ "A sentence", "Another sentence" ]
			}
		];

		testGetSentences( testCases );
	});

	it( "can detect sentences in parentheses", function() {
		var text = "First sentence. (Second sentence.) [Third sentence.]";
		var expected = [
			"First sentence.",
			"(Second sentence.)",
			"[Third sentence.]"
		];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	});

	it( "should not split on parentheses", function() {
		var text = "A sentence with (parentheses).";
		var expected = [ "A sentence with (parentheses)." ];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	});

	it( "can detect sentences in brackets", function() {
		var text = "[First sentence. Second sentence.] Third sentence";
		var expected = [
			"[First sentence.",
			"Second sentence.]",
			"Third sentence"
		];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	});

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
			"Read more about the SEO copywriting training -- linken naar sales pagina"
		];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	});


	it( "ignores decimals with dots in them", function() {
		var testCases = [
			{
				input: "This is 1.0 complete sentence",
				expected: [ "This is 1.0 complete sentence" ]
			},
			{
				input: "This is 255.255.255.255 complete sentence",
				expected: [ "This is 255.255.255.255 complete sentence" ]
			}
		];

		testGetSentences( testCases );
	});

	it( "should not break on colons", function() {
		var testCases = [
			{
				input: "This should be: one sentence",
				expected: [ "This should be: one sentence" ]
			},
			{
				input: "This should be: one sentence",
				expected: [ "This should be: one sentence" ]
			}
		];

		testGetSentences( testCases );
	});

	it( "should always break on ;, ? and ! even when there is no capital letter", function() {
		var text = "First sentence; second sentence! third sentence? fourth sentence";
		var expected = [ "First sentence;", "second sentence!", "third sentence?", "fourth sentence" ];

		var actual = getSentences( text );

		expect( actual ).toEqual( expected );
	});
});
