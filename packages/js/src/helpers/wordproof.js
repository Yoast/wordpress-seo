/* External dependencies */
import { get, debounce, noop, last } from "lodash";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState, useEffect, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

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
 * @returns {{ timestampHash: string }} Object of useful timestamp related state.
 */
export const useWordProofTimestamper = () => {
	const successNotice = __(
		"WordProof has successfully timestamped this page.",
		"wordpress-seo"
	);
	const errorNotice = __(
		"WordProof failed to timestamp this page. " +
		"Please check if you're correctly authenticated with WordProof and try to save this page again.",
		"wordpress-seo"
	);

	const [ timestampHash, setTimestampHash ] = useState( null );

	const isBlockEditor = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsBlockEditor(), [] );
	const isBlockEditorSavePost = useSelect( ( select ) => select( "core/editor" ).isSavingPost(), [] );
	const isBlockEditorAutoSavePost = useSelect( ( select ) => select( "core/editor" ).isAutosavingPost(), [] );
	const didBlockEditorPostSaveRequestSucceed = useSelect( ( select ) => select( "core/editor" ).didPostSaveRequestSucceed(), [] );

	const blockEditorNoticeActions = useDispatch( "core/notices" );

	const isElementorEditor = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsElementorEditor(), [] );

	const handleRequestTimeStamp = useCallback(
		debounce( async() => {
			// Request timestamp and update is timestamped in state.
			const success = await requestTimestamp();
			setTimestampHash( success );
		}, 500 ),
		[ requestTimestamp, setTimestampHash ]
	);

	// Add notices when is timestamped value changes.
	useEffect( () => {
		let createSuccessNotice = noop;
		let createErrorNotice = noop;

		// Assign callbacks for creating block editor notices.
		if ( isBlockEditor ) {
			( { createErrorNotice, createSuccessNotice } = blockEditorNoticeActions );
		}

		// Assign callbacks for creating Elementor editor notices.
		if ( isElementorEditor ) {
			// eslint-disable-next-line no-warning-comments
			// TODO: Assign success or error notice creator for Elementor based on timestamp.
			// How to create notifications in Elementer?
			createSuccessNotice = () => {};
			createErrorNotice = () => {};
		}

		// Only add notice if timestampHash is set.
		if ( timestampHash === null ) {
			return;
		}

		// Create the notice based on timestamp.
		if ( timestampHash ) {
			createSuccessNotice( successNotice );
		} else {
			createErrorNotice( errorNotice );
		}
	}, [ timestampHash ] );

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
	return { timestampHash };
};
