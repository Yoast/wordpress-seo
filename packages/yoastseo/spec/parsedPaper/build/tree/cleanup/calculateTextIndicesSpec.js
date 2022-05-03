import calculateTextIndices from "../../../../../src/parsedPaper/build/tree/cleanup/calculateTextIndices";
import buildTreeFromYaml from "../../../../specHelpers/buildTreeFromYaml";

describe( "calculateTextIndices", () => {
	it( "does nothing if the input node has no formatting", () => {
		// "<p>This is a paragraph</p>"
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 29
      endOffset: 33
    startOffset: 0
    endOffset: 33
    text: This is a paragraph
		`;

		const paragraph = buildTreeFromYaml( yaml );

		calculateTextIndices( paragraph );

		expect( paragraph.textContainer.formatting ).toEqual( [] );
	} );

	it( "adds textStartIndex and textEndIndex to the formatting of a paragraph", () => {
		// "<p>This is a <b>paragraph</b></p>"
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 29
      endOffset: 33
    startOffset: 0
    endOffset: 33
  text: This is a paragraph
  formatting:
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 16
          endTag:
            startOffset: 25
            endOffset: 29
          startOffset: 13
          endOffset: 29
		`;

		const paragraph = buildTreeFromYaml( yaml );

		calculateTextIndices( paragraph );

		const formattingElement = paragraph.textContainer.formatting[ 0 ];

		expect( formattingElement.type ).toEqual( "b" );
		expect( formattingElement.textStartIndex ).toEqual( 10 );
		expect( formattingElement.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes nested formatting elements", () => {
		// "<p>This is a <b><em>paragraph</em></b></p>"
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 38
      endOffset: 42
    startOffset: 0
    endOffset: 42
  text: This is a paragraph
  formatting:
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 16
          endTag:
            startOffset: 34
            endOffset: 38
          startOffset: 13
          endOffset: 38
    - em:
        sourceCodeLocation:
          startTag:
            startOffset: 16
            endOffset: 20
          endTag:
            startOffset: 29
            endOffset: 34
          startOffset: 16
          endOffset: 34
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementBold = paragraph.textContainer.formatting[ 0 ];
		const formattingElementItalics = paragraph.textContainer.formatting[ 1 ];

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementItalics.type ).toEqual( "em" );
		expect( formattingElementItalics.textStartIndex ).toEqual( 10 );
		expect( formattingElementItalics.textEndIndex ).toEqual( 19 );
	} );

	it( "does not get confused by empty formatting elements", () => {
		// "<p>This is a <em></em><b><em>paragraph</em></b></p>"
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 47
      endOffset: 51
    startOffset: 0
    endOffset: 51
  text: This is a paragraph
  formatting:
    - em:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 17
          endTag:
            startOffset: 17
            endOffset: 22
          startOffset: 13
          endOffset: 22
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 22
            endOffset: 25
          endTag:
            startOffset: 43
            endOffset: 47
          startOffset: 22
          endOffset: 47
    - em:
        sourceCodeLocation:
          startTag:
            startOffset: 25
            endOffset: 29
          endTag:
            startOffset: 38
            endOffset: 43
          startOffset: 25
          endOffset: 43
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementItalicsEmpty = paragraph.textContainer.formatting[ 0 ];
		const formattingElementBold = paragraph.textContainer.formatting[ 1 ];
		const formattingElementItalicsMeaningful = paragraph.textContainer.formatting[ 2 ];

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
		// "<p>This is a <b><em></em><em>paragraph</em></b></p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 47
      endOffset: 51
    startOffset: 0
    endOffset: 51
  text: This is a paragraph
  formatting:
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 16
          endTag:
            startOffset: 43
            endOffset: 47
          startOffset: 13
          endOffset: 47
    - em:
        sourceCodeLocation:
          startTag:
            startOffset: 16
            endOffset: 20
          endTag:
            startOffset: 20
            endOffset: 25
          startOffset: 16
          endOffset: 25
    - em:
        sourceCodeLocation:
          startTag:
            startOffset: 25
            endOffset: 29
          endTag:
            startOffset: 38
            endOffset: 43
          startOffset: 25
          endOffset: 43
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementBold = paragraph.textContainer.formatting[ 0 ];
		const formattingElementItalicsEmpty = paragraph.textContainer.formatting[ 1 ];
		const formattingElementItalicsNonEmpty = paragraph.textContainer.formatting[ 2 ];

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
		// "<p>This is a <script>script</script><b>paragraph</b></p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 52
      endOffset: 56
    startOffset: 0
    endOffset: 56
  text: This is a paragraph
  formatting:
    - script:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 21
          endTag:
            startOffset: 27
            endOffset: 36
          startOffset: 13
          endOffset: 36
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 36
            endOffset: 39
          endTag:
            startOffset: 48
            endOffset: 52
          startOffset: 36
          endOffset: 52
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementScript = paragraph.textContainer.formatting[ 0 ];
		const formattingElementBold = paragraph.textContainer.formatting[ 1 ];

		expect( formattingElementScript.type ).toEqual( "script" );
		expect( formattingElementScript.textStartIndex ).toEqual( 10 );
		expect( formattingElementScript.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes ignored formatting elements nested in other formatting elements", () => {
		// "<p>This is a <b><script>script</script>paragraph</b></p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 52
      endOffset: 56
    startOffset: 0
    endOffset: 56
  text: This is a paragraph
  formatting:
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 16
          endTag:
            startOffset: 48
            endOffset: 52
          startOffset: 13
          endOffset: 52
    - script:
        sourceCodeLocation:
          startTag:
            startOffset: 16
            endOffset: 24
          endTag:
            startOffset: 30
            endOffset: 39
          startOffset: 16
          endOffset: 39
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementBold = paragraph.textContainer.formatting[ 0 ];
		const formattingElementScript = paragraph.textContainer.formatting[ 1 ];

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementScript.type ).toEqual( "script" );
		expect( formattingElementScript.textStartIndex ).toEqual( 10 );
		expect( formattingElementScript.textEndIndex ).toEqual( 10 );
	} );

	it( "correctly processes comments", () => {
		// "<p>This is a <!--Here is a comment!-->paragraph</p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 47
      endOffset: 51
    startOffset: 0
    endOffset: 51
  text: This is a paragraph
  formatting:
    - "#comment":
        sourceCodeLocation:
          startOffset: 13
          endOffset: 38
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElement = paragraph.textContainer.formatting[ 0 ];

		expect( formattingElement.type ).toEqual( "#comment" );
		expect( formattingElement.textStartIndex ).toEqual( 10 );
		expect( formattingElement.textEndIndex ).toEqual( 10 );
	} );

	it( "correctly processes self-closing elements", () => {
		// "<p>This is a <img src=\"example.jpg\" alt=\"An awesome example\">paragraph</p>"
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 70
      endOffset: 74
    startOffset: 0
    endOffset: 74
  text: This is a paragraph
  formatting:
    - img:
        attributes:
          src: example.jpg
          alt: An awesome example
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 61
          startOffset: 13
          endOffset: 61
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElement = paragraph.textContainer.formatting[ 0 ];

		expect( formattingElement.type ).toEqual( "img" );
		expect( formattingElement.textStartIndex ).toEqual( 10 );
		expect( formattingElement.textEndIndex ).toEqual( 10 );
	} );

	it( "correctly processes comments before another tag", () => {
		// "<p>This is a <!--Here is a comment!--><b>paragraph</b></p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 70
      endOffset: 74
    startOffset: 0
    endOffset: 74
  text: This is a paragraph
  formatting:
    - "#comment":
        sourceCodeLocation:
          startOffset: 13
          endOffset: 38
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 38
            endOffset: 41
          endTag:
            startOffset: 50
            endOffset: 54
          startOffset: 38
          endOffset: 54
		`;

		// Define the paragraph element that we will use in this test.
		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementComment = paragraph.textContainer.formatting[ 0 ];
		const formattingElementBold = paragraph.textContainer.formatting[ 1 ];

		expect( formattingElementComment.type ).toEqual( "#comment" );
		expect( formattingElementComment.textStartIndex ).toEqual( 10 );
		expect( formattingElementComment.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes comments when embedded in other formatting elements", () => {
		// "<p>This is a <b><!--Here is a comment!-->paragraph</b></p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 54
      endOffset: 78
    startOffset: 0
    endOffset: 58
  text: This is a paragraph
  formatting:
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 13
            endOffset: 16
          endTag:
            startOffset: 50
            endOffset: 54
          startOffset: 13
          endOffset: 54
    - "#comment":
        sourceCodeLocation:
          startOffset: 16
          endOffset: 41
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementComment = paragraph.textContainer.formatting[ 1 ];
		const formattingElementBold = paragraph.textContainer.formatting[ 0 ];

		expect( formattingElementComment.type ).toEqual( "#comment" );
		expect( formattingElementComment.textStartIndex ).toEqual( 10 );
		expect( formattingElementComment.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );
	} );

	it( "correctly processes multiple comments", () => {
		// "<p>This is a <!--Here is a comment!--><b>paragraph</b><!--Here is another comment!--> with <em>some text</em>.</p>";
		const yaml = `
Paragraph:
  sourceCodeLocation:
    startTag:
      startOffset: 0
      endOffset: 3
    endTag:
      startOffset: 110
      endOffset: 114
    startOffset: 0
    endOffset: 114
  text: This is a paragraph with some text.
  formatting:
    - "#comment":
        sourceCodeLocation:
          startOffset: 13
          endOffset: 38
    - b:
        sourceCodeLocation:
          startTag:
            startOffset: 38
            endOffset: 41
          endTag:
            startOffset: 50
            endOffset: 54
          startOffset: 38
          endOffset: 54
    - "#comment":
        sourceCodeLocation:
          startOffset: 54
          endOffset: 85
    - em:
        sourceCodeLocation:
          startTag:
            startOffset: 91
            endOffset: 95
          endTag:
            startOffset: 104
            endOffset: 109
          startOffset: 91
          endOffset: 109
		`;

		const paragraph = buildTreeFromYaml( yaml );
		calculateTextIndices( paragraph );

		const formattingElementFirstComment = paragraph.textContainer.formatting[ 0 ];
		const formattingElementBold = paragraph.textContainer.formatting[ 1 ];
		const formattingElementSecondComment = paragraph.textContainer.formatting[ 2 ];
		const formattingElementItalics = paragraph.textContainer.formatting[ 3 ];

		expect( formattingElementFirstComment.type ).toEqual( "#comment" );
		expect( formattingElementFirstComment.textStartIndex ).toEqual( 10 );
		expect( formattingElementFirstComment.textEndIndex ).toEqual( 10 );

		expect( formattingElementBold.type ).toEqual( "b" );
		expect( formattingElementBold.textStartIndex ).toEqual( 10 );
		expect( formattingElementBold.textEndIndex ).toEqual( 19 );

		expect( formattingElementSecondComment.type ).toEqual( "#comment" );
		expect( formattingElementSecondComment.textStartIndex ).toEqual( 19 );
		expect( formattingElementSecondComment.textEndIndex ).toEqual( 19 );

		expect( formattingElementItalics.type ).toEqual( "em" );
		expect( formattingElementItalics.textStartIndex ).toEqual( 25 );
		expect( formattingElementItalics.textEndIndex ).toEqual( 34 );
	} );
} );
