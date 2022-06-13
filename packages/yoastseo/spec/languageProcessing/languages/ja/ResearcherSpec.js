import Researcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/ja/config/functionWords";
import subheadingsTooLong from "../../../../src/languageProcessing/languages/ja/config/subheadingsTooLong";
import sentenceLength from "../../../../src/languageProcessing/languages/ja/config/sentenceLength";
import metaDescriptionLength from "../../../../src/languageProcessing/languages/ja/config/metaDescriptionLength";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );

describe( "a test for Japanese Researcher", function() {
	const researcher = new Researcher( ( new Paper( "", { keyword: "小さい花の刺繍" } ) ) );

	it( "returns true if the Japanese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Japanese Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "getPassiveVoiceResult" ) ).toBe( false );
		expect( researcher.getResearch( "keywordCountInSlug" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns the Japanese sentence length configuration", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Japanese meta description length configuration", function() {
		expect( researcher.getConfig( "metaDescriptionLength" ) ).toEqual( metaDescriptionLength );
	} );

	it( "returns the Japanese function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns the Japanese subheading distribution configuration", function() {
		expect( researcher.getConfig( "subheadingsTooLong" ) ).toEqual( subheadingsTooLong );
	} );

	it( "returns the keyphrase length", function() {
		expect( researcher.getResearch( "keyphraseLength" ).keyphraseLength ).toEqual( 7 );
	} );

	it( "returns the keyphrase unaltered when the Japanese morphology data is not available", function() {
		expect( researcher.getHelper( "customGetStemmer" )( researcher )( "日帰り" ) ).toEqual(
			"日帰り" );
	} );

	it( "creates the stem when the Japanese morphology data is available", function() {
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( researcher.getHelper( "customGetStemmer" )( researcher )( "日帰り" ) ).toEqual(
			"日帰っ"
		);
	} );
} );
