let transitionWordsEnglish = require( "../researches/english/transitionWords.js" )().allWords;
import twoPartTransitionWordsEnglish from "../researches/english/twoPartTransitionWords.js";
let transitionWordsGerman = require( "../researches/german/transitionWords.js" )().allWords;
import twoPartTransitionWordsGerman from "../researches/german/twoPartTransitionWords.js";
let transitionWordsFrench = require( "../researches/french/transitionWords.js" )().allWords;
import twoPartTransitionWordsFrench from "../researches/french/twoPartTransitionWords.js";
let transitionWordsSpanish = require( "../researches/spanish/transitionWords.js" )().allWords;
import twoPartTransitionWordsSpanish from "../researches/spanish/twoPartTransitionWords.js";
let transitionWordsDutch = require( "../researches/dutch/transitionWords.js" )().allWords;
import twoPartTransitionWordsDutch from "../researches/dutch/twoPartTransitionWords.js";
let transitionWordsItalian = require( "../researches/italian/transitionWords.js" )().allWords;
import twoPartTransitionWordsItalian from "../researches/italian/twoPartTransitionWords.js";
let transitionWordsPortuguese = require( "../researches/portuguese/transitionWords.js" )().allWords;
import twoPartTransitionWordsPortuguese from "../researches/portuguese/twoPartTransitionWords.js";
let transitionWordsRussian = require( "../researches/russian/transitionWords.js" )().allWords;
import twoPartTransitionWordsRussian from "../researches/russian/twoPartTransitionWords.js";
let transitionWordsCatalan = require( "../researches/catalan/transitionWords.js" )().allWords;
import twoPartTransitionWordsCatalan from "../researches/catalan/twoPartTransitionWords.js";
let transitionWordsPolish = require( "../researches/polish/transitionWords.js" )().allWords;
import twoPartTransitionWordsPolish from "../researches/polish/twoPartTransitionWords.js";
import getLanguage from "./getLanguage.js";

export default function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return {
				transitionWords: transitionWordsGerman,
				twoPartTransitionWords: twoPartTransitionWordsGerman,
			};
		case "es":
			return {
				transitionWords: transitionWordsSpanish,
				twoPartTransitionWords: twoPartTransitionWordsSpanish,
			};
		case "fr":
			return {
				transitionWords: transitionWordsFrench,
				twoPartTransitionWords: twoPartTransitionWordsFrench,
			};
		case "nl":
			return {
				transitionWords: transitionWordsDutch,
				twoPartTransitionWords: twoPartTransitionWordsDutch,
			};
		case "it":
			return {
				transitionWords: transitionWordsItalian,
				twoPartTransitionWords: twoPartTransitionWordsItalian,
			};
		case "pt":
			return {
				transitionWords: transitionWordsPortuguese,
				twoPartTransitionWords: twoPartTransitionWordsPortuguese,
			};
		case "ru":
			return {
				transitionWords: transitionWordsRussian,
				twoPartTransitionWords: twoPartTransitionWordsRussian,
			};
		case "ca":
			return {
				transitionWords: transitionWordsCatalan,
				twoPartTransitionWords: twoPartTransitionWordsCatalan,
			};
		case "pl":
			return {
				transitionWords: transitionWordsPolish,
				twoPartTransitionWords: twoPartTransitionWordsPolish,
			};
		default:
		case "en":
			return {
				transitionWords: transitionWordsEnglish,
				twoPartTransitionWords: twoPartTransitionWordsEnglish,
			};
	}
}
