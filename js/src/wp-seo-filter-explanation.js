/* global yoastFilterExplanation */

( function( $ ) {
	$( "#posts-filter .tablenav.top" ).after(
		`<div class="notice notice-info inline wpseo-filter-explanation"><p class="dashicons-before dashicons-lightbulb">${ yoastFilterExplanation.text }</p></div>`
	);
}( jQuery ) );
