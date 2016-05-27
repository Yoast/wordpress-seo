var Mark = require( "../../js/values/Mark" );
var removeDuplicateMarks = require( "../../js/markers/removeDuplicateMarks" );

describe( "removeDuplicateMarks", function() {
	it( "should not touch an empty array", function() {
		expect( removeDuplicateMarks( [] ) ).toEqual( [] );
	});

	it( "should remove duplicated marks from the array", function() {
		var marks = [
			new Mark({ original: "original", marked: "marked" }),
			new Mark({ original: "original", marked: "marked" })
		];
		var expected = [
			new Mark({ original: "original", marked: "marked" })
		];

		expect( removeDuplicateMarks( marks ) ).toEqual( expected );
	});

	it( "should remove duplicated marks from the array", function() {
		var marks = [
			new Mark({ original: "original", marked: "marked" }),
			new Mark({ original: "original2", marked: "marked" }),
			new Mark({ original: "original", marked: "marked" })
		];
		var expected = [
			new Mark({ original: "original", marked: "marked" }),
			new Mark({ original: "original2", marked: "marked" })
		];

		expect( removeDuplicateMarks( marks ) ).toEqual( expected );
	});
});
