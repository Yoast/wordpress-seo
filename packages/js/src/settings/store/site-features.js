import { createSlice } from "@reduxjs/toolkit";
import { get, forEach, every } from "lodash";

export const SITE_FEATURES_NAME = "siteFeatures";

/**
 * @returns {Object} The initial state.
 */
export const createInitialSiteFeaturesState = () => ( {
	isAllFeaturesOpen: true,
	featuresSections: {
		"ai-tools": { isOpen: true },
		"content-optimization": { isOpen: true },
		"site-structure": { isOpen: true },
		"technical-seo": { isOpen: true },
	},
} );

const slice = createSlice( {
	name: SITE_FEATURES_NAME,
	initialState: createInitialSiteFeaturesState(),
	reducers: {
		toggleFeatureSection: ( state, action ) => {
			state.featuresSections[ action.payload ].isOpen = ! state.featuresSections[ action.payload ].isOpen;

			// if all features are closed, set isAllOpen to false
			const allClosed = every( state.featuresSections, section => section.isOpen === false );
			if ( allClosed ) {
				state.isAllFeaturesOpen = false;
			}
			// if all features are open, set isAllFeaturesOpen to true
			const allOpen = every( state.featuresSections, section => section.isOpen === true );
			if ( allOpen ) {
				state.isAllFeaturesOpen = true;
			}
		},
		toggleAllFeatures: ( state ) => {
			forEach( state.featuresSections, ( section ) => {
				section.isOpen = ! state.isAllFeaturesOpen;
			} );
			state.isAllFeaturesOpen = ! state.isAllFeaturesOpen;
		},
	},
} );

export const siteFeaturesSelectors = {
	selectIsSiteFeatureOpen: ( state, featureId ) => get( state, [ SITE_FEATURES_NAME, "featuresSections", featureId, "isOpen" ], false ),
	selectIsAllFeaturesOpen: ( state ) => get( state, [ SITE_FEATURES_NAME, "isAllFeaturesOpen" ], false ),
};

export const siteFeaturesActions = slice.actions;

export default slice.reducer;
