import initializeWordProofTimestamper from "../../initializers/wordProofTimestamper";
import { registerElementorDataHookAfter } from "../../helpers/elementorHook";

/**
 * Registers the timestamp callback.
 *
 * @param {Function} callback The callback.
 *
 * @returns {void}
 */
function registerTimestampCallback( callback ) {
	registerElementorDataHookAfter( "document/save/save", "wordproof/timestamper", callback );
}


/**
 * Creates an elementor notice.
 *
 * @param {string} content The message content.
 *
 * @returns {void}
 */
function createNotice( content ) {
	window.elementor.notifications.showToast( {
		message: content,
	} );
}

/**
 * Initializes the WordProof integration.
 *
 * @returns {void}
 */
export default function initializeWordProofIntegration() {
	initializeWordProofTimestamper(
		registerTimestampCallback,
		createNotice,
		createNotice
	);
}
