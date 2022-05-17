const robotsElement = document.querySelector( 'meta[name="robots"]' );
const metaElements = Array.from( document.querySelectorAll( ".yoast-seo-meta-tag" ) );

let metaTags = metaElements.map( function( el ) {
	if ( el.name ) {
		return { key: el.name, val: el.content };
	} else if ( el.getAttribute( "property" ) ) {
		return { key: el.getAttribute( "property" ), val: el.content };
	} else if ( el.nodeName === "LINK" ) {
		return { key: el.rel, val: el.href };
	}
} );

metaTags = [ { key: "title", val: document.title } ].concat( metaTags ).concat( [ { key: "robots", val: robotsElement.content } ] );

/**
 * Initial state
 */
const initialState = {
	loading: true,
	isEditable: window.wpseoScriptData.isEditable || false,
	focusKeyphrase: window.wpseoScriptData.indexable.primary_focus_keyword || "",
	seoScore: window.wpseoScriptData.indexable.primary_focus_keyword_score || "",
	readabilityScore: window.wpseoScriptData.indexable.readability_score || "",
	metaTags,
	schema: JSON.parse( document.querySelector( ".yoast-schema-graph" ).text || {} ),
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
	switch ( action.type ) {
		default:
			return state;
	}
};

export default frontendReducer;
