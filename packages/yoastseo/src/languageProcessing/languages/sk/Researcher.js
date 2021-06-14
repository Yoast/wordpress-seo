import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config

// All helpers

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

		// Deletes researches that are currently not available in Slovak.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.functionWordsInKeyphrase;
		delete this.defaultResearches.findTransitionWords;

		Object.assign( this.config, {
			language: "sk",
		} );

		Object.assign( this.helpers, {
		} );
	}
}
