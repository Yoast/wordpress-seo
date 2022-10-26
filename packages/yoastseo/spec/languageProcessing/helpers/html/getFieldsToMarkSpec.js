import { getFieldsToMark } from "../../../../src/languageProcessing";
import Mark from "../../../../src/values/Mark";

describe( "a test to retrieve the text section to apply the marking to", () => {
	it( "returns an empty array of selected text if the marking applies to the whole text", () => {
		const marks = [
			new Mark( {
				original: "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. ",
				marked: "<yoastmark class='yoast-text-mark'>Tortoiseshell</yoastmark> is a <yoastmark class='yoast-text-mark'>cat</yoastmark> " +
					"coat coloring named for its similarity to <yoastmark class='yoast-text-mark'>tortoiseshell</yoastmark> material.",
			} ),
			new Mark( {
				original: "Tortoiseshell cat",
				marked: "<yoastmark class='yoast-text-mark'>Tortoiseshell cat</yoastmark>",
			} ),

		];
		const text = "<p>Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. Like calicoes, " +
			"tortoiseshell cats are almost exclusively female. Male tortoiseshells are rare and are usually sterile. " +
			"Tortoiseshell cats, or torties, combine two colors other than white, either closely mixed or in larger patches.</p>" +
			"<h3>Tortoiseshell cat</h3>" +
			" <p>The colors are often described as red and black, but the \"red\" patches can instead be orange, yellow, or cream," +
			" and the \"black\" can instead be chocolate, gray, tabby, or blue.</p>";
		expect( getFieldsToMark( marks, text ) ).toEqual( { fieldsToMark: [], selectedHTML: [] } );
	} );
	it( "returns only the subheading as the selected text if fields mark is set to 'heading'", () => {
		const marks = [
			new Mark( {
				original: "Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. ",
				marked: "<yoastmark class='yoast-text-mark'>Tortoiseshell</yoastmark> is a <yoastmark class='yoast-text-mark'>cat</yoastmark> " +
					"coat coloring named for its similarity to <yoastmark class='yoast-text-mark'>tortoiseshell</yoastmark> material.",
				fieldsToMark: [ "heading" ],
			} ),
			new Mark( {
				original: "Tortoiseshell cat",
				marked: "<yoastmark class='yoast-text-mark'>Tortoiseshell cat</yoastmark>",
				fieldsToMark: [ "heading" ],
			} ),

		];
		const text = "<p>Tortoiseshell is a cat coat coloring named for its similarity to tortoiseshell material. Like calicoes, " +
			"tortoiseshell cats are almost exclusively female. Male tortoiseshells are rare and are usually sterile. " +
			"Tortoiseshell cats, or torties, combine two colors other than white, either closely mixed or in larger patches.</p>" +
			"<h3>Tortoiseshell cat</h3>" +
			" <p>The colors are often described as red and black, but the \"red\" patches can instead be orange, yellow, or cream," +
			" and the \"black\" can instead be chocolate, gray, tabby, or blue.</p>";
		expect( getFieldsToMark( marks, text ) ).toEqual( { fieldsToMark: [ "heading" ], selectedHTML: [ "<h3>Tortoiseshell cat</h3>" ] } );
	} );
} );

