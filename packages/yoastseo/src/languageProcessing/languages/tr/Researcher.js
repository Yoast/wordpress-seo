import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import functionWords from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import sentenceLength from "./config/sentenceLength.js";

// All helpers
import getStemmer from "./helpers/getStemmer.js";
import isPassiveSentence from "./helpers/isPassiveSentence.js";

/**
 * The researcher contains all the researches, helpers, data, and config.
 */
export default class Researcher extends AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		super( paper );

		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "tr",
			passiveConstructionType: "morphological",
			firstWordExceptions,
			functionWords,
			redundantPhraseInAltText,
			transitionWords,
			twoPartTransitionWords,
			sentenceLength,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			isPassiveSentence,
		} );
	}
}
