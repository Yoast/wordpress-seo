/* global wpseoMediaL10n */
/* global wp */

// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/
jQuery( document ).ready(
	function( $ ) {
		if ( typeof wp.media === "undefined" ) {
			return;
		}

		$( ".wpseo_image_upload_button" ).each( function( index, element ) {
			const $urlInput = $( "#" + $( element ).data( "target" ) );
			const $idInput = $( "#" + $( element ).data( "target" ) + "-id" );

			let wpseoCustomUploader;

			const $uploadImageButton = $( element );

			$uploadImageButton.click( function() {
				// If the media uploader frame for this button already exists, open it and return.
				if ( wpseoCustomUploader ) {
					wpseoCustomUploader.open();
					return;
				}

				// Set up the media uploader frame for this button.
				// eslint-disable-next-line
				wpseoCustomUploader = wp.media.frames.file_frame = wp.media( {
					title: wpseoMediaL10n.choose_image,
					button: { text: wpseoMediaL10n.choose_image },
					multiple: false,
				} );

				wpseoCustomUploader.on( "select", function() {
					var attachment = wpseoCustomUploader.state().get( "selection" ).first().toJSON();

					$urlInput.val( attachment.url );
					$idInput.val( attachment.id );
				} );

				wpseoCustomUploader.open();
			} );

			$uploadImageButton
				.siblings( ".wpseo_image_remove_button" )
				.on( "click", () => {
					$urlInput.val( "" );
					$idInput.val( "" );
				} );
		} );
	}
);
