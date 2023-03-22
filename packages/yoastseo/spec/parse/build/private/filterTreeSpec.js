import filterTree from "../../../../src/parse/build/private/filterTree";
import build from "../../../../src/parse/build/build";
import LanguageProcessor from "../../../../src/parse/language/LanguageProcessor";
import Factory from "../../../specHelpers/factory";
import permanentFilters from "../../../../src/parse/build/private/alwaysFilterElements";


describe( "A test for filterTree", () => {
	let languageProcessor;

	beforeEach( () => {
		const researcher = Factory.buildMockResearcher( {} );
		languageProcessor = new LanguageProcessor( researcher );
	} );

	it( "should filter script elements", () => {
		const html = "<script>console.log(\"Hello, world!\")</script><div>A div</div>";

		const tree = build( html, languageProcessor );
		expect( tree.findAll( child => child.name === "script" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "script" ) ).toHaveLength( 0 );
	} );

	it( "should filter style elements", () => {
		const html = "<style>div { color: #FF00FF}</style><div>A div</div>";

		const tree = build( html, languageProcessor );
		expect( tree.findAll( child => child.name === "style" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "style" ) ).toHaveLength( 0 );
	} );

	it( "should filter style elements", () => {
		const html = "<blockquote cite=\"http://www.worldwildlife.org/who/index.html\">\n" +
			"For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, " +
			"WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.\n" +
			"</blockquote><div>A div</div>";

		const tree = build( html, languageProcessor );
		expect( tree.findAll( child => child.name === "blockquote" ) ).toHaveLength( 1 );
		const filteredTree = filterTree( tree, permanentFilters );
		expect( filteredTree.findAll( child => child.name === "blockquote" ) ).toHaveLength( 0 );
	} );

	it( "should filter yoast table of contents block", () => {
		const html = "<div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'>Hey, this is a table of contents.</div>" +
			"<div>A div</div>";

		const tree = build( html, languageProcessor );
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
					sentences: [],
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

		const tree = build( html, languageProcessor );
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
					sentences: [],
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

	it( "should filter yoast breadcrumbs block", () => {
		const html = "<div class=\"yoast-breadcrumbs\"><span><span><a href=\"http://wordpress.test/\">Home</a></span></span></div>" +
			"<div>Hello world!</div>";

		const tree = build( html, languageProcessor );
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
						sentences: [],
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

	it( "should correctly filter when a custom filter is provided.", function() {
		const html = "<div data-test='blah'></div><div>Hello world!</div>";

		const tree = build( html, languageProcessor );
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
						sentences: [],
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
