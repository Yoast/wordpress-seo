jQuery( document ).ready( function() {
	// Add on/off dependency between Comment Feed toggles.
	if ( jQuery( "#remove_feed_global_comments" ).length ) {
		jQuery( "#remove_feed_global_comments input[type='radio']" ).on( "change", function() {
			if ( jQuery( this ).is( ":checked" ) ) {
				if ( jQuery( "#remove_feed_global_comments input[type='radio']:checked" ).val() === "on" ) {
					// When Global comment feeds are disabled, we have to disable the Post comment feeds too.
					jQuery( "#remove_feed_post_comments-on" ).prop( "checked", true );
					jQuery( "#remove_feed_post_comments input[type='radio']" ).prop( "disabled", true );
				} else {
					// When Global comment feeds gets enabled, we have to make the Post comment feeds togglable again.
					if ( jQuery( "#remove_feed_post_comments .disabled-note" ).length ) {
						// But only if the super admin allows us to do so. If not, we just have to revert the Post comment feeds to Keep again.
						jQuery( "#remove_feed_post_comments-off" ).prop( "checked", true );
					} else {
						jQuery( "#remove_feed_post_comments input[type='radio']" ).prop( "disabled", false );
					}
				}
			}
		} ).trigger( "change" );
	}

	jQuery( "#search_cleanup input[type='radio']" ).on( "change", function() {
		if ( jQuery( "#search_cleanup input[type='radio']:checked" ).val() === "on" ) {
			jQuery( "#search_cleanup_emoji" ).prop( "disabled", false ).removeClass( "yoast-crawl-settings-disabled" );
			jQuery( "#search_cleanup_patterns" ).prop( "disabled", false ).removeClass( "yoast-crawl-settings-disabled" );
			jQuery( "#search_character_limit" ).prop( "disabled", false );
			jQuery( "#search_character_limit_container" ).removeClass( "yoast-crawl-settings-disabled" );
		} else {
			jQuery( "#search_cleanup_emoji" ).prop( "disabled", true ).addClass( "yoast-crawl-settings-disabled" );
			jQuery( "#search_cleanup_patterns" ).prop( "disabled", true ).addClass( "yoast-crawl-settings-disabled" );
			jQuery( "#search_character_limit" ).prop( "disabled", true );
			jQuery( "#search_character_limit_container" ).addClass( "yoast-crawl-settings-disabled" );
		}
	} ).trigger( "change" );

	jQuery( "#clean_permalinks input[type='radio']" ).on( "change", function() {
		if ( jQuery( "#clean_permalinks input[type='radio']:checked" ).val() === "on" ) {
			jQuery( "#clean_permalinks_extra_variables" ).prop( "disabled", false );
			jQuery( "#clean_permalinks_extra_variables_container" ).removeClass( "yoast-crawl-settings-disabled" );
		} else {
			jQuery( "#clean_permalinks_extra_variables" ).prop( "disabled", true );
			jQuery( "#clean_permalinks_extra_variables_container" ).addClass( "yoast-crawl-settings-disabled" );
		}
	} ).trigger( "change" );

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
