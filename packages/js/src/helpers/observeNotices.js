import { dispatch } from "@wordpress/data";
import { STORE_NAME } from "../general/constants";

/**
 * Observes the dismissible notices and resolves them when they are dismissed.
 * @param {Array} notices The notices to attach dismiss handlers to.
 * @returns {MutationObserver[]} The observers for the dismissible notices.
 */
export const observeNotices = ( notices ) => {
	const { resolveNotice } = dispatch( STORE_NAME );
	const observers = [];

	notices
		.filter( ( notice ) => notice.isDismissable === true )
		.map( ( notice ) => {
			const dismissibleNotice = document.getElementById( notice.id );
			if ( dismissibleNotice ) {
				/**
				 * Resolves the notice when it is dismissed.
				 * @param {MutationRecord[]} mutationsList The list of mutations associated with the dismissible notice.
				 *
				 * @returns {void}
				 */
				const resolveDismissedNotice = ( mutationsList ) => {
					for ( const mutation of mutationsList ) {
						if ( mutation.type === "attributes" && mutation.attributeName === "style" && dismissibleNotice.style.display === "none" ) {
							resolveNotice( notice.id );
						}
					}
				};
				const observer = new MutationObserver( resolveDismissedNotice );
				observer.observe( dismissibleNotice, { attributes: true } );
				observers.push( observer );
			}
		} );
	return observers;
};

/**
 * Disconnects all MutationObserver instances.
 * @param {MutationObserver[]} observers The list of MutationObserver instances.
 * @returns {void}
 */
export const disconnectObservers = ( observers ) => {
	observers.forEach( ( observer ) => observer.disconnect() );
};
