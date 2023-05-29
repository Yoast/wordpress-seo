import SourceCodeLocation from "../../../src/parse/structure/SourceCodeLocation";

describe( "A test for the SourceCodeLocation object", function() {
	it( "should correctly construct a SourceCodeLocation object", function() {
		const sourceCodeLocationInfo = {
			startTag: {
				startOffset: 1,
				endOffset: 2,
			},
			endTag: {
				startOffset: 3,
				endOffset: 4,
			},
			startOffset: 1,
			endOffset: 4,
		};

		expect( new SourceCodeLocation( sourceCodeLocationInfo ) ).toEqual( sourceCodeLocationInfo );
	} );

	it( "should correctly construct a SourceCodeLocation object with no tags present", function() {
		const sourceCodeLocationInfo = {
			startOffset: 1,
			endOffset: 4,
		};

		expect( new SourceCodeLocation( sourceCodeLocationInfo ) ).toEqual( sourceCodeLocationInfo );
	} );
} );
