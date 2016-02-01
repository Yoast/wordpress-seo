/* global wpseoMediaL10n */
/* global ajaxurl */
/* global wp */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */
'use strict';
// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/
jQuery( document ).ready(
	function ( $ ) {
		$( '.wpseo_image_upload_button' ).each( function ( index, element ) {
			var wpseo_target_button_id = $( element ).attr( 'id' );
			var wpseo_target_id = wpseo_target_button_id.replace( /_button$/, '' );

			var media = wp.media;
			var frames = media.frames;

			var wpseo_custom_uploader = frames.file_frame = wp.media( {
				title: wpseoMediaL10n.choose_image,
				button: {text: wpseoMediaL10n.choose_image},
				multiple: false,
				library: {
					type: 'image'
				}
			} );

			wpseo_custom_uploader.on( 'select', function () {
					var attachment = wpseo_custom_uploader.state().get( 'selection' ).first().toJSON();
					document.getElementById( wpseo_target_id ).style.border = 'none';

					yst_checkSocialMediaImage( attachment );

					$( '#' + wpseo_target_id ).val( attachment.url );
				}
			);

			$( element ).click( function ( e ) {
				e.preventDefault();
				wpseo_custom_uploader.open();
			} );


			/**
			 * Check if the uploaded file is an image. If this is not the case, show a warning
			 * @param {object} socialImage
			 */
			function yst_checkSocialMediaImage( socialImage ) {
				var warning = jQuery( '#yst_social_image_warning' );

				if ( warning.length > 0 ) {
					warning.remove();
				}

				if ( socialImage.type !== 'image' ) {
					jQuery( '<div id="yst_social_image_warning"><p>' + wpseoMediaL10n.invalid_filetype + '</p></div>' )
						.insertAfter( '#' + wpseo_target_button_id )
						.css( 'color', '#dd3d36' );
					document.getElementById( wpseo_target_id ).style.border = '2px solid #dd3d36';
				}


			}


		} );
	}
);
