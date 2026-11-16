import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import { all as functionWords } from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import stopWords from "./config/stopWords.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import syllables from "./config/syllables.js";
import keyphraseLength from "./config/keyphraseLength.js";
import memoizedTokenizer from "./helpers/memoizedSentenceTokenizer.js";

// All helpers
import getClauses from "./helpers/getClauses.js";
import getStemmer from "./helpers/getStemmer.js";
import fleschReadingScore from "./helpers/calculateFleschReadingScore.js";
import checkIfWordIsFunction from "./helpers/checkIfWordIsFunction.js";

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

		Object.assign( this.config, {
			language: "de",
			passiveConstructionType: "periphrastic",
			firstWordExceptions,
			functionWords,
			redundantPhraseInAltText,
			stopWords,
			transitionWords,
			twoPartTransitionWords,
			syllables,
			keyphraseLength,
		} );

		Object.assign( this.helpers, {
			getClauses,
			getStemmer,
			fleschReadingScore,
			memoizedTokenizer,
			checkIfWordIsFunction,
		} );
	}
}
