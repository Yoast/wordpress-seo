import * as dom from "../../../src/classic-editor/helpers/dom";

jest.mock( "../../../src/helpers/replacementVariableHelpers", () => ( {
	excerptFromContent: jest.fn( () => "Tortoiseshell is a cat coat coloring named for its similarity to " +
		"tortoiseshell material. Like calicos, tortoiseshell cats are almost exclusively female." ),
} ) );

describe( "a test for retrieving data from dom", () => {
	it( "should return the term excerpt retrieved from term content", () => {
		expect( dom.getTermExcerpt() ).toEqual( "Tortoiseshell is a cat coat coloring named for its similarity to " +
			"tortoiseshell material. Like calicos, tortoiseshell cats are almost exclusively female." );
	} );
} );
