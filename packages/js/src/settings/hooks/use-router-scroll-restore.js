import { useEffect } from "@wordpress/element";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll into view for React Router DOM with hash routes.
 * @returns {void}
 */
const useRouterScrollRestore = () => {
	const { hash, pathname, key } = useLocation();

	useEffect( () => {
		// Auto-scroll to hash or root element.
		const targetId = hash.replace( "#", "" );
		const target = document.getElementById( targetId ) || document.querySelector( `[data-id="${ targetId }"]` );

		if ( target ) {
			target.scrollIntoView( { behavior: "smooth" } );
			// Try to add focus to target after scrolling is done.
			setTimeout( () => target.focus(), 800 );
		} else {
			const root = document.getElementById( "yoast-seo-settings" );
			root?.scrollIntoView( { behavior: "smooth" } );
		}
	}, [ pathname, hash, key ] );
};

export default useRouterScrollRestore;
