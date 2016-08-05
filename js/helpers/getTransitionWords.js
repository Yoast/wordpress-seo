var transitionWordsEnglish = require( "../researches/english/transitionWords.js" );
var twoPartTransitionWordsEnglish = require( "../researches/english/twoPartTransitionWords.js" );
var transitionWordsGerman = require( "../researches/german/transitionWords.js" );
var twoPartTransitionWordsGerman = require( "../researches/german/twoPartTransitionWords.js" );
var transitionWordsFrench = require( "../researches/french/transitionWords.js" );
var twoPartTransitionWordsFrench = require( "../researches/french/twoPartTransitionWords.js" );
var transitionWordsSpanish = require( "../researches/spanish/transitionWords.js" );
var twoPartTransitionWordsSpanish = require( "../researches/spanish/twoPartTransitionWords.js" );

var getLanguage = require( "./getLanguage.js" );

module.exports = function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return {
				transitionWords: transitionWordsGerman,
				twoPartTransitionWords: twoPartTransitionWordsGerman
			};
		case "es":
			return {
				transitionWords: transitionWordsSpanish,
				twoPartTransitionWords: twoPartTransitionWordsSpanish
			};
		case "fr":
			return {
				transitionWords: transitionWordsFrench,
				twoPartTransitionWords: twoPartTransitionWordsFrench
			};
		default:
		case "en":
			return {
				transitionWords: transitionWordsEnglish,
				twoPartTransitionWords: twoPartTransitionWordsEnglish
			};
	}
};
