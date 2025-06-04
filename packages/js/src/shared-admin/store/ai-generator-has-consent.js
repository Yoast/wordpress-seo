import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";

export const HAS_AI_GENERATOR_CONSENT_NAME = "hasConsent";

const STORE_AI_GENERATOR_CONSENT_ACTION_NAME = `${ HAS_AI_GENERATOR_CONSENT_NAME }/storeConsent`;

/**
 * Generates the action chain for giving consent.
 *
 * @param {boolean} consent Whether the user has given consent.
 * @param {string} endpoint The endpoint to save the consent.
 *
 * @returns {Generator<{type: string}>} The current action object.
 */
function* storeAiGeneratorConsent( { consent, endpoint } ) {
	try {
		// Trigger the control flow.
		yield{ type: STORE_AI_GENERATOR_CONSENT_ACTION_NAME, payload: { consent, endpoint } };
	} catch ( e ) {
		// Ignore the error, the user will just get the question again next time.
		return false;
	}
	// Update the store right away, there is no need to wait on the request.
	yield{ type: `${ HAS_AI_GENERATOR_CONSENT_NAME }/giveAiGeneratorConsent`, payload: consent };
	return true;
}

const slice = createSlice( {
	name: HAS_AI_GENERATOR_CONSENT_NAME,
	initialState: {
		hasConsent: false,
		endpoint: "yoast/v1/ai_generator/consent",
	},
	reducers: {
		giveAiGeneratorConsent: ( state, { payload } ) => {
			state.hasConsent = payload;
		},
		setAiGeneratorConsentEndpoint: ( state, { payload } ) => {
			state.endpoint = payload;
		},
	},
} );

export const getInitialHasAiGeneratorConsentState = slice.getInitialState;

export const hasAiGeneratorConsentSelectors = {
	selectHasAiGeneratorConsent: state => get( state, [ HAS_AI_GENERATOR_CONSENT_NAME, "hasConsent" ], slice.getInitialState().hasConsent ),
	selectAiGeneratorConsentEndpoint: state => get( state, [ HAS_AI_GENERATOR_CONSENT_NAME, "endpoint" ], slice.getInitialState().endpoint ),
};

export const hasAiGeneratorConsentActions = {
	...slice.actions,
	storeAiGeneratorConsent,
};

export const hasAiGeneratorConsentControls = {
	[ STORE_AI_GENERATOR_CONSENT_ACTION_NAME ]: async( { payload } ) => {
		return await apiFetch( {
			path: payload.endpoint,
			method: "POST",
			data: { consent: payload.consent },
			parse: false,
		} );
	},
};

export const hasAiGeneratorConsentReducer = slice.reducer;
