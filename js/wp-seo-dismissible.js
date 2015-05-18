/**
 * Make notices dismissible
 *
 * This file should only be included in WordPress versions < 4.2, which don't have dismissible notices.
 * Before adding a dismiss button to notices with an `is-dismissible` class, a check is performed to see
 * if no such button has been added yet.
 */
jQuery(document).ready( function() {
	jQuery( '.notice.is-dismissible' ).each( function() {
		var $notice = jQuery( this );
		if ( $notice.find( '.notice-dismiss').empty() ) {
			var	$button = jQuery( '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>' );

			$notice.append( $button );

			$button.on( 'click.wp-dismiss-notice', function( event ) {
				event.preventDefault();
				$notice.fadeTo( 100 , 0, function() {
					jQuery(this).slideUp( 100, function() {
						jQuery(this).remove();
					});
				});
			});
		}
	});
});