
const metaDescriptionElement = document.querySelector('meta[name="description"]');
const metaDescription = metaDescriptionElement && metaDescriptionElement.content || "";

const canonicalElement = document.querySelector('link[rel="canonical"]');
const canonical = canonicalElement && canonicalElement.href || "";

const robotsElement = document.querySelector('meta[name="robots"]');
const robots = robotsElement && robotsElement.content || "";

/**
 * Initial state
 */
const initialState = {
	loading: true,
	title: document.title,
	metaDescription,
	canonical,
	robots,
	focusKeyphrase: window.wpseoScriptData.indexable.primary_focus_keyword || "",
	seoScore: window.wpseoScriptData.indexable.primary_focus_keyword_score || "",
	readabilityScore: window.wpseoScriptData.indexable.readability_score || "",
	schema: window.wpseoScriptData.head.schema,
	analysisTools: window.wpseoScriptData.analysisTools,
	links: {
		incoming: window.wpseoScriptData.incomingInternalLinks || [],
		outgoing: window.wpseoScriptData.outgoingInternalLinks || [],
	}
};

/* eslint-disable complexity */
/**
 * A reducer for the frontend inspector.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated frontend object.
 */
const frontendReducer = ( state = initialState, action ) => {
	// Some boilerplate. Tip: Look at other reducers when implementing first actions.
	// const newState = cloneDeep( state );
	switch ( action.type ) {
		default:
			return state;
	}
};

export default frontendReducer;
