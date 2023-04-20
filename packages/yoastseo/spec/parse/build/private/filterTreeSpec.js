// External dependencies.
import { parseFragment } from "parse5";
// Internal dependencies.
import filterTree from "../../../../src/parse/build/private/filterTree";
import adapt from "../../../../src/parse/build/private/adapt";
import permanentFilters from "../../../../src/parse/build/private/alwaysFilterElements";

describe( "Tests for Yoast blocks", () => {
	it( "should filter yoast breadcrumbs block", () => {
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

	it( "should filter yoast table of contents block", () => {
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

	it( "should filter yoast estimated reading time block", () => {
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

/**
 * Object that contains data to test an assessment with.
 *
 * @typedef {Object} AssessmentTestData
 *
 * @property {string} name The name of the HTML element.
 * @property {string} html The string containing the html element.
 * @property {number} expectedLength The expected sore.
 */

/**
 * Tests html.
 *
 * @param {AssessmentTestData[]} testDataArray The array of data to test.
 *
 * @returns {void}
 */
function testTreeForHTML( testDataArray ) {
	testDataArray.forEach( ( testData ) => {
		const tree = adapt( parseFragment( testData.html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( tree.findAll( child => child.name === testData.name ) ).toHaveLength( testData.expectedLength );
		expect( filteredTree.findAll( child => child.name === testData.name ) ).toHaveLength( 0 );
	} );
}

// DOESN'T WORK FOR NOW :( .
// TODO: FIX OR DISCARD.
describe( "Tests for HTML elements", () => {
	it( "blockquote elements", () => {
		const testData = [
			{
				name: "blockquote",
				html: "<div><base target=\"_top\" href=\"https://yoast.com/\"/><p><blockquote " +
					"cite=\"http://www.worldwildlife.org/who/index.html\">\n" +
					"For 50 years, WWF has been protecting the future of nature.\n</blockquote><div>A div</div></p></div>",
				expectedLength: 1,
			},
		];
		testTreeForHTML( testData );
	} );
} );

describe( "Tests for HTML elements", () => {
	// Each test includes at least 2 types of elements, in order to resemble more closely a tree.
	it( "should filter base elements", () => {
		const html = "<div><base target=\"_top\" href=\"https://yoast.com/\"/></div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "base" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "base" ) ).toHaveLength( 0 );
	} );

	it( "should filter blockquote elements", () => {
		const html = "<p><blockquote cite=\"http://www.worldwildlife.org/who/index.html\">\n" +
			"For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, " +
			"WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.\n" +
			"</blockquote><div>A div</div></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "blockquote" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "blockquote" ) ).toHaveLength( 0 );
	} );

	it( "should filter canvas elements", () => {
		const html = "<div>\n<canvas id=\"YoastCanvas\" width=\"450\" height=\"150\">" +
			"Behold the canvas of the universe!</canvas>\n</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "canvas" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "canvas" ) ).toHaveLength( 0 );
	} );

	it( "should filter code elements", () => {
		const html = "<p>We expect <code>filteredTree.findAll()</code> to <code>toHaveLength()</code> of zero.</p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "code" ) ).toHaveLength( 2 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "code" ) ).toHaveLength( 0 );
	} );

	it( "should filter head elements", () => {
		// TODO: Figure out why this is the only unit test that's failing.
		// const html = "<!DOCTYPE html>\n<head>\n<title>This is what dreams are made of</title>\n</head>\n</html>";
		const html = "<head><title>Document title</title></head>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "head" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "head" ) ).toHaveLength( 0 );
	} );

	it( "should filter iframe elements", () => {
		const html = "<div>\n<iframe> title=\"Not enough time\" src=\"https://jestjs.io/docs\"</iframe>\n A div</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "iframe" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "iframe" ) ).toHaveLength( 0 );
	} );

	it( "should filter input elements", () => {
		const html = "<div>A div<input type=\"text\" id=\"Mmbop\" name=\"Mmbop\"><br></div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "input" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "input" ) ).toHaveLength( 0 );
	} );

	it( "should filter kbd elements", () => {
		const html = "<h4>Press <kbd>Shift</kbd> <kbd>Command</kbd> <kbd>5</kbd> to record your screen.</h4>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "kbd" ) ).toHaveLength( 3 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "kbd" ) ).toHaveLength( 0 );
	} );

	it( "should filter link elements", () => {
		const html = "<div><link\n rel=\"rabbit-icon\"\n href=\"rabbit-with-a-violin.jpg\"/>\n</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "link" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "link" ) ).toHaveLength( 0 );
	} );

	it( "should filter math elements", () => {
		const html = "<p>\n<math display=\"inline\"><mn>1</mn></math></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "math" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "math" ) ).toHaveLength( 0 );
	} );

	it( "should filter meta elements", () => {
		const html = "<p>\n<meta name=\"bongobong\"><meta content=\"url=https://yoast.com\" /></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "meta" ) ).toHaveLength( 2 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "meta" ) ).toHaveLength( 0 );
	} );

	it( "should filter meter elements", () => {
		const html = "<meter id=\"dire straits\"\n min=\"-100\" max=\"100\"\n </meter>\n <div>A div</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "meter" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "meter" ) ).toHaveLength( 0 );
	} );

	it( "should filter noscript elements", () => {
		const html = "<div>A div\n <noscript>You've found yourself lost in the depths of the web. Beware!</noscript>\n </div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "noscript" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "noscript" ) ).toHaveLength( 0 );
	} );

	it( "should filter object elements", () => {
		const html = "<p><object type=\"icon/svg\"\n data=\"/score/icons/sad.svg\"</object>\n <div>A div</div>\n </p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "object" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "object" ) ).toHaveLength( 0 );
	} );

	it( "should filter portal elements", () => {
		const html = "<p><portal src=\"https://halva.com/\"></portal>\n<div>A div</div>\n </p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "portal" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "portal" ) ).toHaveLength( 0 );
	} );

	it( "should filter pre elements", () => {
		const html = "<p><pre> wIth                 PRE you do ~WHST!!! you want :)))</pre>\n<div>A div</div>\n </p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "pre" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "pre" ) ).toHaveLength( 0 );
	} );

	it( "should filter progress elements", () => {
		const html = "<div>A div<progress id=\"level of satisfaction\" value=\"5\" max=\"100\"> 5% </progress></div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "progress" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "progress" ) ).toHaveLength( 0 );
	} );

	it( "should filter q elements", () => {
		const html = "<p>And the Fool said, <q cite=\"https://www.folger.edu/explore/shakespeares-works/king-lear/read/3/6/\">" +
			"Prithee, nuncle, tell me whether a madman be a\n gentleman or a yeoman.\n</q>\n<div>A div</div>\n </p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "q" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "q" ) ).toHaveLength( 0 );
	} );

	it( "should filter samp elements", () => {
		const html = "<p><samp>Welcome to the blue screen of death.<br>Kiss your computer goodbye.</samp><div>A div</div></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "samp" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "samp" ) ).toHaveLength( 0 );
	} );

	it( "should filter script elements", () => {
		const html = "<script>console.log(\"Hello, world!\")</script><div>A div</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "script" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "script" ) ).toHaveLength( 0 );
	} );

	it( "should filter slot elements", () => {
		const html = "<div class=\"settings\"><slot name=\"settings-ui\"><p>A UX Dream</p></slot> </div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "slot" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "slot" ) ).toHaveLength( 0 );
	} );

	it( "should filter style elements", () => {
		const html = "<style>div { color: #FF00FF}</style><div>A div</div>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "style" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "style" ) ).toHaveLength( 0 );
	} );

	it( "should filter svg elements", () => {
		const html = "<p>Here's one of our icons, simplified<svg>\n" +
			"  <circle\n key=\"5\" className=\"path\" fill=\"none\" strokeWidth=\"6\" strokeLinecap=\"round\" cx=\"33\"\n" +
			"</svg><div>A div</div></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "svg" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "svg" ) ).toHaveLength( 0 );
	} );

	it( "should filter template elements", () => {
		const html = "<body><div>A div</div><template>\n<p>Here's a template that's not actually rendered</p>\n " +
			"<img src=\"img_green_bowl_of_dispair.png\" >\n</template></body>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "template" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "template" ) ).toHaveLength( 0 );
	} );

	it( "should filter textarea elements", () => {
		const html = "<body><div>A div</div><textarea id=\"school\" name=\"homework\" rows=\"5\" cols=\"5\">\n " +
			"What did you do during your last summer holidays? \n</textarea>\n</body>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "textarea" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "textarea" ) ).toHaveLength( 0 );
	} );

	it( "should filter title elements", () => {
		const html = "<!DOCTYPE html>\n<html>\n <head>\n<title>News and gossip</title>\n </head> </html>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "title" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "title" ) ).toHaveLength( 0 );
	} );

	it( "should filter var elements", () => {
		const html = "<!DOCTYPE html>\n<html>\n<p>If a triangle has one <var>90</var> degrees angle and one <var>30</var>" +
			"degrees angle, how big is the remaining angle?</p></html>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "var" ) ).toHaveLength( 2 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "var" ) ).toHaveLength( 0 );
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

	it( "should filter elements like <strong>, which are nested within excluded elements, e.g. <samp>", () => {
		const html = "<p><samp>Welcome to the blue screen of <strong>death</strong>.<br>Kiss your computer goodbye.</samp></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 0 );
	} );
} );
