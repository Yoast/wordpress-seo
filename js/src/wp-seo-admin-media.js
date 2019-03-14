/* global wpseoMediaL10n */
/* global wp */

// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/
jQuery( document ).ready(
	function( $ ) {
		if ( typeof wp.media === "undefined" ) {
			return;
		}

		/**
		 * Returns the target HTML id for this button element.
		 *
		 * @param {Object} $button The image select button.
		 * @returns {string} The HTML id for the URL input field.
		 */
		function getTarget( $button ) {
			$button = $( $button );

			let target = $button.data( "target" );

			// This is the implicit way to define which URL field to fill.
			if ( ! target || target === "" ) {
				target = $( $button ).attr( "id" ).replace( /_button$/, "" );
			}

			return target;
		}

		/**
		 * Returns the hidden ID input element for this button.
		 *
		 * @param {Object} $button The image select button.
		 * @returns {string} The HTML id for the ID input field.
		 */
		function getIdTarget( $button ) {
			$button = $( $button );

			return $button.data( "target-id" );
		}

		$( ".wpseo_image_upload_button" ).each( function( index, element ) {
			const urlInputHtmlId = getTarget( element );
			const idInputHtmlId = getIdTarget( element );

			const $urlInput = $( "#" + urlInputHtmlId );
			const $idInput = $( "#" + idInputHtmlId );

			// eslint-disable-next-line
			var wpseoCustomUploader = wp.media.frames.file_frame = wp.media( {
				title: wpseoMediaL10n.choose_image,
				button: { text: wpseoMediaL10n.choose_image },
				multiple: false,
			} );

			wpseoCustomUploader.on( "select", function() {
				var attachment = wpseoCustomUploader.state().get( "selection" ).first().toJSON();

				$urlInput.val( attachment.url );
				$idInput.val( attachment.id );
			}
			);

			const $uploadImageButton = $( element );

			$uploadImageButton.click( function( e ) {
				e.preventDefault();
				wpseoCustomUploader.open();
			} );

			$uploadImageButton
				.siblings( ".wpseo_image_remove_button" )
				.on( "click", ( e ) => {
					e.preventDefault();

					$urlInput.val( "" );
					$idInput.val( "" );
				} );
		} );
	}
);
