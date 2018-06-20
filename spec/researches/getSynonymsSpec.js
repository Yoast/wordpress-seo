const getSynonyms = require( "../../js/researches/getSynonyms" );
const Paper = require( "../../js/values/Paper" );

// todo: Change this spec as soon as the synonym interface is ready
describe( "Gets synonyms from the paper keyword", function() {
	it( "returns synonyms if they are provided by the user", function() {
		let getSynonymsResult = getSynonyms(
			new Paper( "text", { keyword: "keyword, synonym 1, synonym 2, synonym 3" } )
		);

		expect( getSynonymsResult.keyword ).toEqual( "keyword" );
		expect( getSynonymsResult.synonyms ).toEqual( [ "synonym 1", "synonym 2", "synonym 3" ] );

		getSynonymsResult = getSynonyms(
			new Paper( "text", { keyword: "keyword!, Synonym 1?, synonym-2, synonym3" } )
		);

		expect( getSynonymsResult.keyword ).toEqual( "keyword" );
		expect( getSynonymsResult.synonyms ).toEqual( [ "Synonym 1", "synonym-2", "synonym3" ] );
	} );

	it( "returns empty synonyms if only one keyword is provided by the user", function() {
		const getSynonymsResult = getSynonyms(
			new Paper( "text", { keyword: "keyword" } )
		);

		expect( getSynonymsResult.keyword ).toEqual( "keyword" );
		expect( getSynonymsResult.synonyms ).toEqual( [] );
	} );

	it( "does not break if no keyword at all is provided by the user", function() {
		const getSynonymsResult = getSynonyms(
			new Paper( "text", { keyword: "" } )
		);

		expect( getSynonymsResult.keyword ).toEqual( "" );
		expect( getSynonymsResult.synonyms ).toEqual( [] );
	} );
} );
