import { _n, sprintf } from "@wordpress/i18n";

/**
 * Update the text content of an element if it exists.
 * @param {HTMLElement} root The root element.
 * @param {string} selector The selector.
 * @param {string} text The text.
 * @returns {HTMLElement|null} The element or null.
 */
const updateTextContentIfElementExists = ( root, selector, text ) => {
	const element = root.querySelector( selector );
	if ( element ) {
		element.textContent = text;
	}
	return element;
};

/**
 * Update the notification total in the Yoast SEO menu and the admin bar badges.
 * @param {number} total The total number of notifications.
 * @returns {void}
 */
export const updateNotificationsCount = ( total ) => {
	// Note: these translation is the same as on the server side.
	/* translators: Hidden accessibility text; %s: number of notifications. */
	const screenReaderText = sprintf( _n( "%s notification", "%s notifications", total, "wordpress-seo" ), total );

	const menuItems = document.querySelectorAll( "#toplevel_page_wpseo_dashboard .update-plugins" );
	for ( const menuItem of menuItems ) {
		menuItem.className = `update-plugins count-${ total }`;
		updateTextContentIfElementExists( menuItem, ".plugin-count", String( total ) );
		updateTextContentIfElementExists( menuItem, ".screen-reader-text", screenReaderText );
	}

	const adminBarItems = document.querySelectorAll( "#wp-admin-bar-wpseo-menu .yoast-issue-counter" );
	for ( const adminBar of adminBarItems ) {
		adminBar.classList.toggle( "wpseo-no-adminbar-notifications", total === 0 );
		updateTextContentIfElementExists( adminBar, ".yoast-issues-count", String( total ) );
		updateTextContentIfElementExists( adminBar, ".screen-reader-text", screenReaderText );
	}
};
