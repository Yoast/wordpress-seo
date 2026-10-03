import filterShortcodesFromTree, { filterShortcodesFromHTML } from "../../../../src/languageProcessing/helpers/sanitize/filterShortcodesFromTree";


describe( "filterShortcodesFromTree", function() {
	it( "should filter a shortcode with no parameters from a tree", function() {
		const tree = {
			sentences: [
				{
					text: "This is a [shortcode] test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: "]" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],
				} ] };
		const shortcodes = [ "shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.sentences[ 0 ].text ).toEqual( "This is a  test." );
	} );

	it( "should filter a shortcode with parameters from a tree", function() {
		const tree = {
			sentences: [
				{
					text: "This is a [shortcode param1='value1' param2='value2'] test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: " " },
						{ text: "param1='value1" },
						{ text: "'" },
						{ text: " " },
						{ text: "param2='value1" },
						{ text: "'" },
						{ text: "]" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],
				} ] };
		const shortcodes = [ "shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.sentences[ 0 ].text ).toEqual( "This is a  test." );
	} );

	it( "should filter multiple shortcodes from the same sentence", function() {
		const tree = {
			sentences: [
				{
					text: "This is a [shortcode] test with [another_shortcode] in it.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: "]" },
						{ text: " " },
						{ text: "test" },
						{ text: " " },
						{ text: "with" },
						{ text: " " },
						{ text: "[" },
						{ text: "another_shortcode" },
						{ text: "]" },
						{ text: " " },
						{ text: "in" },
						{ text: " " },
						{ text: "it" },
						{ text: "." },
					],
				},
			] };
		const shortcodes = [ "shortcode", "another_shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: " " },
			{ text: "test" },
			{ text: " " },
			{ text: "with" },
			{ text: " " },
			{ text: " " },
			{ text: "in" },
			{ text: " " },
			{ text: "it" },
			{ text: "." },
		] );
		expect( tree.sentences[ 0 ].text ).toEqual( "This is a  test with  in it." );
	} );

	it( "should filter multiple shortcodes from different sentences", function() {
		const tree = {
			sentences: [
				{
					text: "This is a [shortcode] test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: "]" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],
				},
				{
					text: "This is a [another_shortcode] test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "another_shortcode" },
						{ text: "]" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],
				},
			],
		};

		const shortcodes = [ "shortcode", "another_shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.sentences[ 0 ].text ).toEqual( "This is a  test." );

		expect( tree.sentences[ 1 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.sentences[ 1 ].text ).toEqual( "This is a  test." );
	} );
	it( "should filter a shortcode from a childnode.", function() {
		const tree = {
			childNodes: [
				{
					sentences: [
						{
							text: "This is a [shortcode] test.",
							tokens: [
								{ text: "This" },
								{ text: " " },
								{ text: "is" },
								{ text: " " },
								{ text: "a" },
								{ text: " " },
								{ text: "[" },
								{ text: "shortcode" },
								{ text: "]" },
								{ text: " " },
								{ text: "test" },
								{ text: "." },
							],

						},
					],
				},
			],
		};

		const shortcodes = [ "shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.childNodes[ 0 ].sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.childNodes[ 0 ].sentences[ 0 ].text ).toEqual( "This is a  test." );
	} );

	it( "should not filter a word between square brackets if it is not a shortcode", function() {
		const tree = {
			sentences: [
				{
					text: "This is a test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],
				},
			],
		};

		const shortcodes = [ "shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.sentences[ 0 ].text ).toEqual( "This is a test." );
	} );
	it( "should not filter if no shortcodes are available", function() {
		const tree = {
			sentences: [
				{
					text: "This is a [shortcode] test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: "]" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],

				},
			],
		};

		filterShortcodesFromTree( tree );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: "[" },
			{ text: "shortcode" },
			{ text: "]" },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );

		expect( tree.sentences[ 0 ].text ).toEqual( "This is a [shortcode] test." );
	} );

	it( "should filter an open-close pair of shortcodes.", function() {
		const tree  = {
			sentences: [
				{
					text: "This is a [shortcode]test[/shortcode].",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: "]" },
						{ text: "test" },
						{ text: "[" },
						{ text: "/" },
						{ text: "shortcode" },
						{ text: "]" },
						{ text: "." },
					],
				},
			],
		};

		const shortcodes = [ "shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );
	} );
	it( "should not filter a shortcode if there is no closing bracket", function() {
		const tree = {
			sentences: [
				{
					text: "This is a [shortcode test.",
					tokens: [
						{ text: "This" },
						{ text: " " },
						{ text: "is" },
						{ text: " " },
						{ text: "a" },
						{ text: " " },
						{ text: "[" },
						{ text: "shortcode" },
						{ text: " " },
						{ text: "test" },
						{ text: "." },
					],
				},
			],
		};

		const shortcodes = [ "shortcode" ];

		filterShortcodesFromTree( tree, shortcodes );

		expect( tree.sentences[ 0 ].tokens ).toEqual( [
			{ text: "This" },
			{ text: " " },
			{ text: "is" },
			{ text: " " },
			{ text: "a" },
			{ text: " " },
			{ text: "[" },
			{ text: "shortcode" },
			{ text: " " },
			{ text: "test" },
			{ text: "." },
		] );
	} );
} );


describe( "filterShortcodesFromHTML", function() {
	it( "should filter a shortcode from an html string", function() {
		const html = "<p>This is a [shortcode] test.</p>";

		const shortcodes = [ "shortcode" ];

		const filtered = filterShortcodesFromHTML( html, shortcodes );

		expect( filtered ).toEqual( "<p>This is a  test.</p>" );
	} );
	it( "should filter a shortcode with parameters from an html string", function() {
		const html = "<p>This is a [shortcode param=\"value\"] test.</p>";

		const shortcodes = [ "shortcode" ];

		const filtered = filterShortcodesFromHTML( html, shortcodes );

		expect( filtered ).toEqual( "<p>This is a  test.</p>" );
	} );
	it( "should filter multiple shortcodes from an html string", function() {
		const html = "<p>This is a [shortcode] test.</p><p>This is a [another_shortcode] test.</p>";

		const shortcodes = [ "shortcode", "another_shortcode" ];

		const filtered = filterShortcodesFromHTML( html, shortcodes );

		expect( filtered ).toEqual( "<p>This is a  test.</p><p>This is a  test.</p>" );
	} );
	it( "should not filter something between square brackets if it is not a shortcode.", function() {
		const html = "<p>This is a [not_a_shortcode] test.</p>";

		const shortcodes = [ "shortcode", "another_shortcode" ];

		const filtered = filterShortcodesFromHTML( html, shortcodes );

		expect( filtered ).toEqual( "<p>This is a [not_a_shortcode] test.</p>" );
	} );

	it( "should not filter if shortcodes parameter is not given", function() {
		const html = "<p>This is a [shortcode] test.</p>";

		const filtered = filterShortcodesFromHTML( html );

		expect( filtered ).toEqual( "<p>This is a [shortcode] test.</p>" );
	} );
	it( "should not filter if shortcodes is an empty list", function() {
		const html = "<p>This is a [shortcode] test.</p>";

		const shortcodes = [];

		const filtered = filterShortcodesFromHTML( html, shortcodes );

		expect( filtered ).toEqual( "<p>This is a [shortcode] test.</p>" );
	} );
} );
