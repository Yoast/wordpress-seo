import isPhrasingContent from "../../../../src/parse/build/private/isPhrasingContent";

const phrasingContentTags = [
	"b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea",
];

// List of nonPhrasingContentTags is not exhaustive (and it doesn't have to be).
const nonPhrasingContentTags = [
	"div", "h1", "h2", "h3", "h4", "h5", "h6",
];

describe(  "Test the isPhrasingContent helper", () => {
	it( "correctly identifies when something is phrasing content", () => {
		phrasingContentTags.forEach( tag => expect( isPhrasingContent( tag ) ).toBeTruthy() );
	} );

	it( "correctly identifies when something is phrasing content if the tagName is #text", () => {
		expect( isPhrasingContent( "#text" ) ).toBeTruthy();
	} );

	it( "correctly identifies when something isn't phrasing content", () => {
		nonPhrasingContentTags.forEach( tag => expect( isPhrasingContent( tag ) ).toBeFalsy() );
	} );
} );
