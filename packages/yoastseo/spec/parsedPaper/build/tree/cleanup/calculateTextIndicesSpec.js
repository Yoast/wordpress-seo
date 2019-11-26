import TreeAdapter from "../../../../../src/parsedPaper/build/tree/html/TreeAdapter";
import calculateTextIndices from "../../../../../src/parsedPaper/build/tree/cleanup/calculateTextIndices";
import { parseFragment } from "parse5";

describe( "calculateTextIndices", () => {
	it( "does nothing if the input node has no formatting", () => {
		const source = "<p>This is a paragraph</p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		expect( element.textContainer.formatting ).toEqual( [] );
	} );

	it( "adds textStartIndex and textEndIndex to the formatting of a paragraph", () => {
		const source = "<p>This is a <b>paragraph</b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElement = element.textContainer.formatting[ 0 ];

		expect( formattingElement.type ).toEqual( "b" );
		expect( formattingElement.textStartIndex ).toEqual( 10 );
		expect( formattingElement.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes nested formatting elements", () => {
		const source = "<p>This is a <b><em>paragraph</em></b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementBold = element.textContainer.formatting[ 0 ];
		const formattingElementItalics = element.textContainer.formatting[ 1 ];

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementItalics.type ).toEqual( "em" );
		expect( formattingElementItalics.textStartIndex ).toEqual( 10 );
		expect( formattingElementItalics.textEndIndex ).toEqual( 19 );
	} );

	it( "does not get confused by empty formatting elements", () => {
		const source = "<p>This is a <em></em><b><em>paragraph</em></b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementItalicsEmpty = element.textContainer.formatting[ 0 ];
		const formattingElementBold = element.textContainer.formatting[ 1 ];
		const formattingElementItalicsMeaningful = element.textContainer.formatting[ 2 ];

		expect( formattingElementItalicsEmpty.type ).toEqual( "em" );
		expect( formattingElementItalicsEmpty.textStartIndex ).toEqual( 10 );
		expect( formattingElementItalicsEmpty.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementItalicsMeaningful.type ).toEqual( "em" );
		expect( formattingElementItalicsMeaningful.textStartIndex ).toEqual( 10 );
		expect( formattingElementItalicsMeaningful.textEndIndex ).toEqual( 19 );
	} );

	it( "does not get confused by empty nested formatting elements", () => {
		const source = "<p>This is a <b><em></em><em>paragraph</em></b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementBold = element.textContainer.formatting[ 0 ];
		const formattingElementItalicsEmpty = element.textContainer.formatting[ 1 ];
		const formattingElementItalicsNonEmpty = element.textContainer.formatting[ 2 ];

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementItalicsEmpty.type ).toEqual( "em" );
		expect( formattingElementItalicsEmpty.textStartIndex ).toEqual( 10 );
		expect( formattingElementItalicsEmpty.textEndIndex ).toEqual( 10 );

		expect( formattingElementItalicsNonEmpty.type ).toEqual( "em" );
		expect( formattingElementItalicsNonEmpty.textStartIndex ).toEqual( 10 );
		expect( formattingElementItalicsNonEmpty.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes ignored formatting elements", () => {
		const source = "<p>This is a <script>script</script><b>paragraph</b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementScript = element.textContainer.formatting[ 0 ];
		const formattingElementBold = element.textContainer.formatting[ 1 ];

		expect( formattingElementScript.type ).toEqual( "Ignored" );
		expect( formattingElementScript.textStartIndex ).toEqual( 10 );
		expect( formattingElementScript.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes ignored formatting elements nested in other formatting elements", () => {
		const source = "<p>This is a <b><script>script</script>paragraph</b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementBold = element.textContainer.formatting[ 0 ];
		const formattingElementScript = element.textContainer.formatting[ 1 ];

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementScript.type ).toEqual( "Ignored" );
		expect( formattingElementScript.textStartIndex ).toEqual( 10 );
		expect( formattingElementScript.textEndIndex ).toEqual( 10 );
	} );

	it( "correctly processes comments", () => {
		const source = "<p>This is a <!--Here is a comment!-->paragraph</p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElement = element.textContainer.formatting[ 0 ];

		expect( formattingElement.type ).toEqual( "Ignored" );
		expect( formattingElement.textStartIndex ).toEqual( 10 );
		expect( formattingElement.textEndIndex ).toEqual( 10 );
	} );

	it( "correctly processes self-closing elements", () => {
		const source = "<p>This is a <img src=\"example.jpg\" alt=\"An awesome example\">paragraph</p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElement = element.textContainer.formatting[ 0 ];

		expect( formattingElement.type ).toEqual( "img" );
		expect( formattingElement.textStartIndex ).toEqual( 10 );
		expect( formattingElement.textEndIndex ).toEqual( 10 );
	} );
} );

describe.skip( "These tests are currently broken, will be fixed in https://github.com/Yoast/javascript/issues/409", () => {
	it( "correctly processes comments before another tag", () => {
		const source = "<p>This is a <!--Here is a comment!--><b>paragraph</b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementComment = element.textContainer.formatting[ 0 ];
		const formattingElementBold = element.textContainer.formatting[ 1 ];


		expect( formattingElementComment.type ).toEqual( "Ignored" );
		expect( formattingElementComment.textStartIndex ).toEqual( 10 );
		expect( formattingElementComment.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes comments when embedded in other formatting elements", () => {
		const source = "<p>This is a <b><!--Here is a comment!-->paragraph</b></p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementComment = element.textContainer.formatting[ 0 ];
		const formattingElementBold = element.textContainer.formatting[ 1 ];


		expect( formattingElementComment.type ).toEqual( "Ignored" );
		expect( formattingElementComment.textStartIndex ).toEqual( 10 );
		expect( formattingElementComment.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes multiple comments", () => {
		const source = "<p>This is a <!--Here is a comment!--><b>paragraph</b><!--Here is another comment!--> with <em>some text</em>.</p>";

		const treeAdapter = new TreeAdapter();
		const tree = parseFragment( source, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );

		// Define the paragraph element that we will use in this test.
		const element = tree.children[ 0 ];

		calculateTextIndices( element, source );

		const formattingElementFirstComment = element.textContainer.formatting[ 0 ];
		const formattingElementBold = element.textContainer.formatting[ 1 ];
		const formattingElementSecondComment = element.textContainer.formatting[ 2 ];
		const formattingElementItalics = element.textContainer.formatting[ 3 ];

		expect( formattingElementFirstComment.type ).toEqual( "Ignored" );
		expect( formattingElementFirstComment.textStartIndex ).toEqual( 10 );
		expect( formattingElementFirstComment.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementSecondComment.type ).toEqual( "Ignored" );
		expect( formattingElementSecondComment.textStartIndex ).toEqual( 19 );
		expect( formattingElementSecondComment.textEndIndex ).toEqual( 19 );

		expect( formattingElementItalics.type ).toEqual( "em" );
		expect( formattingElementItalics.textStartIndex ).toEqual( 25 );
		expect( formattingElementItalics.textEndIndex ).toEqual( 33 );
	} );
} );
