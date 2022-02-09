import { useCallback, useEffect, useState } from "@wordpress/element";
import { debounce } from "lodash";

import { handleTimestampResponse, requestTimestamp, useWordProofTimestamper } from "../helpers/wordproof";

/**
 * WordProof timestamper component that implements the useWordProofTimestamper hook
 * for timestamping posts on save.
 * This is a separate component because hooks can not be conditionally rendered while components can.
 *
 * @returns {null} Nothing.
 */
const WordProofTimestamper = ( { createSuccessNotice, createErrorNotice, useTimestampCallback } ) => {
	const [ timestampResponse, setTimestampResponse ] = useState( null );
	useWordProofTimestamper();

	const sendTimestampRequest = useCallback(
		debounce( async() => {
			// Request timestamp and update is timestamped in state.
			const success = await requestTimestamp();
			setTimestampResponse( success );
		}, 500 ),
		[ requestTimestamp, setTimestampResponse ]
	);

	useEffect( () => {
		handleTimestampResponse( timestampResponse, createSuccessNotice, createErrorNotice );
	}, [ timestampResponse ] );

	useTimestampCallback( sendTimestampRequest );

	return null;
};

export default WordProofTimestamper;
