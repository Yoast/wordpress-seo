( function( $ ) {
	// Set the yoast-tooltips on the list table links columns that have links.
	$( ".yoast-column-header-has-tooltip" ).each( function() {
		var parentLink = $( this ).closest( "th" ).find( "a" );

		parentLink
			.addClass( "yoast-tooltip yoast-tooltip-alt yoast-tooltip-n yoast-tooltip-multiline" )
			.attr( "data-label", $( this ).data( "tooltip-text" ) )
			.attr( "aria-label", $( this ).text() );
	} );
}( jQuery ) );
