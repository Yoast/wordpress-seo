import { useEffect } from "react";

/**
 * @param {EventListener} onKeydown The keydown event listener.
 * @param {EventTarget} eventTarget The target to listen on. E.g. document or window or an element.
 * @returns {void}
 */
export const useKeydown = ( onKeydown, eventTarget ) => {
	useEffect( () => {
		eventTarget.addEventListener( "keydown", onKeydown );
		return () => {
			eventTarget.removeEventListener( "keydown", onKeydown );
		};
	}, [ onKeydown ] );
};
