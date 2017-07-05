( function( $ ) {
	// Set the yoast-tooltips on the list table links columns.
	$( ".yoast-column-header-has-tooltip" ).each( function() {
		var parentLink = $( this ).closest( "a" );

		parentLink
			.addClass( "yoast-tooltip yoast-tooltip-n yoast-tooltip-multiline" )
			.attr( "aria-label", $( this ).data( "label" ) );
	})
	// Clean up the HTML for the links columns title in the Screen Options.
	$( "#screen-meta .yoast-column-header-has-tooltip" ).each( function() {
		var text = $( this ).text();
		$( this ).replaceWith( text );
	});
}( jQuery ) );
