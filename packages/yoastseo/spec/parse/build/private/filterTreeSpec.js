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
// 4: Miscellaneous tests, incl. one for the Elementor Breadcrumbs widget.
// 5: Tests the filtered trees of Yoast blocks and of a made-up block.

// Object containing samples of Yoast blocks we filter out from the tree.
const samplesWithYoastBlocks = [
	{
		description: "Should filter out the Table of Contents block",
		element: "yoast-table-of-contents",
		html: "<!DOCTYPE html><html class=\"wp-toolbar-interface-skeleton__html-container\" lang=\"en-US\"><body>" +
			"<!-- wp:yoast-seo/table-of-contents -->\n<div class=\"wp-block-yoast-seo-table-of-contents yoast-table-of-contents\">" +
			"<h2>Table of contents</h2><ul><li><a href=\"#h-test-subh\" data-level=\"2\">TEST subh</a></li><li><a href=\"#h-a-diff-subh\" " +
			"data-level=\"2\">A diff subh</a></li></ul></div>\n<!-- /wp:yoast-seo/table-of-contents --><p>This is the first sentence.</p>" +
			"</body></html>",
	},
	{
		description: "Should filter out the Estimated reading time block",
		element: "yoast-reading-time__wrapper",
		html: "<html lang=\"en-US\"><body>" +
			"<!-- wp:yoast-seo/estimated-reading-time {\"estimatedReadingTime\":3} -->\n" +
			"<p class=\"yoast-reading-time__wrapper\"><span class=\"yoast-reading-time__icon\"></span><span " +
			"class=\"yoast-reading-time__descriptive-text\">Estimated reading time:  </span><span class=\"yoast-reading-time__reading-time\">" +
			"3</span><span class=\"yoast-reading-time__time-unit\"> minutes</span></p>\n" +
		    "<!-- /wp:yoast-seo/estimated-reading-time -->" +
			"<h2>A Heading</h2></body></html>",
	},
	{
		description: "Should filter out the Estimated reading time block even using the raw HTML where it's encased in a div element",
		element: "yoast-reading-time__wrapper",
		html: "<html lang=\"en-US\"><body><div tabindex=\"0\" id=\"block-62462faa-6047-481b-b3fc-8603369c08f6\" role=\"document\" " +
			"aria-label=\"Block: Yoast Estimated Reading Time\" data-block=\"62462faa-6047-481b-b3fc-8603369c08f6\" " +
			"data-type=\"yoast-seo/estimated-reading-time\" data-title=\"Yoast Estimated Reading Time\" " +
			"class=\"block-editor-block-list__block wp-block is-selected\"><div><p class=\"yoast-reading-time" +
			"__wrapper\"><span class=\"yoast-reading-time__icon\"><svg aria-hidden=\"true\" focusable=\"false\" " +
			"data-icon=\"clock\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" role=\"img\"> " +
			"</svg><span class=\"yoast-reading-time__descriptive-text\">Estimated reading time:  </span></p></div></div>" +
			"<h2>A Heading</h2></body></html>",
	},
];

describe.each( samplesWithYoastBlocks )( "Tests all Yoast blocks we exclude", ( htmlElement ) => {
	it( htmlElement.description, () => {
		const tree = adapt( parseFragment( htmlElement.html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child =>
			child.attributes &&
			child.attributes.class &&
			child.attributes.class.has( htmlElement.element )
		) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child =>
			child.attributes &&
			child.attributes.class &&
			child.attributes.class.has( htmlElement.element )
		) ).toHaveLength( 0 );
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
	{
		element: "cite",
		html: "<!DOCTYPE html>\n<html lang=\"en-US\">\n<body><p>There are many craft ideas that are interesting to both children and adults." +
			" <cite>Fun for the whole family!</cite></p></body></html>",
	},
	{
		element: "output",
		html: "<!DOCTYPE html>\n<html lang=\"en-US\">\n<body><p>Armadillos <output id='x'>x</output> are cute animals.</p></body></html>",
	},
	{
		element: "samp",
		html: "<!DOCTYPE html>\n<html lang=\"en-US\">\n<body><p>The automated chat said<samp>The answer is incorrect</samp>but I wasn't " +
			"sure why.</p></body></html>",
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

// In this object, the excluded HTML elements occur twice in the given HTML sample.
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
	{
		element: "form",
		html: "<!DOCTYPE html>\n<html lang=\"en-US\">\n<body><aside><form>Pies are amazing.</form>There are many reciples.<form>So are " +
			"cakes.</form></aside></body></html>",
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
	it( "shouldn't filter out elements like <strong>, which are not included in the list of excluded elements", () => {
		const html = "<p>Welcome to the blue screen of <strong>death</strong>.</p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
	} );

	it( "shouldn't filter out elements like <strong>, which are included in the list of excluded elements", () => {
		const html = "<p>Welcome to the blue screen of <strong>death</strong>.</p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
	} );

	it( "should filter out elements like <strong> when nested within excluded elements, e.g. <samp>", () => {
		const html = "<p><samp>Welcome to the blue screen of <strong>death</strong>.<br>Kiss your computer goodbye.</samp></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 0 );
	} );

	it( "should filter out elements like <strong> when nested within a regular element, which is nested in an excluded element", () => {
		const html = "<p><samp>Welcome to the blue screen of<span>Argh!<strong>death</strong></span>.<br>Kiss your computer goodbye.</samp></p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "strong" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "strong" ) ).toHaveLength( 0 );
	} );

	it( "should filter out head elements", () => {
		// The head element seems to be removed by the parser we employ.
		const html = "<!DOCTYPE html>\n<head>\n<title>This is what dreams are made of</title>\n</head>\n</html>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "head" ) ).toHaveLength( 0 );
	} );

	it( "should filter out map elements", () => {
		// The head element seems to be removed by the parser we employ.
		const html = "<!DOCTYPE html>\n<title>About artificial intelligence<map name=>AI</map>\n</title>\n</html>";
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.name === "abbr" ) ).toHaveLength( 0 );
	} );

	it( "should filter out span elements and remove the implicit paragraph it's part of", () => {
		const html = '<span class="elementor-title elementor-inline-editing" data-elementor-setting-key="title">My cat loves me.</span>';
		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => [ "span", "p" ].includes( child.name ) ) ).toHaveLength( 0 );
	} );

	it( "should filter out the Elementor Yoast Breadcrumbs widget ", () => {
		// When the HTML enters the paper, the Breadcrumbs widget doesn't include the div tag.
		let html = "<p id=\"breadcrumbs\"><span><span><a href=\"https://basic.wordpress.test/\">Home</a></span></span></p><div " +
			"class=\"elementor-text-editor elementor-clearfix elementor-inline-editing\" data-elementor-setting-key=\"editor\"" +
			" data-elementor-inline-editing-toolbar=\"advanced\"><p>Lorem ipsum dolor sit amet</p>";
		let tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.attributes && child.attributes.id === "breadcrumbs" ) ).toHaveLength( 1 );
		let filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.attributes && child.attributes.id === "breadcrumbs" ) ).toHaveLength( 0 );

		// It should still be able to filter out the Breadcrumbs widget even when the widget is wrapped inside a div.
		html = "<div data-id=\"a2d018a\" data-element_type=\"widget\" class=\"elementor-element elementor-element-edit-" +
			"mode elementor-element-a2d018a elementor-element--toggle-edit-tools elementor-widget elementor-widget-breadcrumbs ui-resizable\" " +
			"data-model-cid=\"c2810\" id=\"\" data-widget_type=\"breadcrumbs.default\"><div class=\"elementor-element-overlay\"> " +
			"<ul class=\"elementor-editor-element-settings elementor-editor-widget-settings\"><li class=\"elementor-editor-element-setting " +
			"elementor-editor-element-edit\" title=\"Edit Breadcrumbs\"><i class=\"eicon-edit\" aria-hidden=\"true\"></i><span " +
			"class=\"elementor-screen-only\">Edit Breadcrumbs</span></li></ul></div><div class=\"elementor-widget-container\">" +
			"<p id=\"breadcrumbs\"><span><span><a href=\"https://one.wordpress.test/\">Home</a></span></span></p></div>";

		tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		expect( tree.findAll( child => child.attributes && child.attributes.id === "breadcrumbs" ) ).toHaveLength( 1 );
		filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.attributes && child.attributes.id === "breadcrumbs" ) ).toHaveLength( 0 );
	} );
} );

describe( "Tests filtered trees of a few Yoast blocks and of a made-up Yoast block", () => {
	it( "tests filtered tree of Yoast Breadcrumbs block: the next element should receive correct position information", () => {
		// Yoast Breadcrumbs block enters the Paper as html comment.
		const html = "<!-- wp:yoast-seo/breadcrumbs /-->" +
			"<!-- wp:paragraph -->\n" +
			"<p>Cats rule!. But dogs too!</p>\n" +
			"<!-- /wp:paragraph -->";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "#text",
					value: "\n",
					sourceCodeRange: { startOffset: 55, endOffset: 56 },
				},
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "Cats rule!. But dogs too!",
							sourceCodeRange: { startOffset: 59, endOffset: 84 },
						},
					],
					isImplicit: false,
					name: "p",
					sourceCodeLocation: {
						startOffset: 56,
						endOffset: 88,
						startTag: {
							startOffset: 56,
							endOffset: 59,
						},
						endTag: {
							startOffset: 84,
							endOffset: 88,
						},
					},
				},
				{
					name: "#text",
					value: "\n",
					sourceCodeRange: { startOffset: 88, endOffset: 89 },
				},
			],
		} );
	} );

	it( "tests filtered tree of Yoast Table of Contents block", () => {
		const html = "<!-- wp:yoast-seo/table-of-contents -->\n<div class=\"wp-block-yoast-seo-table-of-contents yoast-table-of-contents\">" +
			"<h2>Table of contents</h2><ul><li><a href=\"#h-test-subh\" data-level=\"2\">Subheading 1</a></li><li><a href=\"#h-a-diff-subh\" " +
			"data-level=\"2\">Subheading 2</a></li></ul></div>\n<!-- /wp:yoast-seo/table-of-contents --><p>This is the first sentence.</p>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "#text",
					value: "\n",
					sourceCodeRange: { startOffset: 39, endOffset: 40 },
				},
				{
					name: "#text",
					value: "\n",
					sourceCodeRange: { startOffset: 283, endOffset: 284 },
				},
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "This is the first sentence.",
							sourceCodeRange: { startOffset: 327, endOffset: 354 },
						},
					],
					isImplicit: false,
					name: "p",
					sourceCodeLocation: {
						startOffset: 324,
						endOffset: 358,
						startTag: {
							startOffset: 324,
							endOffset: 327,
						},
						endTag: {
							startOffset: 354,
							endOffset: 358,
						},
					},
				},
			],
		} );
	} );

	it( "tests filtered tree of Yoast Estimated reading time block", () => {
		const html = "<!-- wp:yoast-seo/estimated-reading-time {\"estimatedReadingTime\":3} -->\n" +
			"<p class=\"yoast-reading-time__wrapper\"><span class=\"yoast-reading-time__icon\"></span><span " +
			"class=\"yoast-reading-time__descriptive-text\">Estimated reading time:  </span><span class=\"yoast-reading-time__reading-time\">" +
			"3</span><span class=\"yoast-reading-time__time-unit\"> minutes</span></p>\n" +
			"<!-- /wp:yoast-seo/estimated-reading-time -->" +
			"<h2>A Heading</h2>";

		const tree = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "#text",
					value: "\n",
					sourceCodeRange: { startOffset: 71, endOffset: 72 },
				},
				{
					name: "#text",
					value: "\n",
					sourceCodeRange: { startOffset: 358, endOffset: 359 },
				},
				{
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "A Heading",
							sourceCodeRange: { startOffset: 408, endOffset: 417 },
						},
					],
					level: 2,
					name: "h2",
					sourceCodeLocation: {
						startOffset: 404,
						endOffset: 422,
						startTag: {
							startOffset: 404,
							endOffset: 408,
						},
						endTag: {
							startOffset: 417,
							endOffset: 422,
						},
					},
				},
			],
		} );
	} );

	it( "should correctly filter out a tree when a custom filter out is provided.", function() {
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
								sourceCodeRange: { startOffset: 33, endOffset: 45 },
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
