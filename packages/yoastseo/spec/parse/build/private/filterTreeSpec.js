// External dependencies.
import { parseFragment } from "parse5";
// Internal dependencies.
import filterTree from "../../../../src/parse/build/private/filterTree";
import adapt from "../../../../src/parse/build/private/adapt";
import permanentFilters from "../../../../src/parse/build/private/alwaysFilterElements";

// ToC

describe( "Tests for Yoast blocks", () => {
	it( "should filter Yoast Related links block", () => {
		const html = "<div tabindex=\"0\" id=\"block-f5979f6b-5b08-4162-96d5-9854c526145a\" role=\"document\"" +
			"aria-label=\"Block: Yoast Related Links\" data-block=\"f5979f6b-5b08-4162-96d5-9854c526145a\" " +
			"data-type=\"yoast-seo/related-links\" data-title=\"Yoast Related Links\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"></div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.attributes[ "data-type" ] === "yoast-seo/related-links" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.attributes[ "data-type" ] === "yoast-seo/related-links" ) ).toHaveLength( 0 );
	} );
	it( "should filter Yoast Breadcrumbs block", () => {
		const html = "<div class=\"yoast-breadcrumbs\"><span><span><a href=\"http://wordpress.test/\">Home</a></span></span></div>" +
			"<div>Hello world!</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [
					{
						name: "p",
						isImplicit: true,
						attributes: {},
						childNodes: [
							{
								name: "#text",
								value: "Hello world!",
							},
						],
						sourceCodeLocation: {
							startOffset: 109,
							endOffset: 121,
						},
					},
				],
				sourceCodeLocation: {
					startOffset: 104,
					endOffset: 127,
					startTag: {
						startOffset: 104,
						endOffset: 109,
					},
					endTag: {
						startOffset: 121,
						endOffset: 127,
					},
				},
			} ],
		} );
	} );

	it( "should filter Yoast Table of contents block", () => {
		const html = "<div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'>Hey, this is a table of contents.</div>" +
			"<div>A div</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: true,
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "A div",
						},
					],
					sourceCodeLocation: {
						startOffset: 118,
						endOffset: 123,
					},
				} ],
				sourceCodeLocation: {
					startOffset: 113,
					endOffset: 129,
					startTag: {
						startOffset: 113,
						endOffset: 118,
					},
					endTag: {
						startOffset: 123,
						endOffset: 129,
					},
				},
			} ],
		} );
	} );

	it( "should filter Yoast Estimated reading time block", () => {
		const html = "<p class='yoast-reading-time__wrapper'></p>" +
			"<div>A div</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: true,
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "A div",
						},
					],
					sourceCodeLocation: {
						startOffset: 48,
						endOffset: 53,
					},
				} ],
				sourceCodeLocation: {
					startOffset: 43,
					endOffset: 59,
					startTag: {
						startOffset: 43,
						endOffset: 48,
					},
					endTag: {
						startOffset: 53,
						endOffset: 59,
					},
				},
			} ],
		} );
	} );
} );

// Object containing HTML elements we filter out from the tree. The elements occur only once in the given html sample.
// However, each sample includes at least 2 types of html elements, in order to resemble more closely a tree ⍋.
const samplesWithOneOccurrence = [
	{
		element: "base",
		html: "<div><base target=\"_top\" href=\"https://yoast.com/\"/></div>",
	},
	{
		element: "base",
		html: "<div><base target=\"_top\" href=\"https://yoast.com/\"/></div>",
	},
	{
		element: "blockquote",
		html: "<p><blockquote cite=\"http://www.worldwildlife.org/who/index.html\">\n" +
			"For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, " +
			"WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.\n" +
			"</blockquote><div>A div</div></p>",
	},
	{
		element: "canvas",
		html: "<div>\n<canvas id=\"YoastCanvas\" width=\"450\" height=\"150\">" +
			"Behold the canvas of the universe!</canvas>\n</div>",
	},
	{
		element: "iframe",
		html: "<div>\n<iframe> title=\"Not enough time\" src=\"https://jestjs.io/docs\"</iframe>\n A div</div>",
	},
	{
		element: "input",
		html: "<div>A div<input type=\"text\" id=\"Mmbop\" name=\"Mmbop\"><br></div>",
	},
	{
		element: "link",
		html: "<div><link\n rel=\"rabbit-icon\"\n href=\"rabbit-with-a-violin.jpg\"/>\n</div>",
	},
	{
		element: "math",
		html: "<p>\n<math display=\"inline\"><mn>1</mn></math></p>",
	},
	{
		element: "meter",
		html: "<meter id=\"dire straits\"\n min=\"-100\" max=\"100\"\n </meter>\n <div>A div</div>",
	},
	{
		element: "noscript",
		html: "<div>A div\n <noscript>You've found yourself lost in the depths of the web. Beware!</noscript>\n </div>",
	},
	{
		element: "object",
		html: "<p><object type=\"icon/svg\"\n data=\"/score/icons/sad.svg\"</object>\n <div>A div</div>\n </p>",
	},
	{
		element: "portal",
		html: "<p><portal src=\"https://halva.com/\"></portal>\n<div>A div</div>\n </p>",
	},
	{
		element: "pre",
		html: "<p><pre> wIth                 PRE you do ~WHST!!! you want :)))</pre>\n<div>A div</div>\n </p>",
	},
	{
		element: "progress",
		html: "<div>A div<progress id=\"level of satisfaction\" value=\"5\" max=\"100\"> 5% </progress></div>",
	},
	{
		element: "q",
		html: "<p>And the Fool said, <q cite=\"https://www.folger.edu/explore/shakespeares-works/king-lear/read/3/6/\">" +
			"Prithee, nuncle, tell me whether a madman be a\n gentleman or a yeoman.\n</q>\n<div>A div</div>\n </p>",
	},
	{
		element: "samp",
		html: "<p><samp>Welcome to the blue screen of death.<br>Kiss your computer goodbye.</samp><div>A div</div></p>",
	},
	{
		element: "script",
		html: "<script>console.log(\"Hello, world!\")</script><div>A div</div>",
	},
	{
		element: "slot",
		html: "<div class=\"settings\"><slot name=\"settings-ui\"><p>A UX Dream</p></slot> </div>",
	},
	{
		element: "style",
		html: "<style>div { color: #FF00FF}</style><div>A div</div>",
	},
	{
		element: "svg",
		html: "<p>Here's one of our icons, simplified<svg>\n <circle\n key=\"5\" className=\"path\" fill=\"none\" " +
			"strokeWidth=\"6\" strokeLinecap=\"round\" cx=\"33\"\n</svg><div>A div</div></p>",
	},
	{
		element: "template",
		html: "<body><div>A div</div><template>\n<p>Here's a template that's not actually rendered</p>\n " +
			"<img src=\"img_green_bowl_of_dispair.png\" >\n</template></body>",
	},
	{
		element: "textarea",
		html: "<body><div>A div</div><textarea id=\"school\" name=\"homework\" rows=\"5\" cols=\"5\">\n " +
			"What did you do during your last summer holidays? \n</textarea>\n</body>",
	},
	{
		element: "title",
		html: "<!DOCTYPE html>\n<html>\n <head>\n<title>News and gossip</title>\n </head> </html>",
	},
	{
		element: "style",
		html: "<style>div { color: #FF00FF}</style><div>A div</div>",
	},
];

describe.each( samplesWithOneOccurrence )( "Test", ( htmlElement ) => {
	it( "all elements", () => {
		const tree = adapt( parseFragment( htmlElement.html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 0 );
	} );
} );

// In this object the excluded HTML elements occur twice in the given HTML sample.
// Also, each sample includes at least 2 types of html elements, in order to resemble more closely a real life tree ⍋.
const samplesWithTwoOccurrences = [
	{
		element: "code",
		html: "<p>We expect <code>filteredTree.findAll()</code> to <code>toHaveLength()</code> of zero.</p>",
	},
	{
		element: "kbd",
		html: "<h4>Press <kbd>Command</kbd> <kbd>Z</kbd> to undo your previous action.</h4>",
	},
	{
		element: "meta",
		html: "<p>\n<meta name=\"bongobong\"><meta content=\"url=https://yoast.com\" /></p>",
	},
	{
		element: "var",
		html: "<!DOCTYPE html>\n<html>\n<p>If a triangle has one <var>90</var> degrees angle and one <var>30</var>" +
			"degrees angle, how big is the remaining angle?</p></html>",
	},
];

describe.each( samplesWithTwoOccurrences )( "Test", ( htmlElement ) => {
	it( "all elements", () => {
		const tree = adapt( parseFragment( htmlElement.html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 2 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 0 );
	} );
} );

describe( "Miscellaneous tests", () => {
	it( "should correctly filter when a custom filter is provided.", function() {
		const html = "<div data-test='blah'></div><div>Hello world!</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, [ ( elem ) => {
			return elem.name === "div" && elem.attributes[ "data-test" ] && elem.attributes[ "data-test" ] === "blah";
		} ] );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [
					{
						name: "p",
						isImplicit: true,
						attributes: {},
						childNodes: [
							{
								name: "#text",
								value: "Hello world!",
							},
						],
						sourceCodeLocation: {
							startOffset: 33,
							endOffset: 45,
						},
					},
				],
				sourceCodeLocation: {
					startOffset: 28,
					endOffset: 51,
					startTag: {
						startOffset: 28,
						endOffset: 33,
					},
					endTag: {
						startOffset: 45,
						endOffset: 51,
					},
				},
			} ],
		} );
	} );

	it( "shouldn't filter elements like <strong>, which are not included in the list of excluded elements", () => {
		const html = "<p>Welcome to the blue screen of <strong>death</strong>.</p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
	} );

	it( "should filter elements like <strong> when nested within excluded elements, e.g. <samp>", () => {
		const html = "<p><samp>Welcome to the blue screen of <strong>death</strong>.<br>Kiss your computer goodbye.</samp></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 0 );
	} );

	it( "should filter head elements", () => {
		// The head element seems to be removed by the parser we employ.
		const html = "<!DOCTYPE html>\n<head>\n<title>This is what dreams are made of</title>\n</head>\n</html>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "head" ) ).toHaveLength( 0 );
	} );
} );
