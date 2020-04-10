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
} );
