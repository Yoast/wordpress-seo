import { dispatch, select, subscribe } from "@wordpress/data";

import initializeWordProofTimestamper from "./wordProofTimestamper";


/**
 * Registers the timestamp callback.
 *
 * @param {Function} callback The callback.
 *
 * @returns {void}
 */
function registerTimestampCallback( callback ) {
	subscribe( () => {
		const isSavingPost = select( "core/editor" ).isSavingPost();
		const isAutosavingPost = select( "core/editor" ).isAutosavingPost();
		const didPostSaveRequestSucceed = select( "core/editor" ).didPostSaveRequestSucceed();

		if ( isSavingPost && didPostSaveRequestSucceed && ! isAutosavingPost ) {
			callback();
			return;
		}
	} );
}

/**
 * Initializes the WordProof integration.
 *
 * @returns {void}
 */
export default function initializeWordProofIntegration() {
	const { createSuccessNotice, createErrorNotice } = dispatch( "core/notices" );

	initializeWordProofTimestamper(
		registerTimestampCallback,
		createSuccessNotice,
		createErrorNotice
	);
}
