import { debounce } from "lodash";

import { handleTimestampResponse, requestTimestamp } from "../helpers/wordproof";

/**
 * Initializes the worproof timestamper.
 *
 * @param {Function} registerTimestampCallback Function to register the timestamp callback
 * @param {Function} createSuccessNotice Function to display a success notice.
 * @param {Function} createErrorNotice Function to display an error notice.
 *
 * @returns {void}
 */
export default function initializeWordProofTimestamper( registerTimestampCallback, createSuccessNotice, createErrorNotice ) {
	const sendTimestampRequest = debounce( async() => {
		// Request timestamp and update is timestamped in state.
		const response = await requestTimestamp();
		handleTimestampResponse( response, createSuccessNotice, createErrorNotice );
	}, 500 );

	registerTimestampCallback( sendTimestampRequest );
}
