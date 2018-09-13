import { forEach } from "lodash-es";

import getWords from "../../../stringProcessing/getWords.js";
import matchParticiplesFactory from "./matchParticiples";
const matchParticiples = matchParticiplesFactory();
const regularParticipleRegex = matchParticiples.regularParticiples;
const irregularParticipleRegex = matchParticiples.irregularParticiples;

import EnglishParticiple from "../../english/passiveVoice/EnglishParticiple.js";
import FrenchParticiple from "../../french/passiveVoice/FrenchParticiple.js";
import SpanishParticiple from "../../spanish/passiveVoice/SpanishParticiple.js";
import ItalianParticiple from "../../italian/passiveVoice/ItalianParticiple.js";
import DutchParticiple from "../../dutch/passiveVoice/DutchParticiple.js";
import PolishParticiple from "../../polish/passiveVoice/PolishParticiple.js";

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} language The language to find the participles for.
 * @returns {Array} The list with participle objects.
 */
export default function( sentencePartText, auxiliaries, language ) {
	let words = getWords( sentencePartText );
	let foundParticiples = [];

	forEach( words, function( word ) {
		let type = "";
		if( regularParticipleRegex( word, language ).length !== 0 ) {
			type = "regular";
		}
		if( irregularParticipleRegex( word, language ).length !== 0 ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			switch ( language ) {
				case "fr":
					foundParticiples.push( new FrenchParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "es":
					foundParticiples.push( new SpanishParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "it":
					foundParticiples.push( new ItalianParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "nl":
					foundParticiples.push( new DutchParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "pl":
					foundParticiples.push( new PolishParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
				case "en":
				default:
					foundParticiples.push( new EnglishParticiple( word, sentencePartText,
						{ auxiliaries: auxiliaries, type: type, language: language } ) );
					break;
			}
		}
	} );
	return foundParticiples;
}
