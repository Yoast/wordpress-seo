/* global yoastSocialPreview  */
'use strict';

(function($) {
	var socialPreviews = require( 'yoast-social-previews' );
	var FacebookPreview = socialPreviews.FacebookPreview;
	var TwitterPreview = socialPreviews.TwitterPreview;

	/**
	 * Sets the events for opening the WP media library when pressing the button.
	 *
	 * @param {Object} imageUrl The image url object.
	 * @param {string} imageButton ID name for the image button.
	 * @param {function} onMediaSelect The event that will be ran when image is chosen.
	 */
	function bindUploadButtonEvents( imageUrl, imageButton, onMediaSelect ) {
		var social_preview_uploader = wp.media.frames.file_frame = wp.media({
			title: yoastSocialPreview.choose_image,
			button: { text: yoastSocialPreview.choose_image },
			multiple: false
		});

		social_preview_uploader.on( 'select', function() {
			var attachment = social_preview_uploader.state().get( 'selection' ).first().toJSON();

			// Set the image url.
			imageUrl.val( attachment.url );

			onMediaSelect();
		});

		$( "#" + imageButton ).click( function( e ) {
			e.preventDefault();
			social_preview_uploader.open();
		} );
	}

	/**
	 * Adds the choose image button and hides the input field.
	 *
	 * @param {Object}  imageUrl The image url object.
	 * @param {function} onMediaSelect Event to be ran when image is chosen.
	 */
	function addUploadButton( imageUrl, onMediaSelect ) {
		if( typeof wp.media === 'undefined' ) {
			return;
		}

		var imageButtonId = jQuery( imageUrl ).attr( "id" ) + "_button";
		var imageButton   = $( '<input id="' + imageButtonId + '" class="button wpseo_preview_image_upload_button" type="button" value="' + yoastSocialPreview.upload_image + '" />' );
		$( imageButton ).insertAfter( imageUrl );
		imageUrl.hide();

		bindUploadButtonEvents( imageUrl, imageButtonId, onMediaSelect );
	}

	/**
	 * Returns the prefix for the fields, because of the fields for the post do have an othere prefix than the ones for
	 * a taxonomy.
	 *
	 * @returns {*}
	 */
	function fieldPrefix() {
		// We've prefixed the
		if ( $( '#post_ID').length > 0 ) {
			return 'yoast_wpseo';
		}

		// We've prefixed the fields for taxonomies different.
		if ( $( 'input[name=tag_ID]').length > 0 ) {
			return 'wpseo';
		}

		return '';
	}


	/**
	 * Creates the social preview container and hides the old form table, to replace it.
	 *
	 * @param {Object} socialPreviewholder The holder element where the container will be append to.
	 * @param {string} containerId The id the container will get
	 */
	function createSocialPreviewContainer( socialPreviewholder, containerId ) {
		socialPreviewholder.append( "<div id='" + containerId + "'></div>" );
		socialPreviewholder.find( '.form-table' ).hide();
	}

	/**
	 * Returns the arguments for the social preview prototypes.
	 *
	 * @param {string} targetElement The element where the preview is loaded.
	 * @param {string} fieldPrefix The prefix each form element has.
	 * @returns {{targetElement: Element, data: {title: *, description: *, imageUrl: *}, baseURL: *, callbacks: {updateSocialPreview: callbacks.updateSocialPreview}}}
	 */
	function getSocialPreviewArgs( targetElement, fieldPrefix ) {
		return {
			targetElement: $( targetElement ).get(0),
			data : {
				title : $( '#' + fieldPrefix + '-title' ).val(),
				description : $( '#' + fieldPrefix + '-description' ).val(),
				imageUrl : $( '#' + fieldPrefix + '-image' ).val()
			},
			baseURL : yoastSocialPreview.website,
			callbacks : {
				updateSocialPreview : function( data ) {
					$( '#' + fieldPrefix + '-title' ).val( data.title );
					$( '#' + fieldPrefix + '-description' ).val( data.description );
					$( '#' + fieldPrefix + '-image' ).val( data.imageUrl );
				}
			}
		}
	}

	/**
	 * Initialize the facebook preview.
	 *
	 * @param {Object} facebookHolder Target element for adding the facebook preview.
	 */
	function initFacebook( facebookHolder ) {
		createSocialPreviewContainer( facebookHolder, 'facebookPreview' );

		var facebookPreview = new FacebookPreview(
			getSocialPreviewArgs( $( '#facebookPreview' ), fieldPrefix() + '_opengraph' )
		);
		facebookPreview.init();

		addUploadButton( jQuery( '#facebook-editor-imageUrl' ), facebookPreview.updatePreview.bind( facebookPreview ) );
	}

	/**
	 * Initialize the twitter preview.
	 *
	 * @param {Object} twitterHolder Target element for adding the twitter preview.
	 */
	function initTwitter( twitterHolder ) {
		createSocialPreviewContainer( twitterHolder, 'twitterPreview' );

		var twitterPreview = new TwitterPreview(
			getSocialPreviewArgs( $( '#twitterPreview' ), fieldPrefix() + '_twitter' )
		);

		twitterPreview.init();

		addUploadButton( jQuery( '#twitter-editor-imageUrl' ), twitterPreview.updatePreview.bind( twitterPreview ) );
	}

	/**
	 * Initialize the social previews.
	 */
	function initYoastSocialPreviews() {
		var facebookHolder = $( '#wpseo_facebook' );
		if ( facebookHolder.length > 0 ) {
			initFacebook( facebookHolder );
		}

		var twitterHolder = $( '#wpseo_twitter' );
		if ( twitterHolder.length > 0 ) {
			initTwitter( twitterHolder );
		}

	}

	$( initYoastSocialPreviews );

}(jQuery));
