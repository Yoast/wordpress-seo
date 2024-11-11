/* global ajaxurl */
import { dispatch } from "@wordpress/data";
import { STORE_NAME } from "../general/constants";

/**
 * Attaches dismiss handlers to the dismissible notices.
 * @param {Array} notices The notices to attach dismiss handlers to.
 * @returns {void}
 */
export const attachDismissHandlers = ( notices ) => {
	const { resolveNotice } = dispatch( STORE_NAME );

	notices
		.filter( ( notice ) => notice.isDismissable === true )
		.map( ( notice ) => {
			const NoticeCloseButton = document.querySelector( `#${notice.id} .notice-dismiss` );
			if ( NoticeCloseButton ) {
				NoticeCloseButton.addEventListener( "click", () => {
					resolveNotice( notice.id );
					fetch( ajaxurl, {
						method: "POST",
						body: new URLSearchParams( {
							action: ( notice.id ).replace( /^yoast/, "dismiss" ).replace( /-/g, "_" ),
						} ),
					} );
				} );
			}
		} );
};
