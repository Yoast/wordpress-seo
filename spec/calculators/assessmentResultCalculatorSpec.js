var AssessmentResultCalculator = require( "../../js/calculators/assessmentResultCalculator.js" );
var MissingArgument = require( "../../js/errors/missingArgument.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

var getScoringConfiguration = function( i18n ) {
	return {
		scoreArray: [
			{
				min: 300,
				score: 9,

				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is more than the %2$d word recommended minimum." )
			},
			{
				range: [ 250, 300 ],
				score: 7,

				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is slightly below the %2$d word recommended minimum. " +
				                                         "Add a bit more copy." )
			},
			{
				range: [ 200, 250 ],
				score: 5,

				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful " +
				                                         "content on this topic for readers." )
			},
			{
				range: [ 100, 200 ],
				score: -10,

				//* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful " +
				                                         "content on this topic for readers." )
			},
			{
				range: [ 0, 100 ],
				score: -20,

				/* translators: %1$d expands to the number of words in the text */
				text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words. This is far too low and should be increased." )
			}
		],
		replacements: {
			"%1$d": "%%result%%",
			"%2$d": 300
		}
	};
};

describe( "An assessment retrieving a formatted assessment result", function(){
	it( "Accepts an assessment and configuration", function() {
		var calculatedResult = new AssessmentResultCalculator( 99, getScoringConfiguration( i18n ) );

		expect( calculatedResult ).toEqual( { range: [ 0, 100 ], score: -20, text: "The text contains 99 words. This is far too low and should be increased." } );
	} );

	it( "Rejects an assessment when a configuration is missing", function() {
		expect( function() {
			new AssessmentResultCalculator( 99 )
		} ).toThrowError( MissingArgument );
	} );
} );
