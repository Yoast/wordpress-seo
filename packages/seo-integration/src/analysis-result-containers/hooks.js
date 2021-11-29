import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { SEO_STORE_NAME } from "@yoast/seo-store";

/**
 * Provides the marker props.
 *
 * @returns {{handleMarkClick: function, markerId: string}} The markerId string and handleMarkClick function.
 */
export const useMarker = () => {
	const markerId = useSelect( select => select( SEO_STORE_NAME ).selectActiveMarkerId() );
	const { setMarker, resetMarker } = useDispatch( SEO_STORE_NAME );

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
};
