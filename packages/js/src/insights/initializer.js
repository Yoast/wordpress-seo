import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, get, noop } from "lodash";
import { Paper } from "yoastseo";
import createWatcher, { createCollector } from "../helpers/create-watcher";

/**
 * Retrieves whether the Insights are enabled.
 * @returns {boolean} Whether the Insights are enabled.
 */
const isInsightsEnabled = () => select( "yoast-seo/editor" ).getPreference( "isInsightsEnabled", false );

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { setEstimatedReadingTime, setFleschReadingEase, setWordCount } = dispatch( "yoast-seo/editor" );
	const runResearch = get( window, "YoastSEO.analysis.worker.runResearch", noop );

	/**
	 * Runs the researches and updates the results in the store.
	 * @returns {void}
	 */
	return ( [ content, locale ] ) => {
		const paper = new Paper( content, { locale: locale } );

		runResearch( "readingTime", paper ).then( response => setEstimatedReadingTime( response.result ) );
		runResearch( "getFleschReadingScore", paper ).then( response => setFleschReadingEase( response.result ) );
		runResearch( "wordCountInText", paper ).then( response => setWordCount( response.result ) );
	};
};

/**
 * Creates a subscriber.
 *
 * @returns {function} The subscriber.
 */
const createSubscriber = () => {
	const { getEditorDataContent, getContentLocale } = select( "yoast-seo/editor" );
	const collector = createCollector( getEditorDataContent, getContentLocale );
	const updater = createUpdater();

	// Force an initial update after 1.5 seconds.
	setTimeout( () => updater( collector() ), 1500 );

	return createWatcher( collector, updater );
};

/**
 * Initializes the Insights.
 * @returns {function} The un-subscriber.
 */
const initialize = () => {
	// Check if this feature is enabled.
	if ( ! isInsightsEnabled() ) {
		return;
	}

	// Load the initial estimated reading time from the hidden fields into the store.
	dispatch( "yoast-seo/editor" ).loadEstimatedReadingTime();

	// Delays execution by 1.5 seconds for any change, forces execution after 3 seconds.
	return subscribe( debounce( createSubscriber() ), 1500, { maxWait: 3000 } );
};

export default initialize;
