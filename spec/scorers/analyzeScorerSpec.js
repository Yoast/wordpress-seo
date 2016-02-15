var escapeHTML = require( "lodash/string/escape" );
var Score = require( "../../js/values/Score.js" );
var AnalyzeScorer = require("../../js/analyzescorer.js");



describe("Checks for valid score", function(){
	it("returns an object", function(){

		var Jed = require( "jed" );

		var defaultTranslations = {
			"domain": "js-text-analysis",
			"locale_data": {
				"js-text-analysis": {
					"": {}
				}
			}
		};

		var i18n = new Jed( defaultTranslations );

		var analyzeScorer = new AnalyzeScorer({
			config: {
				i18n: i18n
			}
		});

		var scoreObj = {
			scoreArray: [
				{
					min: 1,
					max: 9,
					score: 1,

					/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
					text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.")
				}
			],
			replaceArray: [
				{ name: "wordCount", position: "%1$d", source: "matcher" },
				{ name: "recommendedWordcount", position: "%2$d", value: 300 }
			]
		};

		var result = analyzeScorer.returnScore( 1, scoreObj, 0 );

		expect( result.weight ).toBe( 1 );

	});
});
