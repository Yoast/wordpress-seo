import Mark from "../../src/values/Mark";
import removeDuplicateMarks from "../../src/markers/removeDuplicateMarks";

describe( "removeDuplicateMarks", function() {
	it( "should not touch an empty array", function() {
		expect( removeDuplicateMarks( [] ) ).toEqual( [] );
	} );

	it( "should remove duplicated marks from the array", function() {
		const marks = [
			new Mark( { original: "original", marked: "marked" } ),
			new Mark( { original: "original", marked: "marked" } ),
		];
		const expected = [
			new Mark( { original: "original", marked: "marked" } ),
		];

		expect( removeDuplicateMarks( marks ) ).toEqual( expected );
	} );

	it( "should remove duplicated marks from the array", function() {
		const marks = [
			new Mark( { original: "original", marked: "marked" } ),
			new Mark( { original: "original2", marked: "marked" } ),
			new Mark( { original: "original", marked: "marked" } ),
		];
		const expected = [
			new Mark( { original: "original", marked: "marked" } ),
			new Mark( { original: "original2", marked: "marked" } ),
		];

		expect( removeDuplicateMarks( marks ) ).toEqual( expected );
	} );

	it( "should not remove duplicated marks if the mark objects have position information", function() {
		const marks = [
			new Mark( { original: "original", marked: "marked", position: { startOffset: 0, endOffset: 10 } } ),
			new Mark( { original: "original2", marked: "marked", position: { startOffset: 0, endOffset: 10 } } ),
			new Mark( { original: "original1", marked: "marked", position: { startOffset: 15, endOffset: 20 } } ),
		];

		expect( removeDuplicateMarks( marks ) ).toEqual( marks );
	} );
} );
