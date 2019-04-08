describe( "PaperParser", () => {
	describe( "constructor", () => {
		it( "makes a new ParsedPaper", () => {
			const paperParser = new PaperParser();
			expect( paperParser ).toBeInstanceOf( PaperParser );
		} );
	} );

	describe( "parse", () => {
		it( "calls the build function of a TreeBuilder to parse the Paper's text", () => {
			const paperParser = new PaperParser();
			const TestPaper = new Paper(); // Is this even a class? Old Javascript.
			paperParser.parse( TestPaper );
			expect( TreeBuilder.build ).toHaveBeenCalledWith( Paper.text ); // Find out how this works.
		} );
	} );
} );
