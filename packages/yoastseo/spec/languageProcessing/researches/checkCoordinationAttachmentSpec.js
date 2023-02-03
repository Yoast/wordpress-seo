import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkCoordination from "../../../src/languageProcessing/researches/checkCoordination";
import SearchKey from "../../../SearchKey.json";
import fetch from "node-fetch";
import {coordinationGoogleSearch} from "../../../src/languageProcessing/researches/checkCoordination";


it( "should find that some sentences are ambiguous", async function() {
	/**
		 * Checks if a reading is possible according to Google Search.
		 * @param {string} reading The potentially ambiguous reading.
		 * @returns {number} Returns the number of hits.
		 */
	async function getHits( reading ) {
		const cx = SearchKey.cx;
		const key = SearchKey.key;
		const url = "https://www.googleapis.com/customsearch/v1?";
		const parameters = { q: reading, exactTerms: reading, cx: cx, key: key, googlehost: "www.google.com" };
		let hits = 0;

		// Using the parameters above, fetch results from Google.com
		await fetch( url + new URLSearchParams( parameters ), { method: "GET" } )
			.then( response => {
				// Return the HTTP response status code
				console.log( response.status );
				return response.json();
			} )
		// Return the number of hits for each query
			.then( data => {
				hits = parseInt( data.searchInformation.totalResults, 10 );
			} )
		// If there is any error, return error message
			.catch( function( err ) {
				console.log( err );
			} );

		return hits;
	}

	// Test sentences with targeted regex
	const mockPaper = new Paper(
		"Mary bought fresh bananas and apples. " +
			"Mary bought bananas. " +
			"Mary bought real estate and cars. "
	);
	const mockResearcher = new EnglishResearcher( mockPaper );
	const coordinationResult = await coordinationGoogleSearch( mockPaper, mockResearcher );
	const results = await Promise.all( coordinationResult.map( async( result ) => {
		// Save results for each reading in a variable
		// eslint-disable-next-line no-inline-comments
		const hitsReading1 = 0; // await getHits( result.reading1 );
		// eslint-disable-next-line no-inline-comments
		const hitsReading2 = 0; // await getHits( result.reading2 );
		// Return each reading and its number of hits
		console.log( result.reading1, hitsReading1 );
		console.log( result.reading2, hitsReading2 );
		// Sort the hits in ascending order
		const sortedReadings = [ hitsReading1, hitsReading2 ].sort( function( a, b ) {
			return a - b;
		} );
		console.log( sortedReadings );
		const ambFormula = sortedReadings[ 0 ] / sortedReadings[ 1 ] * 100;
		if ( ! isNaN( ambFormula ) && sortedReadings[ 0 ] >= 80 ) {
			console.log( "The construction", '"' + result.construction.join( " " ) + '"', "has two potential readings:",
				"1:", result.reading1, "OR", "2:", result.reading2 );
			console.log( "Ambiguity: " + Math.round( ambFormula ) + "%" );
		} else {
			console.log( "No ambiguity found. Ratio: " + Math.round( ambFormula ) + "%" );
		}
	} ) );

	console.log( results );
	expect( coordinationResult ).toEqual(
		[ {
			sentence: "Mary bought fresh bananas and apples.",
			reading1: "fresh bananas",
			reading2: "fresh apples",
			construction: ["fresh", "bananas", "and", "apples"],
		},
		{
			sentence: "Mary bought real estate and cars.",
			reading1: "real estate",
			reading2: "real cars",
			construction: ["real", "estate", "and", "cars"],
		},
		] );
}
);
