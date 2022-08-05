import { useEffect } from "@wordpress/element";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll into view for React Router DOM with hash routes.
 * @returns {void}
 */
const useHashRouterScrollIntoView = () => {
	const { hash, pathname } = useLocation();

	useEffect( () => {
		if ( ! hash ) {
			window.scrollTo( 0, 0 );
			return;
		}

		const element = document.getElementById( hash.replace( "#", "" ) );
		if ( element ) {
			element.scrollIntoView( { behavior: "smooth" } );
		}
	}, [ pathname, hash ] );
};

export default useHashRouterScrollIntoView;
