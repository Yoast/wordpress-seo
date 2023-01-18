import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import checkPPAttachment from "../../../src/languageProcessing/researches/checkPPAttachment";
import fetch from "node-fetch";
import isAmbiguous from "../../../src/languageProcessing/researches/checkPPAttachment";

describe( "Check for syntactically ambiguous sentences with PP attachment", function() {
	it( "should find that some sentences are ambiguous", async function() {
		const cx = "";
		const key = "";
		const url = "https://www.googleapis.com/customsearch/v1?";
		const parameters = { q: "test", exactTerms: "test", cx: cx, key: key, googlehost: "www.google.com" };
		console.log( url + new URLSearchParams( parameters ) );

		await fetch( url + new URLSearchParams( parameters ), { method: "GET" } )
			.then( response => {
				console.log( response.status );
				return response.json();
			} )
			.then( data => console.log( data ) )
			.catch( function( err ) {
				console.log( err );
				console.log(data.searchInformation.totalResults);
			} );
		const mockPaper = new Paper(
			"John saw cops with large telescopes. " +
			"John saw the large cop with a big telescope riding a bike. " +
			"John saw the cop. "
		);
		const mockResearcher = new EnglishResearcher( mockPaper );

		expect( checkPPAttachment( mockPaper, mockResearcher ) ).toEqual(
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
} );
