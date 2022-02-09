import { useEffect } from "@wordpress/element";
import WordProofTimestamper from "../../components/WordProofTimestamper";

import { registerElementorDataHookAfter } from "../../helpers/elementorHook";

/**
 * Registers the timestamp callback.
 *
 * @param {Function} callback The callback.
 *
 * @returns {void}
 */
function useTimestampCallback( callback ) {
	useEffect( () => {
		registerElementorDataHookAfter( "document/save/save", "wordproof/timestamper", callback );
	}, [ callback ] );
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
 * WordProof timestamper component for the elementor.
 *
 * @returns {null} Returns null.
 */
export default function WordProofElementorTimestamper() {
	return <WordProofTimestamper
		createErrorNotice={ createNotice }
		createSuccessNotice={ createNotice }
		useTimestampCallback={ useTimestampCallback }
	/>;
}
