/* global analysisWorker */
import { bundledPlugins } from "yoastseo";
const UsedKeywordsPlugin = bundledPlugins.usedKeywords;

class UsedKeywordsAssessment {
	/**
	 * Constructs the used keyword assessment for the analysis worker.
	 */
	constructor() {
		this._initialized = false;
	}

	/**
	 * Registers the used keyword assessment with the analysis worker.
	 *
	 * @returns {void}
	 */
	register() {
		analysisWorker.registerMessageHandler( "updateKeywordUsage", this.updateKeywordUsage.bind( this ), "used-keywords-assessment" );
		analysisWorker.registerMessageHandler( "initialize", this.initialize.bind( this ), "used-keywords-assessment" );
	}

	/**
	 * Initializes the used keywords plugin provided by YoastSEO.js
	 *
	 * @param {Object} options The options to send to the UsedKeywordsPlugin.
	 *
	 * @returns {void}
	 */
	initialize( options ) {
		this._plugin = new UsedKeywordsPlugin( analysisWorker, options );
		this._plugin.registerPlugin();
		this._initialized = true;
	}

	/**
	 * Updates keyword usage in the used keywords plugin.
	 *
	 * @param {Object} keywordUsage Information about when keywords are used in other posts.
	 *
	 * @returns {void}
	 */
	updateKeywordUsage( keywordUsage ) {
		if ( ! this._initialized ) {
			throw new Error( "UsedKeywordsAssessment must be initialized before keywords can be updated." );
		}

		this._plugin.updateKeywordUsage( keywordUsage );

		// Refresh assessment in the worker to make sure our assessment is refreshed.
		analysisWorker.refreshAssessment( "usedKeywords", "previouslyUsedKeywords" );
	}
}

const keywordsAssessment = new UsedKeywordsAssessment();

keywordsAssessment.register();
