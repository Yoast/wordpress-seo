import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import firstWordExceptions from "./config/firstWordExceptions.js";
import sentenceLength from "./config/sentenceLength.js";

// All helpers
import { createBasicWordForms } from "./helpers/createBasicWordForms.js";
import getStemmer from "./helpers/getStemmer.js";
import isPassiveSentence from "./helpers/isPassiveSentence.js";
import { PREFIXED_FUNCTION_WORDS_REGEX } from "./config/prefixedFunctionWords.js";

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

		// Deletes researches that are currently not available in Hebrew.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "he",
			passiveConstructionType: "morphological",
			firstWordExceptions,
			functionWords,
			redundantPhraseInAltText,
			transitionWords,
			twoPartTransitionWords,
			sentenceLength,
			prefixedFunctionWordsRegex: PREFIXED_FUNCTION_WORDS_REGEX,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
			isPassiveSentence,
		} );
	}
}
