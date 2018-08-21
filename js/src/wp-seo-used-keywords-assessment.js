/* global analysisWorker */
import { bundledPlugins } from "yoastseo";
const UsedKeywordsPlugin = bundledPlugins.usedKeywords;

class UsedKeywordsAssessment {
	constructor() {
		this._initialized = false;
	}

	register() {
		analysisWorker.registerMessageHandler( "updateKeywordUsage", this.updateKeywordUsage.bind( this ), "used-keywords-assessment" );
		analysisWorker.registerMessageHandler( "initialize", this.initialize.bind( this ), "used-keywords-assessment" );
	}

	initialize( options ) {
		this._plugin = new UsedKeywordsPlugin( analysisWorker, options );
		this._plugin.registerPlugin();
		this._initialized = true;
	}

	updateKeywordUsage( keywordUsage ) {
		if ( ! this._initialized ) {
			throw new Error( "UsedKeywordsAssessment must be initialized before keywords can be updated." );
		}

		// Clear worker paper cache to force new analysis.
		analysisWorker.refreshAssessment( "usedKeywords", "previouslyUsedKeywords" );
		this._plugin.updateKeywordUsage( keywordUsage );
	}
}

const keywordsAssessment = new UsedKeywordsAssessment();

keywordsAssessment.register();
