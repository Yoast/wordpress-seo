import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import firstWordExceptions from "./config/firstWordExceptions";
import sentenceLength from "./config/sentenceLength";

// All helpers
import { createBasicWordForms } from "./helpers/createBasicWordForms";
import getStemmer from "./helpers/getStemmer";
import isPassiveSentence from "./helpers/isPassiveSentence";
import { PREFIXED_FUNCTION_WORDS_REGEX } from "./config/prefixedFunctionWords";

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
