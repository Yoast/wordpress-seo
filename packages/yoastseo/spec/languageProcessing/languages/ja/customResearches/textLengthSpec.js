import textLength from "../../../../../src/languageProcessing/languages/ja/customResearches/textLength";
import Paper from "../../../../../src/values/Paper";

describe( "counts character length of a Japanese text (punctuation and spaces are excluded)", function() {
	const paper = new Paper( "「黒猫」（くろねこ、The Black Cat）は、1843年に　発表されたエドガー・アラン・ポーの短編小説。" );

	it( "returns the number of characters for the text of a given paper", function() {
		expect( textLength( paper ) ).toEqual( { text: "「黒猫」（くろねこ、The Black Cat）は、1843年に　発表されたエドガー・アラン・ポーの短編小説。",
			count: 43, unit: "character" } );
	} );
} );
