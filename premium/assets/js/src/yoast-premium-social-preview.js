/* global yoastSocialPreview, tinyMCE, require, wp  */
/* jshint -W097 */
'use strict';

var getImages = require( 'yoastseo/js/stringProcessing/imageInText' );
var helpPanel = require( './helpPanel' );
var forEach = require( 'lodash/forEach' );

(function($) {
	/**
	 * We want to store the fallbacks in an object, to have directly access to them.
	 * @type {{content: string, featured: string}}
	 */
	var imageFallBack = {
		content: '',
		featured: ''
	};

	var socialPreviews = require( 'yoast-social-previews' );
	var FacebookPreview = socialPreviews.FacebookPreview;
	var TwitterPreview = socialPreviews.TwitterPreview;

	var translations = yoastSocialPreview.i18n;

	/**
	 * Sets the events for opening the WP media library when pressing the button.
	 *
	 * @param {Object} imageUrl The image url object.
	 * @param {string} imageButton ID name for the image button.
	 * @param {string} removeButton ID name for the remove button.
	 * @param {function} onMediaSelect The event that will be ran when image is chosen.
	 */
	function bindUploadButtonEvents( imageUrl, imageButton, removeButton, onMediaSelect ) {
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

			$( removeButton ).show();
		});

		$( removeButton ).click( function( evt ) {
			evt.preventDefault();

			// Clear the image url
			imageUrl.val( '' );

			onMediaSelect();

			$( removeButton ).hide();
		} );

		$( imageButton ).click( function( e ) {
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

		var buttonDiv = $( '<div></div>' );
		buttonDiv.insertAfter( imageUrl );

		var imageFieldId    = jQuery( imageUrl ).attr( 'id' );
		var imageButtonId   = imageFieldId + '_button';
		var imageButtonHtml = '<button id="' + imageButtonId + '" class="button button-primary wpseo_preview_image_upload_button" type="button">' + yoastSocialPreview.uploadImage + '</button>';

		var removeButtonId   = imageFieldId + '_remove_button';
		var removeButtonHtml = "<button id='" + removeButtonId + "' type='button' class='button wpseo_preview_image_upload_button'>" + yoastSocialPreview.removeImageButton + "</button>";

		$( buttonDiv ).append( imageButtonHtml );
		$( buttonDiv ).append( removeButtonHtml );

		imageUrl.hide();
		if ( imageUrl.val() === '' ) {
			$( "#" + removeButtonId ).hide();
		}

		bindUploadButtonEvents( imageUrl, "#" + imageButtonId, "#" + removeButtonId, onMediaSelect );
	}

	/**
	 * Returns the type of the current page: post or term.
	 *
	 * @returns {string}
	 */
	function getCurrentType() {
		// When this field exists, it is a post.
		if ( $( '#post_ID').length > 0 ) {
			return 'post';
		}

		// When this field is found, it is a term.
		if ( $( 'input[name=tag_ID]').length > 0 ) {
			return 'term';
		}

		return '';
	}

	/**
	 * Returns the prefix for the fields, because of the fields for the post do have an othere prefix than the ones for
	 * a taxonomy.
	 *
	 * @returns {*}
	 */
	function fieldPrefix() {
		switch( getCurrentType() ) {
			case 'post' :
				return 'yoast_wpseo';
			case 'term' :
				return 'wpseo';
		}

		return '';
	}

	/**
	 * Returns the name of the tinymce and textarea fields.
	 *
	 * @returns {string}
	 */
	function contentTextName() {
		switch ( getCurrentType() ) {
			case 'post' :
				return 'content';
			case 'term' :
				return 'description';
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
		socialPreviewholder.append( '<div id="' + containerId + '"></div>' );
		socialPreviewholder.find( '.form-table' ).hide();
	}

	/**
	 * Returns the arguments for the social preview prototypes.
	 *
	 * @param {string} targetElement The element where the preview is loaded.
	 * @param {string} fieldPrefix The prefix each form element has.
	 *
	 * @returns {{targetElement: Element, data: {title: *, description: *, imageUrl: *}, baseURL: *, callbacks: {updateSocialPreview: callbacks.updateSocialPreview}}}
	 */
	function getSocialPreviewArgs( targetElement, fieldPrefix ) {
		return {
			targetElement: $( targetElement ).get(0),
			data: {
				title: $( '#' + fieldPrefix + '-title' ).val(),
				description: $( '#' + fieldPrefix + '-description' ).val(),
				imageUrl: $( '#' + fieldPrefix + '-image' ).val()
			},
			baseURL: yoastSocialPreview.website,
			callbacks: {
				updateSocialPreview: function( data ) {
					$( '#' + fieldPrefix + '-title' ).val( data.title );
					$( '#' + fieldPrefix + '-description' ).val( data.description );
					$( '#' + fieldPrefix + '-image' ).val( data.imageUrl );

					if (data.imageUrl === '') {
						jQuery( targetElement ).trigger( 'setFallbackImage' );
					}
				}
			}
		};
	}

	/**
	 * Initialize the facebook preview.
	 *
	 * @param {Object} facebookHolder Target element for adding the facebook preview.
	 */
	function initFacebook( facebookHolder ) {
		createSocialPreviewContainer( facebookHolder, 'facebookPreview' );

		var facebookPreviewContainer = $( '#facebookPreview' );
		var facebookPreview = new FacebookPreview(
			getSocialPreviewArgs( facebookPreviewContainer, fieldPrefix() + '_opengraph' )
		);

		facebookPreviewContainer.on(
			'setFallbackImage',
			function() {
				facebookPreview.setImageUrl( getFallbackImage( yoastSocialPreview.facebookDefaultImage ) );
			}
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

		var twitterPreviewContainer = $( '#twitterPreview' );
		var twitterPreview = new TwitterPreview(
			getSocialPreviewArgs( twitterPreviewContainer, fieldPrefix() + '_twitter' )
		);

		twitterPreviewContainer.on(
			'setFallbackImage',
			function() {
				twitterPreview.setImageUrl( getFallbackImage( '' ) );
			}
		);

		twitterPreview.init();

		addUploadButton( jQuery( '#twitter-editor-imageUrl' ), twitterPreview.updatePreview.bind( twitterPreview ) );
	}

	/**
	 * Refresh the image url by triggering the setFallBackImage event
	 */
	function refreshImageUrl( ) {
		$( '#facebookPreview' ).trigger( 'setFallbackImage' );
		$( '#twitterPreview' ).trigger( 'setFallbackImage' );
	}

	/**
	 * Bind the image events to set the fallback and rendering the preview.
	 */
	function bindImageEvents() {
		if ( getCurrentType() === 'post' ) {
			bindFeaturedImageEvents();
		}

		bindContentEvents();
	}

	/**
	 * Binds the events for the featured image.
	 */
	function bindFeaturedImageEvents() {
		// When the featured image is being changed
		var featuredImage = wp.media.featuredImage.frame();

		featuredImage.on( 'select', function() {
			var imageDetails = featuredImage.state().get( 'selection' ).first().attributes;

			setFeaturedImage( imageDetails.url );
			refreshImageUrl();
		} );

		$( '#postimagediv' ).on( 'click', '#remove-post-thumbnail', function() {
			setFeaturedImage( '' );
			refreshImageUrl();
		} );
	}

	/**
	 * Bind the events for the content.
	 */
	function bindContentEvents() {
		// Bind the event when something changed in the text editor.
		var contentElement = $( '#' + contentTextName() );
		if( typeof contentElement !== 'undefined' ) {
			contentElement.on( 'input', refreshContentImage );
		}

		//Bind the events when something changed in the tinyMCE editor.
		if( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			var events = [ 'input', 'change', 'cut', 'paste' ];
			tinyMCE.on( 'addEditor', function( e ) {
				for ( var i = 0; i < events.length; i++ ) {
					e.editor.on( events[i], refreshContentImage );
				}
			});
		}
	}

	/**
	 * Sets the image fallbacks like the featured image (in case of a post) and the content image.
	 */
	function setImageFallback() {
		// In case of a post: we want to have the featured image.
		if( getCurrentType() === 'post' ) {
			var featuredImage = getFeaturedImage();
			setFeaturedImage( featuredImage );
		}

		var contentImage = getContentImage();
		setContentImage( contentImage );
	}

	/**
	 * Sets the featured image based on the given image url.
	 *
	 * @param {string} featuredImage The image we want to set.
	 */
	function setFeaturedImage( featuredImage ) {
		imageFallBack.featured = featuredImage;
	}

	/**
	 * Sets the content image base on the given image url
	 *
	 * @param {string} contentImage The image we want to set.
	 */
	function setContentImage( contentImage ) {
		imageFallBack.content = contentImage;
	}

	/**
	 * Gets the featured image source from the DOM.
	 *
	 * @returns {string}
	 */
	function getFeaturedImage() {
		var postThumbnail = $( '.attachment-post-thumbnail' );
		if( postThumbnail.length > 0 ) {
			return $( postThumbnail.get(0) ).attr( 'src' );
		}

		return '';
	}

	/**
	 * Returns the image from the content.
	 *
	 * @returns {string}
	 */
	function getContentImage() {
		var content = getContent();

		var images = getImages( content );
		images.unshift( '<img alt="hoi" />' );

		var image = '';

		do {
			image = images.shift();
			image = $( image );

			image = image.prop( 'src' );
		} while ( '' === image && images.length > 0 );

		return image;
	}

	/**
	 * Returns the content from current visible content editor
	 *
	 * @returns {string}
	 */
	function getContent() {
		if ( isTinyMCEAvailable() ) {
			return tinyMCE.get( contentTextName() ).getContent();
		}

		var contentElement = $( '#' + contentTextName() );
		if( contentElement.length > 0 ) {
			return contentElement.val();
		}

		return '';
	}

	/**
	 * Check if tinymce is active on the current page.
	 *
	 * @returns {boolean}
	 * @private
	 */
	function isTinyMCEAvailable() {
		if ( typeof tinyMCE === 'undefined' ||
			typeof tinyMCE.editors === 'undefined' ||
			tinyMCE.editors.length === 0 ||
			tinyMCE.get( contentTextName() ) === null ||
			tinyMCE.get( contentTextName()  ).isHidden() ) {
			return false;
		}

		return true;
	}

	/**
	 * Sets the content image value and refreshes the image urls for the previews.
	 */
	function refreshContentImage() {
		setContentImage( getContentImage() );
		refreshImageUrl();
	}

	/**
	 * Check if there is a fallback image like the featured image or the first image in the content.
	 *
	 * @param {string} defaultImage The default image when nothing has been found.
	 * @returns {string}
	 */
	function getFallbackImage( defaultImage ) {
		// In case of an post: we want to have the featured image.
		if( getCurrentType() === 'post' ) {
			if( imageFallBack.featured !== '' ) {
				return imageFallBack.featured;
			}
		}

		// When the featured image is empty, try an image in the content
		if( imageFallBack.content !== '') {
			return imageFallBack.content;
		}

		return defaultImage;
	}

	/**
	 * Adds the help panels to the social previews
	 */
	function addHelpPanels() {
		var panels = [
			{
				beforeElement: '#facebook-editor-imageUrl',
				buttonText: translations.helpButton.facebookImage,
				descriptionText: translations.help.facebookImage,
				id: 'facebook-editor-image-help'
			},
			{
				beforeElement: '#facebook-editor-title',
				buttonText: translations.helpButton.facebookTitle,
				descriptionText: translations.help.facebookTitle,
				id: 'facebook-editor-title-help'
			},
			{
				beforeElement: '#facebook-editor-description',
				buttonText: translations.helpButton.facebookDescription,
				descriptionText: translations.help.facebookDescription,
				id: 'facebook-editor-description-help'
			},
			{
				beforeElement: '#twitter-editor-imageUrl',
				buttonText: translations.helpButton.twitterImage,
				descriptionText: translations.help.twitterImage,
				id: 'twitter-editor-image-help'
			},
			{
				beforeElement: '#twitter-editor-title',
				buttonText: translations.helpButton.twitterTitle,
				descriptionText: translations.help.twitterTitle,
				id: 'twitter-editor-title-help'
			},
			{
				beforeElement: '#twitter-editor-description',
				buttonText: translations.helpButton.twitterDescription,
				descriptionText: translations.help.twitterDescription,
				id: 'twitter-editor-description-help'
			}
		];

		forEach( panels, function( panel ) {
			$( panel.beforeElement ).before(
				helpPanel.helpButton( panel.buttonText, panel.id ) +
				helpPanel.helpText( panel.descriptionText, panel.id )
			);
		});
	}

	/**
	 * Initialize the social previews.
	 */
	function initYoastSocialPreviews() {
		var facebookHolder = $( '#wpseo_facebook' );
		var twitterHolder = $( '#wpseo_twitter' );

		if ( facebookHolder.length > 0 || twitterHolder.length > 0 ) {
			jQuery( window ).on( 'YoastSEO:ready', function() {
				setImageFallback();

				if (facebookHolder.length > 0) {
					initFacebook( facebookHolder );
				}

				if (twitterHolder.length > 0) {
					initTwitter( twitterHolder );
				}
				addHelpPanels();

				bindImageEvents();
			} );
		}
	}

	$( initYoastSocialPreviews );
}( jQuery ) );
