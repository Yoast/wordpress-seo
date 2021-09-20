import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * Hooks for using the marker.
 *
 * @returns {{handleMarkClick: function, markerId: string}} The markerId string and handleMarkClick function.
 */
export default function useMarker() {
	const markerId = useSelect( select => select( OPTIMIZE_STORE_KEY ).getMarkerId(), [] );
	const { setMarker, resetMarker } = useDispatch( OPTIMIZE_STORE_KEY );

	const handleMarkClick = useCallback( ( id, marks ) => {
		if ( id === markerId ) {
			return resetMarker();
		}
		setMarker( id, marks );
	}, [ markerId, setMarker, resetMarker ] );

	return {
		markerId,
		handleMarkClick,
	};
}
