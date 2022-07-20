import { useEffect } from "@wordpress/element";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll into view for React Router DOM with hash routes.
 * @returns {void}
 */
const useHashRouterScrollIntoView = () => {
	const location = useLocation();

	useEffect( () => {
		if ( ! location.hash ) {
			return;
		}

		setTimeout( () => {
			const element = document.getElementById( location.hash.replace( "#", "" ) );
			if ( element ) {
				element.scrollIntoView();
			}
		}, 100 );
	}, [ location ] );
};

export default useHashRouterScrollIntoView;
