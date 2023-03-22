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
			attributes: {},
			childNodes: [ {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "A div",
					} ],
					isImplicit: true,
					name: "p",
					sentences: [],
				} ],
				name: "div",
			} ],
			name: "#document-fragment" }
		);
	} );
	it( "should filter yoast estimated reading time block", () => {
		const html = "<p class='yoast-reading-time__wrapper'></p>" +
			"<div>A div</div>";

		const tree = build( html, languageProcessor );

		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			attributes: {},
			childNodes: [ {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "A div",
					} ],
					isImplicit: true,
					name: "p",
					sentences: [],
				} ],
				name: "div",
			} ],
			name: "#document-fragment",
		}
		);
	} );

	it( "should filter yoast breadcrumbs block", () => {
		const html = "<div class=\"yoast-breadcrumbs\"><span><span><a href=\"http://wordpress.test/\">Home</a></span></span></div>" +
			"<div>Hello world!</div>";

		const tree = build( html, languageProcessor );

		const filteredTree = filterTree( tree, permanentFilters );

		expect( filteredTree ).toEqual( {
			attributes: {},
			childNodes: [ {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "Hello world!",
					} ],
					isImplicit: true,
					name: "p",
					sentences: [],
				} ],
				name: "div",
			} ],
			name: "#document-fragment",
		}
		);
	} );

	it( "should correctly filter when a custom filter is provided.", function() {
		const html = "<div nonsensical_attriute='blah'></div><div>Hello world!</div>";
		const tree = build( html, languageProcessor );

		const filteredTree = filterTree( tree, [ ( elem ) => {
			return elem.name === "div" && elem.attributes.nonsensical_attriute && elem.attributes.nonsensical_attriute === "blah";
		} ] );

		expect( filteredTree ).toEqual(  {
			attributes: {},
			childNodes: [ {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						name: "#text",
						value: "Hello world!",
					} ],
					isImplicit: true,
					name: "p",
					sentences: [],
				} ],
				name: "div",
			} ],
			name: "#document-fragment",
		}
		);
	} );
} );
