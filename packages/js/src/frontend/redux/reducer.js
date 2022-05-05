import { cloneDeep } from "lodash";
import { ADD_LINKS } from "./actions";

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
	focusKeyphrase: "",
	seoScore: "",
	readabilityScore: "",
	links: {
		incoming: [],
		outgoing: [],
	}
};

/* eslint-disable complexity */
/**
 * A reducer for the SEO workouts.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated workouts object.
 */
const frontendReducer = ( state = initialState, action ) => {
	const newState = cloneDeep( state );
	switch ( action.type ) {
		case ADD_LINKS:
			newState.links = action.links;
			return newState;
		default:
			return state;
	}
};

export default frontendReducer;
