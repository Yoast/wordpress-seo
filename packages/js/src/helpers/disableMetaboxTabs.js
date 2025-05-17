/**
 * Disables a metabox tab.
 *
 * @param {string} tabId The id of the tab to disable.
 *
 * @returns {void}
 */
function disable( tabId ) {
	const tab = document.querySelector( `#${ tabId }` );
	if ( tab === null ) {
		return;
	}

	tab.style.opacity = "0.5";
	tab.style.pointerEvents = "none";
	tab.setAttribute( "aria-disabled", "true" );

	if ( tab.classList.contains( "yoast-active-tab" ) ) {
		tab.classList.remove( "yoast-active-tab" );
	}
}

/**
 * Disables the metabox tabs.
 *
 * @returns {void}
 */
export function disableMetaboxTabs() {
	document.querySelectorAll( '[id^="wpseo-meta-tab-"]' ).forEach( ( tab ) => {
		disable( tab.id );
	} );
}

