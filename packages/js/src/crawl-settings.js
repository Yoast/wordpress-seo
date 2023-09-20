jQuery( document ).ready( function() {
	jQuery( "#allow_search_cleanup input[type='radio']" ).on( "change", function() {
		if ( jQuery( "#allow_search_cleanup input[type='radio']:checked" ).val() === "on" ) {
			jQuery( "#allow_search_cleanup_emoji" ).prop( "disabled", false );
			jQuery( "#allow_search_cleanup_patterns" ).prop( "disabled", false );
		} else {
			jQuery( "#allow_search_cleanup_emoji" ).prop( "disabled", true );
			jQuery( "#allow_search_cleanup_patterns" ).prop( "disabled", true );
			jQuery( "#allow_search_cleanup_emoji-off" ).prop( "checked", true );
			jQuery( "#allow_search_cleanup_patterns-off" ).prop( "checked", true );
		}
	} ).trigger( "change" );
} );
