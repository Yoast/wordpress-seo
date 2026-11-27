import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import { all as functionWords } from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";

// All helpers
import getStemmer from "./helpers/getStemmer.js";
import isPassiveSentence from "./helpers/isPassiveSentence.js";
import splitIntoTokensCustom from "./helpers/splitIntoTokensCustom.js";

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

		// Delete the researches that are not available for Indonesian.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "id",
			passiveConstructionType: "morphological",
			firstWordExceptions,
			functionWords,
			redundantPhraseInAltText,
			transitionWords,
			twoPartTransitionWords,
			areHyphensWordBoundaries: false,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			isPassiveSentence,
			splitIntoTokensCustom,
		} );
	}
}
