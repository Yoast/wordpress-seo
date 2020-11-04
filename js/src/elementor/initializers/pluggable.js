import { dispatch } from "@wordpress/data";
import Pluggable from "../../lib/Pluggable";

function applyAnalysisModifications( pluggable, analysisData ) {
	const data = { ...analysisData };

	if ( pluggable.loaded ) {
		data.title = pluggable._applyModifications( "data_page_title", data.title );
		data.title = pluggable._applyModifications( "title", data.title );
		data.description = pluggable._applyModifications( "data_meta_desc", data.description );
		data.text = pluggable._applyModifications( "content", data.text );
	}

	return data;
}

/**
 * Initializes the analysis pluggable.
 *
 * @returns {Object} The pluggable API.
 */
export default function initPluggable() {
	const refresh = dispatch( "yoast-seo/editor" ).refreshAnalysisDataTimestamp;
	const pluggable = new Pluggable( refresh );

	return {
		pluginReady: pluggable._ready,
		pluginReloaded: pluggable._reloaded,
		registerModification: pluggable._registerModification,
		registerPlugin: pluggable._registerPlugin,
		applyAnalysisModifications: applyAnalysisModifications.bind( null, pluggable ),
	};
};
