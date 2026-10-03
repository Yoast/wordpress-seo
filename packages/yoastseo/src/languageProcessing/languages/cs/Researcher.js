import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import stopWords from "./config/stopWords";
import { all as functionWords } from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import getClauses from "./helpers/getClauses";
import getStemmer from "./helpers/getStemmer";

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
			language: "cs",
			passiveConstructionType: "periphrastic",
			firstWordExceptions,
			stopWords,
			functionWords,
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			getClauses,
			getStemmer,
		} );
	}
}
