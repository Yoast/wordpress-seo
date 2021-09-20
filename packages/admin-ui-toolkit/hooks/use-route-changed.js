import { useEffect, useRef } from "@wordpress/element";
import { isEqual } from "lodash";
import { useLocation } from "react-router-dom";

/**
 * Hooks to dispatch a route changed action when the location changed.
 *
 * Depends on `useLocation` from `react-router-dom`.
 * Therefore, it needs to be used within that context.
 *
 * @param {function} handleRouteChanged The callback to call when the route has changed.
 *
 * @returns {void}
 */
export default function useRouteChanged( handleRouteChanged ) {
	const location = useLocation();
	const previousLocation = useRef();

	useEffect( () => {
		if ( isEqual( location.pathname, previousLocation.current ) ) {
			return;
		}

		// Update the location.
		previousLocation.current = location;
		handleRouteChanged( location );
	}, [ location, previousLocation ] );
}
