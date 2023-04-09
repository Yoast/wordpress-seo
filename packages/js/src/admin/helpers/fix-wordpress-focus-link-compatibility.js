import { forceFocus } from "./index";

/**
 * Fixes the WordPress skip links.
 *
 * By disabling the default behavior of the links and focusing the elements.
 *
 * @returns {void}
 */
const fixWordPressFocusLinkCompatibility = () => {
	[ "wpbody-content", "wp-toolbar" ].forEach( id => {
		document.querySelector( `[href="#${ id }"]` )?.addEventListener( "click", e => {
			e.preventDefault();
			forceFocus( document.getElementById( id ) );
		} );
	} );
};

export default fixWordPressFocusLinkCompatibility;
