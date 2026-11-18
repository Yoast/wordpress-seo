import Paper from "../../../src/values/Paper.js";
import getParagraphs from "../../../src/languageProcessing/researches/getParagraphs";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import buildTree from "../../specHelpers/parse/buildTree";

describe( "testing fetching of paragraphs", function() {
	const data = [
		[ "should not fail on an empty text",
			"", 0 ],
		[ "should match paragraphs between p tags",
			"<p>Lorem ipsum</p><p>dolor sit amet</p>", 2 ],
		[ "should match implicit paragraphs",
			"Lorem ipsum dolor sit amet", 1 ],
		[ "should not match empty paragraphs",
			"<p>test</p><p> </p><p>more text</p>", 2 ],
		[ "should not match paragraphs consisting only of links",
			"<p>test</p><p><a href='yoast.com'>test</a><a href='yoast.com'>another test</a></p><p>more text</p>", 2 ],
	];

	it.each( data )( "%s", ( description, text, expected ) => {
		const mockPaper = new Paper( text );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( getParagraphs( mockPaper ).length ).toBe( expected );
	} );
} );
