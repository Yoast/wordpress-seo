var altTagCountFunction = require( "../../js/researches/imageAltTags" );
var Paper = require( "../../js/values/Paper" );

describe( "Counts images in an text", function(){
	it( "returns an empty object with all alt-counts as zero", function() {
		var stringToCheck = altTagCountFunction(
			new Paper( "string", { keyword: "keyword" } )
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	});

	it( "returns object with the withAltKeyword as 1 when the keyword is set and present", function() {
		var stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "keyword"})
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	});

	it( "returns object with the withAlt as 1 when there's an alt-tag, but no keyword is set", function() {
		var stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: ""})
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 1 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	});

	it( "returns object with the withAltNonKeyword as 1 when the keyword is set, but not present in the alt-tag", function() {
		var stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "sample"})
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	});

	it( "returns object with the noAlt as 1 when the alt-tag is empty or missing", function() {
		var stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='' />", { keyword: "keyword"})
		);

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );

		var stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' />", { keyword: "keyword"})
		);

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	});

	it( "returns object with a combination of present and missing alt-tags", function() {
		var stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='' />", { keyword: "keyword"})
		);

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	})
});
