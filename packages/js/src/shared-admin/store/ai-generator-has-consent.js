import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";

export const HAS_AI_GENERATOR_CONSENT_NAME = "hasConsent";

const STORE_AI_GENERATOR_CONSENT_ACTION_NAME = `${ HAS_AI_GENERATOR_CONSENT_NAME }/storeConsent`;

/**
 * Generates the action chain for giving consent.
 *
 * @param {boolean} consent Whether the user has given consent.
 * @returns {Generator<{type: string}>} The current action object.
 */
function* storeAiGeneratorConsent( consent ) {
	try {
		// Trigger the control flow.
		yield { type: STORE_AI_GENERATOR_CONSENT_ACTION_NAME, payload: consent };
	} catch ( e ) {
		// Ignore the error, the user will just get the question again next time.
		return false;
	}
	// Update the store right away, there is no need to wait on the request.
	yield { type: `${ HAS_AI_GENERATOR_CONSENT_NAME }/giveAiGeneratorConsent`, payload: consent };
	return true;
}

const slice = createSlice( {
	name: HAS_AI_GENERATOR_CONSENT_NAME,
	initialState: false,
	reducers: {
		giveAiGeneratorConsent: ( state, { payload } ) => payload,
	},
} );

export const getInitialHasAiGeneratorConsentState = slice.getInitialState;

export const hasAiGeneratorConsentSelectors = {
	selectHasAiGeneratorConsent: state => get( state, HAS_AI_GENERATOR_CONSENT_NAME, false ),
};

export const hasAiGeneratorConsentActions = {
	...slice.actions,
	storeAiGeneratorConsent,
};

export const hasAiGeneratorConsentControls = {
	[ STORE_AI_GENERATOR_CONSENT_ACTION_NAME ]: async ( { payload } ) => {
		const response = await apiFetch( {
			path: "yoast/v1/ai_generator/consent",
			method: "POST",
			data: { consent: payload },
			parse: false,
		} );
		return response;
	},
};

export const hasAiGeneratorConsentReducer = slice.reducer;
