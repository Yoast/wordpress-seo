import getAllWordsFromPaper from "../../../../src/languageProcessing/helpers/morphology/getAllWordsFromPaper";
import Paper from "../../../../src/values/Paper";

const text = "Codenamed SN8, the uncrewed rocket lifted away from the Boca Chica R&D facility on what had been billed as a brief flight" +
	" to 12.5km (41,000ft). The 50m-tall vehicle crashed on touchdown but Mr Musk was delighted with how much the test outing achieved." +
	" Before the flight, the tech billionaire had dampened expectations, warning his fans that some mishap was likely." +
	" Nonetheless, Musk has big hopes for the Starship when it is fully developed. He says it is the future for his SpaceX company." +
	" Starship will launch people and cargo into orbit, and the entrepreneur also envisages the vehicle travelling to the Moon and Mars." +
	" The SpaceX CEO praised his team, adding that the demonstration had acquired \"all the data we needed\"." +
	" \"Mars, here we come!!\" he tweeted. <img src='img.com' alt='a test' />";
const testPaper = new Paper( text, {
	description: "US entrepreneur Elon Musk has launched the latest prototype of his Starship vehicle from Texas.",
	title: "Elon Musk's Starship prototype makes a big impact",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://www.bbc.com/news/science-environment-55239628",
	slug: "science-environment-55239628",
} );

describe( "Test for getting all words found in the text, title, slug and meta description of a given paper", () => {
	it( "gets all words found in the text, title, slug and meta description of a given paper", () => {
		expect( getAllWordsFromPaper( testPaper ) ).toEqual(  [ "Codenamed", "SN8", "the", "uncrewed", "rocket",
			"lifted", "away", "from", "the", "Boca", "Chica", "R&D", "facility", "on", "what", "had", "been", "billed",
			"as", "a", "brief", "flight", "to", "12\\.5km", "41,000ft", "The", "50m-tall", "vehicle", "crashed", "on",
			"touchdown", "but", "Mr", "Musk", "was", "delighted", "with", "how", "much", "the", "test", "outing", "achieved",
			"Before", "the", "flight", "the", "tech", "billionaire", "had", "dampened", "expectations", "warning", "his", "fans",
			"that", "some", "mishap", "was", "likely", "Nonetheless", "Musk", "has", "big", "hopes", "for", "the", "Starship", "when",
			"it", "is", "fully", "developed", "He", "says", "it", "is", "the", "future", "for", "his", "SpaceX", "company",
			"Starship", "will", "launch", "people", "and", "cargo", "into", "orbit", "and", "the", "entrepreneur", "also",
			"envisages", "the", "vehicle", "travelling", "to", "the", "Moon", "and", "Mars", "The", "SpaceX", "CEO", "praised",
			"his", "team", "adding", "that", "the", "demonstration", "had", "acquired", "all", "the", "data", "we", "needed",
			"Mars", "here", "we", "come", "he", "tweeted", "Elon", "Musk's", "Starship", "prototype", "makes", "a",
			"big", "impact", "science-environment-55239628", "science", "environment", "55239628", "US", "entrepreneur",
			"Elon", "Musk", "has", "launched", "the", "latest", "prototype", "of", "his", "Starship", "vehicle", "from",
			"Texas", "a", "test" ] );
	} );
} );
