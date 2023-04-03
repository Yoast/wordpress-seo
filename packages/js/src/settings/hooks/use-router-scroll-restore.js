import { useEffect } from "@wordpress/element";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll into view for React Router DOM with hash routes.
 * @param {string} rootId The ID of the element to scroll to when no route target matched.
 * @returns {void}
 */
const useRouterScrollRestore = ( rootId = "yoast-seo-settings" ) => {
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
			const root = document.getElementById( rootId );
			root?.scrollIntoView( { behavior: "smooth" } );
		}
	}, [ pathname, hash, key ] );
};

export default useRouterScrollRestore;
