// In PR #10602 Pluggable is moved from YoastSEO.js to this path.
import Pluggable from "../pluggable";
import { measureTextWidth } from "../helpers/measureTextWidth"

/**
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 *
 * @returns {void}
 */
export function getData() {
	// Get the data from the store
	let rawData = window.YoastSEO.store.getState();

	// Add the custom data (Premium) to the raw data.
	if ( isArray( YoastSEO.app.customCallbacks ) ) {
		YoastSEO.app.customCallbacks.forEach( ( customCallback ) => {
			const customData = customCallback();

			rawData = merge( rawData, customData );
		} );
	}

	// Add snippet preview data
	if ( YoastSEO.app.hasSnippetPreview() ) {
		// Gets the data FOR the analyzer
		const dataSnippet = YoastSEO.app.snippetPreview.getAnalyzerData();

		rawData.rawData.metaTitle = dataSnippet.title;
		rawData.rawData.url = dataSnippet.url;
		rawData.rawData.meta = dataSnippet.metaDesc;
	}

	// Do the following two if all plugins are loaded: todo call refresh status here
	rawData.metaTitle = Pluggable._applyModifications( "data_page_title", rawData.metaTitle );
	rawData.meta = Pluggable._applyModifications( "data_meta_desc", rawData.meta );

	//Provide titleWidth and locale values
	rawData.titleWidth = measureTextWidth( rawData.metaTitle );
	rawData.locale = YoastSEO.app.config.locale;

	return rawData;
}