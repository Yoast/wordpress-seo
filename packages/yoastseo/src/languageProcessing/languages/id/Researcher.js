import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import { all as functionWords } from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import getStemmer from "./helpers/getStemmer";
import isPassiveSentence from "./helpers/isPassiveSentence";
import splitIntoTokensCustom from "./helpers/splitIntoTokensCustom";

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
