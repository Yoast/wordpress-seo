import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import { all as functionWords } from "./config/functionWords";
import stopWords from "./config/stopWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import syllables from "./config/syllables.json";
import sentenceLength from "./config/sentenceLength";

// All helpers
import getClauses from "./helpers/getClauses";
import getStemmer from "./helpers/getStemmer";
import fleschReadingScore from "./helpers/calculateFleschReadingScore";

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

		delete this.defaultResearches.wordComplexity;

		Object.assign( this.config, {
			language: "es",
			passiveConstructionType: "periphrastic",
			firstWordExceptions,
			functionWords,
			stopWords,
			transitionWords,
			twoPartTransitionWords,
			syllables,
			sentenceLength,
		} );

		Object.assign( this.helpers, {
			getClauses,
			getStemmer,
			fleschReadingScore,
		} );
	}
}
