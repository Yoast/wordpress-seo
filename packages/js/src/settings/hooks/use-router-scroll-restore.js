import { useEffect } from "@wordpress/element";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll into view for React Router DOM with hash routes.
 * @returns {void}
 */
const useRouterScrollRestore = () => {
	const { hash, pathname } = useLocation();

	useEffect( () => {
		// Auto-scroll to hash or root element.
		const target = document.getElementById( hash.replace( "#", "" ) );

		if ( target ) {
			window.scrollTo( {
				top: ( target.getBoundingClientRect().top + window.scrollY ) - 96,
				behavior: "smooth",
			} );
			// Try to add focus to target after scrolling is done.
			setTimeout( () => target.focus(), 1000 );
		} else {
			const root = document.getElementById( "yoast-seo-settings" );
			root?.scrollIntoView( { behavior: "smooth" } );
		}
	}, [ pathname, hash ] );
};

export default useRouterScrollRestore;
