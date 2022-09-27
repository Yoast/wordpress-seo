import buildTree from "../../../../../src/parsedPaper/build/tree/metadata/buildTree";
import Paper from "../../../../../src/values/Paper";

/**
 * Tries to find the a child with the given type in a tree.
 *
 * Helper function for these tests.
 *
 * @param {Object} tree The tree.
 * @param {string} type The type of the child.
 *
 * @returns {*} The found child or undefined when not found.
 */
const findByType = ( tree, type ) => tree.children.find( child => child.type === type );

describe( "build metadata tree", () => {
	it( "can build a metadata tree from a paper", () => {
		const paper = new Paper( "", {} );
		const tree = buildTree( paper );
		const expected = {
			type: "StructuredNode",
			tag: "metadata",
			children: [
				{
					type: "title",
					textContainer: {
						text: "",
					},
				},
				{
					type: "description",
					textContainer: {
						text: "",
					},
				},
				{
					type: "keyphrase",
					_data: "",
				},
				{
					type: "synonyms",
					_data: [],
				},
				{
					type: "slug",
					_data: "",
				},
				{
					type: "titleWidth",
					_data: 0,
				},
				{
					type: "permalink",
					_data: "",
				},
				{
					type: "locale",
					_data: "en_US",
				},
			],
		};

		expect( tree.type ).toEqual( expected.type );
		expect( tree.tag ).toEqual( expected.tag );
		expect( tree.children.length ).not.toBe( 0 );

		// Check if the expected types.
		const childTypes = tree.children.map( child => child.type );
		const expectedChildTypes = expected.children.map( child => child.type );
		expect( childTypes ).toEqual( expect.arrayContaining( expectedChildTypes ) );

		// Check the default data.
		tree.children.forEach( child => {
			switch ( child.type ) {
				case "synonyms":
					expect( child._data ).toBeDefined();
					expect( child._data ).toEqual( [] );
					break;
				case "titleWidth":
					expect( child._data ).toBeDefined();
					expect( child._data ).toBe( 0 );
					break;
				case "title":
					expect( child.textContainer ).toBeDefined();
					expect( child.textContainer.text ).toBe( "" );
					break;
				case "description":
					expect( child.textContainer ).toBeDefined();
					expect( child.textContainer.text ).toBe( "" );
					break;
				case "locale":
					expect( child._data ).toBeDefined();
					expect( child._data ).toBe( "en_US" );
					break;
				default:
					expect( child._data ).toBeDefined();
					expect( child._data ).toBe( "" );
			}
		} );
	} );

	it( "processes the title", () => {
		const paper = new Paper( "", { title: "This is a title" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "title" );

		expect( child ).toBeDefined();
		expect( child.textContainer.text ).toBe( "This is a title" );
	} );

	it( "processes the description", () => {
		const paper = new Paper( "", { description: "This is a description" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "description" );

		expect( child ).toBeDefined();
		expect( child.textContainer.text ).toBe( "This is a description" );
	} );

	it( "processes the keyphrase", () => {
		const paper = new Paper( "", { keyword: "Apples and oranges" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "keyphrase" );

		expect( child ).toBeDefined();
		expect( child._data ).toBe( "Apples and oranges" );
	} );

	it( "processes the synonyms", () => {
		const paper = new Paper( "", { synonyms: "Pears and grapefruit, Bananas and kiwis" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "synonyms" );

		expect( child ).toBeDefined();
		expect( child._data ).toEqual( [ "Pears and grapefruit", "Bananas and kiwis" ] );
	} );

	it( "processes the slug", () => {
		const paper = new Paper( "", { slug: "awesome-post" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "slug" );

		expect( child ).toBeDefined();
		expect( child._data ).toBe( "awesome-post" );
	} );

	it( "processes the titleWidth", () => {
		const paper = new Paper( "", { titleWidth: 389 } );
		const tree = buildTree( paper );
		const child = findByType( tree, "titleWidth" );

		expect( child ).toBeDefined();
		expect( child._data ).toBe( 389 );
	} );

	it( "processes the permalink", () => {
		const paper = new Paper( "", { permalink: "https://yoast.com/awesome-post" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "permalink" );

		expect( child ).toBeDefined();
		expect( child._data ).toBe( "https://yoast.com/awesome-post" );
	} );

	it( "processes the locale", () => {
		const paper = new Paper( "", { locale: "nl_NL" } );
		const tree = buildTree( paper );
		const child = findByType( tree, "locale" );

		expect( child ).toBeDefined();
		expect( child._data ).toBe( "nl_NL" );
	} );
} );
