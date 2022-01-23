/* External dependencies */
import { get, debounce, noop, last } from "lodash";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState, useEffect, useCallback } from "@wordpress/element";
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
 * Timestamps the current post on save if WordProof integration is active.
 *
 * @returns {{ timestampResponse: string }} Object of useful timestamp related state.
 */
export const useWordProofTimestamper = () => {
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

	const [ timestampResponse, setTimestampResponse ] = useState( null );

	const isBlockEditor = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsBlockEditor(), [] );

	// eslint-disable-next-line no-warning-comments
	// TODO: Elementor throws error while selecting these stores.
	const isBlockEditorSavePost = useSelect( ( select ) => select( "core/editor" ).isSavingPost(), [] );
	const isBlockEditorAutoSavePost = useSelect( ( select ) => select( "core/editor" ).isAutosavingPost(), [] );
	const didBlockEditorPostSaveRequestSucceed = useSelect( ( select ) => select( "core/editor" ).didPostSaveRequestSucceed(), [] );

	const blockEditorNoticeActions = useDispatch( "core/notices" );

	const isElementorEditor = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsElementorEditor(), [] );

	const handleRequestTimeStamp = useCallback(
		debounce( async() => {
			// Request timestamp and update is timestamped in state.
			const success = await requestTimestamp();
			setTimestampResponse( success );
		}, 500 ),
		[ requestTimestamp, setTimestampResponse ]
	);

	// Add notices when is timestamped value changes.
	useEffect( () => {
		let createSuccessNotice = noop;
		let createErrorNotice = noop;

		// Assign callbacks for creating Elementor editor notices.
		// With the Elementor editor opened, both isElementorEditor and isBlockEditor return true.
		if ( isElementorEditor ) {
			// eslint-disable-next-line no-warning-comments
			// TODO: Assign success or error notice creator for Elementor based on timestamp.
			createSuccessNotice = ( notice ) => {
				console.warn( notice );
			};
			createErrorNotice = ( notice ) => {
				console.warn( notice );
			};
		} else if ( isBlockEditor ) {
			// Assign callbacks for creating block editor notices.
			( { createErrorNotice, createSuccessNotice } = blockEditorNoticeActions );
		}

		// Only add notice if timestampResponse is set.
		if ( timestampResponse === null ) {
			return;
		}

		// Create the notice based on timestamp.
		if ( timestampResponse ) {
			if ( timestampResponse.balance === 0 ) {
				createErrorNotice( noBalanceNotice );
			} else {
				createSuccessNotice( successNotice );
			}
		} else {
			createErrorNotice( errorNotice );
		}
	}, [ timestampResponse ] );

	// Subscribe to Block editor post save.
	useEffect( () => {
		// eslint-disable-next-line no-warning-comments
		// TODO: This effect also fires on first mount, causing a timestamp to be requested on page load.
		if ( isBlockEditorSavePost && didBlockEditorPostSaveRequestSucceed && ! isBlockEditorAutoSavePost ) {
			handleRequestTimeStamp();
		}
	}, [ isBlockEditorSavePost, isBlockEditorAutoSavePost, didBlockEditorPostSaveRequestSucceed ] );

	// Subscribe to Elementor editor post save.
	if ( isElementorEditor ) {
		// eslint-disable-next-line no-warning-comments
		// TODO: Importing this function results in a
		// RegisterElementorDataHookAfter( "document/save/save", "wordproof/timestamper", handleRequestTimeStamp );
	}

	// Return useful state.
	return { timestampResponse };
};
