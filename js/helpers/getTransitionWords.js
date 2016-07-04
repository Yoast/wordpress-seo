var transitionWordsEnglish = require( "../researches/english/transitionWords.js" );
var twoPartTransitionWordsEnglish = require( "../researches/english/twoPartTransitionWords.js" );
var transitionWordsGerman = require( "../researches/german/transitionWords.js" );
var twoPartTransitionWordsGerman = require( "../researches/german/twoPartTransitionWords.js" );

var getLanguage = require( "./getLanguage.js" );

module.exports = function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return {
				transitionWords: transitionWordsGerman,
				twoPartTransitionWords: twoPartTransitionWordsGerman
			};
		default:
		case "en":
			return {
				transitionWords: transitionWordsEnglish,
				twoPartTransitionWords: twoPartTransitionWordsEnglish
			};
	}
};
