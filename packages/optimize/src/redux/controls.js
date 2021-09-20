import { noop } from "lodash";
import { GET_DETAIL, HANDLE_QUERY, HANDLE_ROUTE_CHANGED, HANDLE_SAVE, RUN_ANALYSIS, RUN_RELATED_KEYPHRASE_ANALYSIS, RUN_RESEARCH } from "./constants";

/**
 * Creates controls.
 *
 * @param {Object} controls The functions to create controls from.
 * @param {function} controls.handleQuery The function to handle query changes.
 * @param {function} controls.handleSave The function to handle saving data.
 * @param {function} controls.handleRouteChanged The function to handle when the route changed.
 * @param {function} controls.getDetail The function to get detail data.
 * @param {function} controls.runAnalysis The function to run an analysis.
 * @param {function} controls.runRelatedKeyphraseAnalysis The function to run an analysis on the related keyphrases.
 * @param {function} controls.runResearch The function to run a research.
 *
 * @returns {Object} The controls.
 */
const createControls = ( {
	handleQuery = noop,
	handleSave = noop,
	handleRouteChanged = noop,
	getDetail = noop,
	runAnalysis = noop,
	runRelatedKeyphraseAnalysis = noop,
	runResearch = noop,
} = {} ) => ( {
	[ HANDLE_QUERY ]: async ( { payload } ) => handleQuery( payload ),
	[ HANDLE_SAVE ]: async ( { payload } ) => handleSave( payload.data, payload.options ),
	[ HANDLE_ROUTE_CHANGED ]: async ( { payload } ) => handleRouteChanged( payload ),
	[ GET_DETAIL ]: async ( { payload } ) => getDetail( payload ),
	[ RUN_ANALYSIS ]: async ( { payload } ) => runAnalysis( payload ),
	[ RUN_RELATED_KEYPHRASE_ANALYSIS ]: async ( { payload } ) => runRelatedKeyphraseAnalysis( payload ),
	[ RUN_RESEARCH ]: async ( { payload } ) => runResearch( payload ),
} );

export default createControls;
