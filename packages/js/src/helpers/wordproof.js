/* External dependencies */
import { get, last } from "lodash";
import { __, sprintf } from "@wordpress/i18n";

/* Internal dependencies */
import getL10nObject from "../analysis/getL10nObject";
import { callEndpoint, handleAPIResponse } from "./api";
// Import { registerElementorDataHookAfter } from "./elementorHook";

const WORDPROOF_REST_API_NAMESPACE = "wordproof/v1";

/**
 * @param {string} prop Prop to get from WordProof SDK data.
 * @returns {Object|*} All WordProof SDK data or a single prop from that data.
 */
export const getWordProofSdkData = ( prop ) => get( window, `wordproofSdk.data${ prop ? `.${prop}` : "" }`, {} );

/**
 * Returns whether or not the WordProof integration is active.
 *
 * @returns {boolean} Whether or not the WordProof integration is active.
 */
export const isWordProofIntegrationActive = () => {
	const l10nObject = getL10nObject();
	return get( l10nObject, "wordproofIntegrationActive", 0 ) === 1;
};

/**
 * Retrieves WordProof settings.
 *
 * @returns {Promise<Object|boolean>} The response object or false if request fails.
 */
export const fetchSettings = async() => {
	return await handleAPIResponse(
		async() => callEndpoint( {
			path: `${WORDPROOF_REST_API_NAMESPACE}/settings`,
			method: "GET",
		} ),
		( response ) => response,
		() => false
	);
};

/**
 * Retrieves WordProof authentication status.
 *
 * @returns {Promise<boolean>} The authentication status.
 */
export const fetchIsAuthenticated = async() => {
	return await handleAPIResponse(
		async() => callEndpoint( {
			path: `${WORDPROOF_REST_API_NAMESPACE}/authentication`,
			method: "GET",
		} ),
		// eslint-disable-next-line camelcase
		( { is_authenticated } ) => is_authenticated,
		() => false
	);
};

/**
 * Return the site settings data
 *
 * @returns {Promise<Object>} The promise wrapping the response object.
 */
export const requestTimestamp = async() => {
	const timestampUrl = getWordProofSdkData( "timestamp_url" );
	const timestampEndpoint = last( timestampUrl.split( WORDPROOF_REST_API_NAMESPACE ) );

	console.warn( "timestampEndpoint", timestampEndpoint );

	return callEndpoint( {
		path: WORDPROOF_REST_API_NAMESPACE + timestampEndpoint,
		method: "POST",
	} );
};

/**
 * Handles a WordProof timestamp response.
 *
 * @param {Object} timestampResponse The timestamp response.
 * @param {Function} createSuccessNotice Function to create a success notice.
 * @param {Function} createErrorNotice Function to create an error notice.
 *
 * @returns {void}
 */
export function handleTimestampResponse( timestampResponse, createSuccessNotice, createErrorNotice ) {
	const successNotice = sprintf(
		/** Translators: %s expands to WordProof */
		__(
			"%s has successfully timestamped this page.",
			"wordpress-seo"
		), "WordProof" );
	const errorNotice = sprintf(
		/** Translators: %s expands to WordProof */
		__(
			"%s failed to timestamp this page. " +
		"Please check if you're correctly authenticated with WordProof and try to save this page again.",
			"wordpress-seo"
		), "WordProof" );
	const noBalanceNotice = sprintf(
		/** Translators: %s expands to WordProof */
		__(
			"You are out of timestamps. Please upgrade your account by opening the %s settings.",
			"wordpress-seo"
		), "WordProof" );

	const successNoticeOptions = { type: "snackbar", id: "wordproof-timestamp-notice" };
	const errorNoticeOptions = { id: "wordproof-timestamp-notice" };

	// Create the notice based on timestamp.
	if ( timestampResponse ) {
		if ( timestampResponse.balance === 0 ) {
			createErrorNotice( noBalanceNotice, errorNoticeOptions );
		} else {
			createSuccessNotice( successNotice, successNoticeOptions );
		}
	} else {
		createErrorNotice( errorNotice, errorNoticeOptions );
	}
}
