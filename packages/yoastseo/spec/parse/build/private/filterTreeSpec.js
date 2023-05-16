// External dependencies.
import { parseFragment } from "parse5";
// Internal dependencies.
import filterTree from "../../../../src/parse/build/private/filterTree";
import adapt from "../../../../src/parse/build/private/adapt";
import permanentFilters from "../../../../src/parse/build/private/alwaysFilterElements";

// ToC
// 1: Tests the filtering out of Yoast blocks.
// 2: Tests the filtering out of HTML elements when they occur only once.
// 3: Tests the filtering out of HTML elements when they occur twice.
// 4: Miscellaneous tests.
// 5: Tests the filtered trees of Yoast blocks and of a made-up block.

// Object containing samples of Yoast blocks we filter out from the tree.
const samplesWithYoastBlocks = [
	{
		element: "yoast-seo/table-of-contents",
		html: "<!DOCTYPE html><html class=\"wp-toolbar-interface-skeleton__html-container\" lang=\"en-US\"><body><div tabindex=\"0\" " +
			"id=\"block-0d6afe90-788b-4cf6-91d9-f3f9f0c122ec\" role=\"document\" " +
			"aria-label=\"Block: Yoast Table of Contents\" data-block=\"0d6afe90-788b-4cf6-91d9-f3f9f0c122ec\" " +
			"data-type=\"yoast-seo/table-of-contents\" data-title=\"Yoast Table of Contents\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"><div class=\"yoast-table-of-contents\">" +
			"<h2 role=\"textbox\" aria-multiline=\"true\" contenteditable=\"true\" class=\"block-editor-rich-text" +
			"__editable rich-text\" style=\"white-space: pre-wrap; min-width: 1px;\">Table of contents</h2><ul></ul>" +
			"</div></div><h2>A Heading</h2></body></html>",
	},
	{
		element: "yoast-seo/breadcrumbs",
		html: "<!DOCTYPE html><html lang=\"en-US\"><body><div tabindex=\"0\" id=\"block-ba03f640-2b86-4e6f-9e98-efc657db729b\" " +
			"role=\"document\" aria-label=\"Block: Yoast Breadcrumbs\" data-block=\"ba03f640-2b86-4e6f-9e98-efc657db729b\" " +
			"data-type=\"yoast-seo/breadcrumbs\" data-title=\"Yoast Breadcrumbs\" class=\"block-editor-block-list__block wp-block is-selected\" " +
			"style=\"transform-origin: center center; transform: translate3d(0px, -1px, 0px);\"></div><h2>A Heading</h2></body></html>",
	},
	{
		element: "yoast-seo/estimated-reading-time",
		html: "<html lang=\"en-US\"><body><div tabindex=\"0\" id=\"block-62462faa-6047-481b-b3fc-8603369c08f6\" role=\"document\" " +
			"aria-label=\"Block: Yoast Estimated Reading Time\" data-block=\"62462faa-6047-481b-b3fc-8603369c08f6\" " +
			"data-type=\"yoast-seo/estimated-reading-time\" data-title=\"Yoast Estimated Reading Time\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"><div><p class=\"yoast-reading-time" +
			"__wrapper\"><span class=\"yoast-reading-time__icon\"><svg aria-hidden=\"true\" focusable=\"false\" " +
			"data-icon=\"clock\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" role=\"img\"> " +
			"</svg><span class=\"yoast-reading-time__descriptive-text\">Estimated reading time:  </span></p></div></div>" +
			"<h2>A Heading</h2></body></html>",
	},
	{
		element: "yoast-seo/siblings",
		html: "<!DOCTYPE html><html lang=\"en-US\"><body><p>Mmm whatcha say</p><div tabindex=\"0\" id=\"block-f1d3baad-" +
			"2b41-4a49-b57c-df3b83227d88\" role=\"document\" aria-label=\"Block: " +
			"Yoast Siblings\" data-block=\"f1d3baad-2b41-4a49-b57c-df3b83227d88\" data-type=\"yoast-seo/siblings\" " +
			"data-title=\"Yoast Siblings\" class=\"block-editor-block-list__block wp-block is-selected\"></div></body></html>",
	},
	{
		element: "yoast-seo/subpages",
		html: "<!DOCTYPE html><html lang=\"en-US\"><body><p>Perfunctory gobbledygook</p><div tabindex=\"0\" id=\"block-" +
			"89a61532-41f5-49b5-ab04-bb36f60b2ca9\" role=\"document\" aria-label=\"Block: Yoast Subpages\" data-block=\"89" +
			"a61532-41f5-49b5-ab04-bb36f60b2ca9\" data-type=\"yoast-seo/subpages\" data-title=\"Yoast Subpages\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"></div></body></html>",
	},
];

describe.each( samplesWithYoastBlocks )( "Tests all Yoast blocks we exclude", ( htmlElement ) => {
	it( "tests html samples of Yoast blocks", () => {
		const tree = adapt( parseFragment( htmlElement.html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.attributes && child.attributes[ "data-type" ] === htmlElement.element ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.attributes && child.attributes[ "data-type" ] === htmlElement.element ) ).toHaveLength( 0 );
	} );
} );

// Object containing HTML elements we filter out from the tree. The elements occur only once in the given html sample.
// However, each sample includes at least 2 types of html elements, in order to resemble more closely a tree ⍋.
const samplesWithOneOccurrence = [
	{
		element: "base",
		html: "<!DOCTYPE html><html class=\"wp-toolbar-interface-skeleton__html-container\" lang=\"en-US\"><body><div>" +
			"<base target=\"_top\" href=\"https://yoast.com/\"/></div><h2>A Heading</h2></body></html>",
	},
	{
		element: "blockquote",
		html: "<!DOCTYPE html><html lang=\"en-US\"><p><blockquote cite=\"http://www.worldwildlife.org/who/index.html\">\n" +
			"For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, " +
			"WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.\n" +
			"</blockquote><div>A div</div></p></html>",
	},
	{
		element: "canvas",
		html: "<!DOCTYPE html><html lang=\"en-US\"><p> A paragraph</p><div>\n<canvas id=\"YoastCanvas\" width=\"450\" height=\"150\">" +
			"Behold the canvas of the universe!</canvas>\n</div></html>",
	},
	{
		element: "iframe",
		html: "<html lang=\"en-US\"><p> A paragraph</p><div>\n<iframe> title=\"Not enough time\" src=\"https://jestjs.io/" +
			"docs\"</iframe>\n A div</div></html>",
	},
	{
		element: "input",
		html: "<!DOCTYPE html><html lang=\"en-US\"><div>A div<input type=\"text\" id=\"Mmbop\" name=\"Mmbop\"><br></div><p> A paragraph</p></html>",
	},
	{
		element: "link",
		html: "<!DOCTYPE html><html lang=\"en-US\"><div><link\n rel=\"rabbit-icon\"\n href=\"rabbit-with-a-violin.jpg\"/>\n</div><h3>M</h3></html>",
	},
	{
		element: "math",
		html: "<!DOCTYPE html><html lang=\"en-US\"><body><p>\n<math display=\"inline\"><mn>1</mn></math></p></body></html>",
	},
	{
		element: "meter",
		html: "<!DOCTYPE html><html lang=\"en-US\"><div><meter id=\"dire straits\"\n min=\"-100\" max=\"100\"\n </meter>A div</div></html>",
	},
	{
		element: "noscript",
		html: "<html lang=\"en-US\"><p> A paragraph</p><div>A div\n <noscript>You've found yourself lost in the depths of the web. Beware!" +
			"</noscript>\n </div></html>",
	},
	{
		element: "object",
		html: "<html lang=\"en-US\"><h3>A</h3><div><p><object type=\"icon/svg\"\n data=\"/score/icons/sad.svg\"</object>\n</p></div></html>",
	},
	{
		element: "portal",
		html: "<!DOCTYPE html><html lang=\"en-US\"><div><p><portal src=\"https://halva.com/\"></portal>\n</p>/div></html>",
	},
	{
		element: "pre",
		html: "<html lang=\"en-US\"><div><p><pre> wIth                 PRE you do ~WHST!!! you want :)))</pre>\n </p></div></html>",
	},
	{
		element: "progress",
		html: "<body><div>A div<progress id=\"level of satisfaction\" value=\"5\" max=\"100\"> 5% </progress></div><p> A paragraph</p></body>",
	},
	{
		element: "q",
		html: "<body><div><p>And the Fool said, <q cite=\"https://www.folger.edu/explore/shakespeares-works/king-lear/read/3/6/\">" +
			"Prithee, nuncle, tell me whether a madman be a\n gentleman or a yeoman.\n</q>\n</p></div></body>",
	},
	{
		element: "samp",
		html: "<body><div><p><samp>Welcome to the blue screen of death.<br>Kiss your computer goodbye.</samp></p></div></body>",
	},
	{
		element: "script",
		html: "<html lang=\"en-US\"><body><div><p><script>console.log(\"Hello, world!\")</script></p></div></body></html>",
	},
	{
		element: "slot",
		html: "<body><div class=\"settings\"><slot name=\"settings-ui\"><p>A UX Dream</p></slot> </div><h4>Hmm!</h4></body>",
	},
	{
		element: "style",
		html: "<html lang=\"en-US\"><head><style>div { color: #FF00FF}</style></head><div>Bongo</div></html>",
	},
	{
		element: "svg",
		html: "<body><p>Here's one of our icons, simplified:<svg>\n <circle\n key=\"5\" className=\"path\" fill=\"none\" " +
			"strokeWidth=\"6\" strokeLinecap=\"round\" cx=\"33\"\n</svg></p><div>A div</div></body>",
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
		html: "<!DOCTYPE html><html lang=\"en-US\">\n <head>\n<title>News and gossip</title>\n </head><p>A paragraph</p></html>",
	},
];

describe.each( samplesWithOneOccurrence )( "Tests HTML elements, part 1 ", ( htmlElement ) => {
	it( "tests HTML samples where the element occurs only once", () => {
		const tree = adapt( parseFragment( htmlElement.html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 0 );
	} );
} );

// In this object the excluded HTML elements occur twice in the given HTML sample.
// Also, each sample includes at least 2 types of html elements, in order to resemble more closely a real-life tree ⍋.
const samplesWithTwoOccurrences = [
	{
		element: "code",
		html: "<h2>A heading</h2><p>We expect <code>filteredTree.findAll()</code> to <code>toHaveLength()</code> of zero.</p>",
	},
	{
		element: "kbd",
		html: "<h4>Press <kbd>Command</kbd> <kbd>Z</kbd> to undo your previous action.</h4><p>And now what?</p>",
	},
	{
		element: "meta",
		html: "<body><p>\n<meta name=\"bongobong\"><meta content=\"url=https://yoast.com\" /></p><h3>Here comes Bongo</h3></body>",
	},
	{
		element: "var",
		html: "<!DOCTYPE html>\n<html lang=\"en-US\">\n<body><p>If a triangle has one <var>90</var> degrees angle and one <var>30</var>" +
			"degrees angle, how big is the remaining angle?</p><p>Fun for the whole family</p></body></html>",
	},
];

describe.each( samplesWithTwoOccurrences )( "Tests HTML elements, part 2", ( htmlElement ) => {
	it( "tests HTML samples where the element occurs twice", () => {
		const tree = adapt( parseFragment( htmlElement.html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 2 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === htmlElement.element ) ).toHaveLength( 0 );
	} );
} );

describe( "Miscellaneous tests", () => {
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

	it( "should filter elements like <strong> when nested within a regular element, which is nested in an excluded element", () => {
		const html = "<p><samp>Welcome to the blue screen of<span>Argh!<strong>death</strong></span>.<br>Kiss your computer goodbye.</samp></p>";

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

	it( "should not recognize a Yoast block that has a wrong data-type attribute", () => {
		const html = "<!DOCTYPE html><html lang=\"en-US\"><body><p>Mmm whatcha say</p><div tabindex=\"0\" id=\"block-f1d3baad-" +
			"2b41-4a49-b57c-df3b83227d88\" role=\"document\" aria-label=\"Block: " +
			"Yoast Siblings\" data-block=\"f1d3baad-2b41-4a49-b57c-df3b83227d88\" data-type=\"yoast-seo/nonsense\" " +
			"data-title=\"Yoast Siblings\" class=\"block-editor-block-list__block wp-block is-selected\"></div></body></html>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.attributes && child.attributes[ "data-type" ] === "yoast-seo/siblings" ) ).toHaveLength( 0 );
	} );

	it( "should filter the whole <div> element containing the Estimated reading time, including the nested paragraph with the class name", () => {
		const html = "<html lang=\"en-US\"><body><div tabindex=\"0\" id=\"block-62462faa-6047-481b-b3fc-8603369c08f6\" role=\"document\" " +
			"aria-label=\"Block: Yoast Estimated Reading Time\" data-block=\"62462faa-6047-481b-b3fc-8603369c08f6\" " +
			"data-type=\"yoast-seo/estimated-reading-time\" data-title=\"Yoast Estimated Reading Time\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"><div><p class=\"yoast-reading-time" +
			"__wrapper\"><span class=\"yoast-reading-time__icon\"><svg aria-hidden=\"true\" focusable=\"false\" " +
			"data-icon=\"clock\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" role=\"img\"> " +
			"</svg><span class=\"yoast-reading-time__descriptive-text\">Estimated reading time:  </span></p></div></div>" +
			"<h2>A Heading</h2></body></html>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		// eslint-disable-next-line max-len
		expect( tree.findAll( child => child.attributes && child.attributes.class && child.attributes.class.has( "yoast-reading-time__wrapper" ) ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		// eslint-disable-next-line max-len
		expect( filteredTree.findAll( child => child.attributes && child.attributes.class && child.attributes.class.has( "yoast-reading-time__wrapper" ) ) ).toHaveLength( 0 );
	} );
} );

describe( "Tests filtered trees of a few Yoast blocks and of a made-up Yoast block", () => {
	it( "tests filtered tree of Yoast Breadcrumbs block", () => {
		const html = "<div tabindex=\"0\" id=\"block-ba03f640-2b86-4e6f-9e98-efc657db729b\" role=\"document\" aria-label=\"Block: " +
		"Yoast Breadcrumbs\" data-block=\"ba03f640-2b86-4e6f-9e98-efc657db729b\" data-type=\"yoast-seo/breadcrumbs\" " +
		"data-title=\"Yoast Breadcrumbs\" class=\"block-editor-block-list__block wp-block is-selected\" " +
		"style=\"transform-origin: center center; transform: translate3d(0px, -1px, 0px);\"></div><div>Hello world!</div>";

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
							startOffset: 387,
							endOffset: 399,
						},
					},
				],
				sourceCodeLocation: {
					startOffset: 382,
					endOffset: 405,
					startTag: {
						startOffset: 382,
						endOffset: 387,
					},
					endTag: {
						startOffset: 399,
						endOffset: 405,
					},
				},
			} ],
		} );
	} );

	it( "tests filtered tree of Yoast Table of Contents block", () => {
		const html = "<div tabindex=\"0\" id=\"block-0d6afe90-788b-4cf6-91d9-f3f9f0c122ec\" role=\"document\" " +
			"aria-label=\"Block: Yoast Table of Contents\" data-block=\"0d6afe90-788b-4cf6-91d9-f3f9f0c122ec\" " +
			"data-type=\"yoast-seo/table-of-contents\" data-title=\"Yoast Table of Contents\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"><div class=\"yoast-table-of-contents\">" +
			"<h2 role=\"textbox\" aria-multiline=\"true\" contenteditable=\"true\" class=\"block-editor-rich-text" +
			"__editable rich-text\" style=\"white-space: pre-wrap; min-width: 1px;\">Table of contents</h2><ul></ul>" +
			"</div></div><div>A div</div>";

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
						startOffset: 560,
						endOffset: 565,
					},
				} ],
				sourceCodeLocation: {
					startOffset: 555,
					endOffset: 571,
					startTag: {
						startOffset: 555,
						endOffset: 560,
					},
					endTag: {
						startOffset: 565,
						endOffset: 571,
					},
				},
			} ],
		} );
	} );

	it( "tests filtered tree of Yoast Estimated reading time block", () => {
		const html = "<div tabindex=\"0\" id=\"block-62462faa-6047-481b-b3fc-8603369c08f6\" role=\"document\" " +
			"aria-label=\"Block: Yoast Estimated Reading Time\" data-block=\"62462faa-6047-481b-b3fc-8603369c08f6\" " +
			"data-type=\"yoast-seo/estimated-reading-time\" data-title=\"Yoast Estimated Reading Time\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"><div><p class=\"yoast-reading-time" +
			"__wrapper\"><span class=\"yoast-reading-time__icon\"><span class=\"yoast-reading-time__descriptive-text\"> " +
			"Estimated reading time:  </span></p></div></div><div>A div</div>";

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
						startOffset: 516,
						endOffset: 521,
					},
				} ],
				sourceCodeLocation: {
					startOffset: 511,
					endOffset: 527,
					startTag: {
						startOffset: 511,
						endOffset: 516,
					},
					endTag: {
						startOffset: 521,
						endOffset: 527,
					},
				},
			} ],
		} );
	} );

	it( "should correctly filter a tree when a custom filter is provided.", function() {
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
} );
