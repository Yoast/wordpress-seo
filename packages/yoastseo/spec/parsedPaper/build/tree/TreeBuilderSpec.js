import TreeBuilder from "../../../../src/parsedPaper/build/tree";


describe( "TreeBuilder", () => {
	let treeBuilder;

	beforeEach( () => {
		treeBuilder = new TreeBuilder();
	} );

	it( "registers a build function for a new language", () => {
		// Create a new mock build function.
		const myBuilder = jest.fn();

		// Register the build function for the language "my-language".
		treeBuilder.register( "my-language", myBuilder );

		// Build the tree using the registered builder.
		treeBuilder.build( "some input", { language: "my-language" } );

		expect( myBuilder ).toBeCalled();
	} );

	it( "defaults to the default options when build is called with no options given", () => {
		// Mock the default HTML builder.
		const htmlMockBuilder = jest.fn();
		treeBuilder._buildFunctions.html = htmlMockBuilder;

		// Defaults to the HTML parser.
		treeBuilder.build( "<p>A paragraph</p>" );

		expect( htmlMockBuilder ).toBeCalled();
	} );
} );
