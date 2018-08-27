const altTagCountFunction = require( "../../js/researches/imageAltTags" );
const Paper = require( "../../js/values/Paper" );

describe( "Counts images in an text", function() {
	it( "returns an empty object with all alt-counts as zero", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string", { keyword: "keyword", synonyms: "synonym, another synonym" } )
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	 it( "returns object with the withAltKeyword as 1 when the keyword is set and present", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "keyword", synonyms: "synonym, another synonym" } )
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAlt as 1 when there's an alt-tag, but no keyword is set", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "" } )
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 1 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAltNonKeyword as 1 when the keyword is set, but not present in the alt-tag", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "sample" } )
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "returns object with the noAlt as 1 when the alt-tag is empty", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='' />", { keyword: "keyword" } )
		);

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the noAlt as 1 when the alt-tag is missing", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' />", { keyword: "keyword" } )
		);

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with a combination of present and missing alt-tags", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='' />", { keyword: "keyword" } )
		);

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAltKeyword as 1 when the keyword is set and present and has a $", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://img' alt='$keyword' />", { keyword: "$keyword" } )
		);

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with a combination of present and missing alt-tags with keyphrase and synonym words in it", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='something empty' /> " +
				"string <img src='http://plaatje' alt='synonym' /> <img src='http://plaatje' alt='' /> " +
				"string <img src='http://plaatje' alt='test' /> <img src='http://plaatje' alt='' /> " +
				"string <img src='http://plaatje' alt='paper interesting' /> <img src='http://plaatje' alt='paper' />", {
				keyword: "keyword",
				synonyms: "synonym, test, interesting paper",
			} )
		);

		expect( stringToCheck.noAlt ).toBe( 2 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 5 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "returns object with a combination of present and missing alt-tags with \"keyphrase\" and synonym words in it", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='something empty' /> " +
				"string <img src='http://plaatje' alt='synonym' /> <img src='http://plaatje' alt='' /> " +
				"string <img src='http://plaatje' alt='keyword in quotes' /> <img src='http://plaatje' alt='' /> " +
				"string <img src='http://plaatje' alt='paper interesting' /> <img src='http://plaatje' alt='paper' />", {
				keyword: "\"keyword in quotes\"",
				synonyms: "synonym, test, interesting paper",
			} )
		);

		expect( stringToCheck.noAlt ).toBe( 2 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 4 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 2 );
	} );

	it( "returns object with morphological forms", function() {
		const stringToCheck = altTagCountFunction(
			new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='something empty' /> " +
				"string <img src='http://plaatje' alt='synonyms' /> <img src='http://plaatje' alt='' /> " +
				"string <img src='http://plaatje' alt='keyword in quotes' /> <img src='http://plaatje' alt='' /> " +
				"string <img src='http://plaatje' alt='paper interesting' /> <img src='http://plaatje' alt='papering' />", {
				keyword: "\"keyword in quotes\"",
				synonyms: "synonym, test, interesting paper",
			} )
		);

		expect( stringToCheck.noAlt ).toBe( 2 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 4 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 2 );
	} );
} );
