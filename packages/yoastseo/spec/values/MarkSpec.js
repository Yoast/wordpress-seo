import Mark from "../../src/values/Mark";

describe( "a mark value object", function() {
	it( "should have default properties", function() {
		const mark = new Mark( {} );

		expect( mark.getOriginal() ).toBe( "" );
		expect( mark.getMarked() ).toBe( "" );
	} );

	it( "should allow new value via the constructor", function() {
		const mark = new Mark( { original: "original", marked: "marked", fieldsToMark: [ "heading" ] } );

		expect( mark.getOriginal() ).toBe( "original" );
		expect( mark.getMarked() ).toBe( "marked" );
		expect( mark.getFieldsToMark() ).toEqual( [ "heading" ] );
	} );

	describe( "replacement-based application", function() {
		it( "should be able to apply itself by replacing text", function() {
			const mark = new Mark( { original: "original", marked: "marked" } );
			const text = "original";
			const expected = "marked";

			expect( mark.applyWithReplace( text ) ).toBe( expected );
		} );

		it( "should apply to all occurrences", function() {
			const mark = new Mark( { original: "original", marked: "marked" } );
			const text = "original original original original original original original";
			const expected = "marked marked marked marked marked marked marked";

			expect( mark.applyWithReplace( text ) ).toBe( expected );
		} );
	} );

	describe( "position-based application", function() {
		it( "should return the position property of the Mark", () => {
			const mark = new Mark( { position: { startOffset: 3, endOffset: 28 } } );
			expect( mark.getPosition() ).toEqual( { startOffset: 3, endOffset: 28 } );
		} );
		it( "should return the start and end offset of the position set via the constructor", () => {
			const mark = new Mark( { position: { startOffset: 3, endOffset: 28 } } );
			expect( mark.getPositionStart() ).toBe( 3 );
			expect( mark.getPositionEnd() ).toBe( 28 );
		} );
		it( "should override the current value of start offset when `setPositionStart` is called", () => {
			const mark = new Mark( { position: { startOffset: 3, endOffset: 28 } } );
			mark.setPositionStart( 0 );
			expect( mark.getPositionStart() ).toBe( 0 );
		} );
		it( "should override the current value of end offset when `setPositionEnd` is called", () => {
			const mark = new Mark( { position: { startOffset: 3, endOffset: 28 } } );
			mark.setPositionEnd( 25 );
			expect( mark.getPositionEnd() ).toBe( 25 );
		} );
		it( "should return falsy for the start and end offset of the position when the position is not set via the constructor", () => {
			const mark = new Mark( { original: "original", marked: "marked" } );
			expect( mark.getPositionStart() ).toBeFalsy();
			expect( mark.getPositionEnd() ).toBeFalsy();
		} );
		it( "should be able to apply itself by replacing at given positions", function() {
			const mark = new Mark( { position: { startOffset: 3, endOffset: 28 } } );
			const text = "<p>Hello <span>World!</span></p>";
			const expected = "<p><yoastmark class='yoast-text-mark'>Hello <span>World!</span></yoastmark></p>";

			expect( mark.applyWithPosition( text ) ).toBe( expected );
		} );
	} );

	describe( "tests the isValid method of Mark", function() {
		it( "should throw an error if the start position is smaller than 0", function() {
			expect( () => new Mark( { position: { startOffset: -1 } } ) ).toThrow( RangeError );
		} );

		it( "should throw an error if the end position is 0", function() {
			expect( () => new Mark( { position: { endOffset: 0, startOffset: 10 } } ) ).toThrow( RangeError );
		} );

		it( "should throw an error if the end position is smaller than 0", function() {
			expect( () => new Mark( { position: { endOffset: -1, startOffset: 10 } } ) ).toThrow( RangeError );
		} );

		it( "should throw an error if the end position is smaller than the start position", function() {
			expect( () => new Mark( { position: { startOffset: 10, endOffset: 9 } } ) ).toThrow( RangeError );
		} );

		it( "should throw an error if the end position is equal to the start position", function() {
			expect( () => new Mark( { position: { startOffset: 10, endOffset: 10 } } ) ).toThrow( RangeError );
		} );

		it( "should throw an error if only the start offset is defined", function() {
			expect( () => new Mark( { position: { startOffset: 10 } } ) ).toThrow( Error );
		} );

		it( "should throw an error if only the end offset is defined", function() {
			expect( () => new Mark( { position: { endOffset: 10 } } ) ).toThrow( Error );
		} );
	} );

	describe( "tests the hasPosition", function() {
		it( "should return true if there is a position start", function() {
			const mark = new Mark( { position: { startOffset: 42, endOffset: 52 } } );
			expect( mark.hasPosition() ).toBeTruthy();
		} );
		it( "should return true if the position start is 0", function() {
			const mark = new Mark( { position: { startOffset: 0, endOffset: 52 } } );
			expect( mark.hasPosition() ).toBeTruthy();
		} );
		it( "should return false if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.hasPosition() ).toBeFalsy();
		} );
	} );

	describe( "tests the hasBlockPosition", function() {
		it( "should return true if there is a block position start", function() {
			const mark = new Mark( { position: { startOffsetBlock: 42, endOffsetBlock: 52 } } );
			expect( mark.hasBlockPosition() ).toBeTruthy();
		} );
		it( "should return true if the block position start return 0", function() {
			const mark = new Mark( { position: { startOffsetBlock: 0, endOffsetBlock: 52 } } );
			expect( mark.hasBlockPosition() ).toBeTruthy();
		} );
		it( "should return false if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.hasBlockPosition() ).toBeFalsy();
		} );
	} );

	describe( "tests the block position start and end offsets", function() {
		it( "should return the block position start", function() {
			const mark = new Mark( { position: { startOffsetBlock: 42, endOffsetBlock: 52 } } );
			expect( mark.getBlockPositionStart() ).toBe( 42 );
		} );
		it( "should return false for block start offset if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.getBlockPositionStart() ).toBeFalsy();
		} );
		it( "should set the block start offset, overriding the current value if available", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test", position: {
				startOffsetBlock: 0,
				endOffsetBlock: 15,
			} } );

			mark.setBlockPositionStart( 3 );
			expect( mark.getBlockPositionStart() ).toBe( 3 );
		} );
		it( "should return the block position end", function() {
			const mark = new Mark( { position: { startOffsetBlock: 0, endOffsetBlock: 52 } } );
			expect( mark.getBlockPositionEnd() ).toBe( 52 );
		} );
		it( "should return false for block end offset if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.getBlockPositionEnd() ).toBeFalsy();
		} );
		it( "should set the block end offset, overriding the current value if available", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test", position: {
				startOffsetBlock: 0,
				endOffsetBlock: 15,
			} } );

			mark.setBlockPositionEnd( 20 );
			expect( mark.getBlockPositionEnd() ).toBe( 20 );
		} );
	} );

	describe( "tests the block information", function() {
		it( "should return the block client id", function() {
			const mark = new Mark( { position: { startOffsetBlock: 42, endOffsetBlock: 52, clientId: "123ClientId" } } );
			expect( mark.getBlockClientId() ).toBe( "123ClientId" );
		} );
		it( "should return false for block client id if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.getBlockClientId() ).toBeFalsy();
		} );
		it( "should return the block attribute id ", function() {
			const mark = new Mark( { position: { startOffsetBlock: 0, endOffsetBlock: 52, attributeId: "attr123" } } );
			expect( mark.getBlockAttributeId() ).toBe( "attr123" );
		} );
		it( "should return false for the block attribute id if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.getBlockAttributeId() ).toBeFalsy();
		} );
		it( "should return true if the Mark is created for the first section of Yoast sub-block", function() {
			const mark = new Mark( { position: { startOffsetBlock: 0, endOffsetBlock: 52, isFirstSection: true } } );
			expect( mark.isMarkForFirstBlockSection() ).toBeTruthy();
		} );
		it( "should return false if the Mark is not created for the first section of Yoast sub-block", function() {
			const mark = new Mark( { position: { startOffsetBlock: 0, endOffsetBlock: 52, isFirstSection: false } } );
			expect( mark.isMarkForFirstBlockSection() ).toBeFalsy();
		} );
		it( "should return false if there is no position at all", function() {
			const mark = new Mark( { marked: "<yoastmark>test</yoastmark>", original: "test" } );
			expect( mark.isMarkForFirstBlockSection() ).toBeFalsy();
		} );
	} );
} );
