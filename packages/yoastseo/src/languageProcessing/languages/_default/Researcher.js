import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All helpers
import getStemmer from "./helpers/getStemmer";

/**
 * The researches contains all the researches
 */
export default class Researcher extends AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		super( paper );

		// Deletes researches that are not available for languages that we haven't supported yet.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.findTransitionWords;
		delete this.defaultResearches.functionWordsInKeyphrase;

		Object.assign( this.config, {
			functionWords: [],
			wordComplexity: {
				frequencyList: [],
				wordLength: 10,
				canStartWithUpperCase: false,
			},
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
