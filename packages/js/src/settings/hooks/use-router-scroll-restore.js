import { useEffect } from "@wordpress/element";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll into view for React Router DOM with hash routes.
 * @returns {void}
 */
const useHashRouterScrollIntoView = () => {
	const { hash, pathname } = useLocation();

	useEffect( () => {
		// Auto-scroll to hash or root element.
		const target = hash ? document.getElementById( hash.replace( "#", "" ) ) : document.getElementById( "yoast-seo-settings" );

		if ( target ) {
			target.scrollIntoView( { behavior: "smooth" } );
		}
	}, [ pathname, hash ] );
};

export default useHashRouterScrollIntoView;
