import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkPPAttachment from "../../../src/languageProcessing/researches/checkPPAttachment";
import fetch from "node-fetch";
import SearchKey from "../../../SearchKey.json";
// /
it( "should find that some sentences are ambiguous", async function() {
	// eslint-disable-next-line require-jsdoc
	async function getHits( reading ) {
		const cx = SearchKey.cx;
		const key = SearchKey.key;
		const url = "https://www.googleapis.com/customsearch/v1?";
		const parameters = { q: reading, exactTerms: reading, cx: cx, key: key, googlehost: "www.google.com" };
		let hits = 0;

		await fetch( url + new URLSearchParams( parameters ), { method: "GET" } )
			.then( response => {
				console.log( response.status );
				return response.json();
			} )
			.then( data => {
				hits = data.searchInformation.totalResults;
			} )
			.catch( function( err ) {
				console.log( err );
			} );

		return hits;
	}

	const mockPaper = new Paper(
		"John saw cops with large telescopes. " +
		"John saw the large cop with a big telescope riding a bike. " +
		"John saw the cop. "
	);
	const mockResearcher = new EnglishResearcher( mockPaper );
	const PPAttachmentsResult = await checkPPAttachment( mockPaper, mockResearcher );

	const results = await Promise.all( PPAttachmentsResult.map( async( result ) => {
		const hitsReading1 = await getHits( result.reading1 );
		const hitsReading2 = await getHits( result.reading2 );
		console.log( result.reading1, hitsReading1 );
		console.log( result.reading2, hitsReading2 );
		const sortedReadings = [ hitsReading1, hitsReading2 ].map( hit => parseInt( hit, 10 ) ).sort();
		const ambFormula = sortedReadings[ 0 ] / sortedReadings[ 1 ] * 100;
		if (ambFormula !=== NaN) {
		return console.log( "The ambiguity percentage of", '"' + result.sentence.slice(0,-1) + '"', "is:" + ambFormula + "%" );
		}
	} ) );

	console.log( results );
	expect( PPAttachmentsResult ).toEqual(
		[
			{
				sentence: "John saw cops with large telescopes.",
				reading1: "saw with telescopes",
				reading2: "cops with telescopes",
				construction: [ "saw", "cops", "with", "large", "telescopes" ],
			},
			{
				sentence: "John saw the large cop with a big telescope riding a bike.",
				reading1: "saw with a telescope",
				reading2: "cop with a telescope",
				construction: [ "saw", "the", "large", "cop", "with", "a", "big", "telescope" ],
			},
		] );
} );
