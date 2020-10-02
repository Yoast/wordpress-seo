import {
	getSubheadings,
	getSubheadingsTopLevel,
	getSubheadingContents,
	getSubheadingContentsTopLevel,
	removeSubheadingsTopLevel,
} from "../../src/languages/legacy/stringProcessing/getSubheadings";

describe( "getSubheadingContents", function() {
	it( "returns subheadings", function() {
		const text = "<h1>one</h1><h2>two</h2><h3>three</h3><h4>four</h4><h5>five</h5>";
		const result = getSubheadingContents( text );

		expect( result ).toContain( "<h1>one</h1>" );
		expect( result ).toContain( "<h2>two</h2>" );
		expect( result ).toContain( "<h3>three</h3>" );
		expect( result ).toContain( "<h4>four</h4>" );
		expect( result ).toContain( "<h5>five</h5>" );
	} );
} );

describe( "getSubheadingContentsTopLevel", function() {
	it( "returns only h2 and h3 subheadings", function() {
		const text = "<h1>one</h1><h2>two</h2><h3>three</h3><h4>four</h4><h5>five</h5>";
		const result = getSubheadingContentsTopLevel( text );

		expect( result ).not.toContain( "<h1>one</h1>" );
		expect( result ).toContain( "<h2>two</h2>" );
		expect( result ).toContain( "<h3>three</h3>" );
		expect( result ).not.toContain( "<h4>four</h4>" );
		expect( result ).not.toContain( "<h5>five</h5>" );
	} );
} );

describe( "getSubheadings", function() {
	it( "should return empty for no subheadings", function() {
		expect( getSubheadings( "" ) ).toEqual( [] );
	} );

	it( "should return all matches in the text", function() {
		const text = "<h1>one</h1><h2>two</h2><h3>three</h3><h4>four</h4><h5>five</h5>";
		const result = getSubheadings( text );

		const expectations = [
			[ "<h1>one</h1>", "1", "one" ],
			[ "<h2>two</h2>", "2", "two" ],
			[ "<h3>three</h3>", "3", "three" ],
			[ "<h4>four</h4>", "4", "four" ],
			[ "<h5>five</h5>", "5", "five" ],
		];

		expectations.forEach( function( expectation, i ) {
			expectation.forEach( function( value, j ) {
				expect( result[ i ][ j ] ).toBe( value );
			} );
		} );
	} );
} );

describe( "getSubheadingsTopLevel", function() {
	it( "should return empty for no subheadings", function() {
		expect( getSubheadingsTopLevel( "" ) ).toEqual( [] );
	} );

	it( "should return all matches in the text", function() {
		const text = "<h1>one</h1><h2>two</h2><h3>three</h3><h4>four</h4><h5>five</h5>";
		const result = getSubheadingsTopLevel( text );

		const expectations = [
			[ "<h2>two</h2>", "2", "two" ],
			[ "<h3>three</h3>", "3", "three" ],
		];

		expectations.forEach( function( expectation, i ) {
			expectation.forEach( function( value, j ) {
				expect( result[ i ][ j ] ).toBe( value );
			} );
		} );
	} );
} );

describe( "removeSubheadingsTopLevel", function() {
	it( "should remove all h2 and h3 subheadings from the text while keeping the other levels intact", function() {
		const text = "<h1>one</h1>Some text after subheading h1.<h2>two</h2>Some text after subheading h2." +
			"<h3>three</h3>Some text after subheading h3.<h4>four</h4>Some text after subheading h4." +
			"<h5>five</h5>Some text after subheading h5.";
		const result = removeSubheadingsTopLevel( text );

		const expectedResult = "<h1>one</h1>Some text after subheading h1.Some text after subheading h2." +
			"Some text after subheading h3.<h4>four</h4>Some text after subheading h4." +
			"<h5>five</h5>Some text after subheading h5.";

		expect( expectedResult ).toEqual( result );
	} );

	it( "correctly removes multiple subheadings of the same level", function() {
		const text = "<h1>one</h1>Some text after subheading h1.<h2>two</h2>Some text after subheading h2." +
			"<h2>two again</h2>Some text after subheading h2 again." +
			"<h2>two again again</h2>Some text after subheading h2 again again." +
			"<h3>three</h3>Some text after subheading h3.<h4>four</h4>Some text after subheading h4." +
			"<h5>five</h5>Some text after subheading h5.";
		const result = removeSubheadingsTopLevel( text );

		const expectedResult = "<h1>one</h1>Some text after subheading h1.Some text after subheading h2." +
			"Some text after subheading h2 again.Some text after subheading h2 again again." +
			"Some text after subheading h3.<h4>four</h4>Some text after subheading h4." +
			"<h5>five</h5>Some text after subheading h5.";

		expect( expectedResult ).toEqual( result );
	} );
} );
