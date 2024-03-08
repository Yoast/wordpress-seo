import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import { all as functionWords } from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import { PREFIXED_FUNCTION_WORDS_REGEX } from "./config/prefixedFunctionWords";

// All helpers
import { createBasicWordForms } from "./helpers/createBasicWordForms";
import getStemmer from "./helpers/getStemmer";
import isPassiveSentence from "./helpers/isPassiveSentence";

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
			language: "ar",
			passiveConstructionType: "morphological",
			firstWordExceptions,
			functionWords,
			transitionWords,
			twoPartTransitionWords,
			prefixedFunctionWordsRegex: PREFIXED_FUNCTION_WORDS_REGEX,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
			isPassiveSentence,
		} );
	}
}
