/* jshint -W097 */
/* global yoastSocialPreview  */
'use strict';

(function($) {
	var socialPreviews = require( 'yoast-social-previews' );
	var FacebookPreview = socialPreviews.FacebookPreview;
	var TwitterPreview = socialPreviews.TwitterPreview;

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
	 * Adds an image url.
	 * @param {Object} imageUrl
	 */
	function addUploadImage( imageUrl ) {
		jQuery( imageUrl ).parent().append(
			'<input id="' + jQuery( imageUrl ).attr( "id" ) + '_button" class="wpseo_image_upload_button button" type="button" value="' + yoast_social_preview.upload_image + '" />'
		);
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

		addUploadImage( jQuery( '#twitter-editor-imageUrl' ) );
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
