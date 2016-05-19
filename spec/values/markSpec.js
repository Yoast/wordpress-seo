var Mark = require( "../../js/values/Mark" );

describe( "a mark value object", function() {

	it( "should have default properties", function() {
		var mark = new Mark({});

		expect( mark.getOriginal() ).toBe( "" );
		expect( mark.getMarked() ).toBe( "" );
	});

	it( "should allow new value via the constructor", function() {
		var mark = new Mark({ original: "original", marked: "marked" })

		expect( mark.getOriginal() ).toBe( "original" );
		expect( mark.getMarked() ).toBe( "marked" );
	});

	describe( "a simple application function", function() {
		it( "should be able to apply itself by replacing text", function() {
			var mark = new Mark({ original: "original", marked: "marked" });
			var text = "original";
			var expected = "marked";

			expect( mark.applyWithReplace( text ) ).toBe( expected );
		});

		it( "should only apply to the first occurence", function() {
			var mark = new Mark({ original: "original", marked: "marked" });
			var text = "original original original original original original original";
			var expected = "marked original original original original original original";

			expect( mark.applyWithReplace( text ) ).toBe( expected );
		});
	});


} );
