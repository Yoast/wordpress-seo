import { useCallback, useEffect } from "@wordpress/element";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BeforeUnloadEvent
 * @param {boolean} when When the before unload should be active.
 * @param {string|boolean} [message] The message to try to get the browser to show.
 * @returns {void}
 */
const useBeforeUnload = ( when, message = true ) => {
	const handleBeforeUnload = useCallback( event => {
		( event || window.event ).returnValue = message;
		return message;
	}, [ message ] );

	useEffect( () => {
		if ( when ) {
			window.addEventListener( "beforeunload", handleBeforeUnload );
		}

		return () => window.removeEventListener( "beforeunload", handleBeforeUnload );
	}, [ when, handleBeforeUnload ] );
};

export default useBeforeUnload;
