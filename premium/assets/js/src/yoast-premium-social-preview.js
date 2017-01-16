/* global yoastSocialPreview, tinyMCE, require, wp, YoastSEO, ajaxurl  */
/* jshint -W097 */

var getImages = require( "yoastseo/js/stringProcessing/imageInText" );
var helpPanel = require( "./helpPanel" );
var getTitlePlaceholder = require( "../../../../js/src/analysis/getTitlePlaceholder" );
var getDescriptionPlaceholder = require( "../../../../js/src/analysis/getDescriptionPlaceholder" );

var _debounce = require("lodash/debounce");
var clone = require( "lodash/clone" );
var forEach = require( "lodash/forEach" );
var _has = require( "lodash/has" );
var isUndefined = require( "lodash/isUndefined" );

var Jed = require( "jed" );
var socialPreviews = require( "yoast-social-previews" );

( function( $ ) {
	/**
	 * We want to store the fallbacks in an object, to have directly access to them.
	 * @type {{content: string, featured: string}}
	 */
	var imageFallBack = {
		content: "",
		featured: "",
	};

	var canReadFeaturedImage = true;

	var FacebookPreview = socialPreviews.FacebookPreview;
	var TwitterPreview = socialPreviews.TwitterPreview;

	var facebookPreview, twitterPreview;

	var translations = yoastSocialPreview.i18n;

	var i18n = new Jed( addLibraryTranslations( translations.library ) );
	var biggerImages = {};

	let postTitleInputId = "title";

	/**
	 * Sets the events for opening the WP media library when pressing the button.
	 *
	 * @param {Object} imageUrl The image URL object.
	 * @param {string} imageButton ID name for the image button.
	 * @param {string} removeButton ID name for the remove button.
	 * @param {function} onMediaSelect The event that will be ran when image is chosen.
	 * @param {Object} imagePreviewElement The image preview element that can be clicked to update as well.
	 *
	 * @returns {void}
	 */
	function bindUploadButtonEvents( imageUrl, imageButton, removeButton, onMediaSelect, imagePreviewElement ) {
		var socialPreviewUploader = wp.media.frames.file_frame = wp.media( {
			title: yoastSocialPreview.choose_image,
			button: { text: yoastSocialPreview.choose_image },
			multiple: false,
		} );

		socialPreviewUploader.on( "select", function() {
			var attachment = socialPreviewUploader.state().get( "selection" ).first().toJSON();

			// Set the image URL.
			imageUrl.val( attachment.url );

			onMediaSelect();

			$( removeButton ).show();
		} );

		$( removeButton ).click( function( evt ) {
			evt.preventDefault();

			// Clear the image URL
			imageUrl.val( "" );

			onMediaSelect();

			$( removeButton ).hide();
		} );

		$( imageButton ).click( function( evt ) {
			evt.preventDefault();
			socialPreviewUploader.open();
		} );

		$( imagePreviewElement ).on( "click", function( eventObject ) {
			socialPreviewUploader.open();
		} );
	}

	/**
	 * Adds the choose image button and hides the input field.
	 *
	 * @param {Object} preview The preview to add the upload button to.
	 *
	 * @returns {void}
	 */
	function addUploadButton( preview ) {
		if ( typeof wp.media === "undefined" ) {
			return;
		}

		var imageUrl = $( preview.element.formContainer ).find( ".js-snippet-editor-imageUrl" );

		var buttonDiv = $( "<div></div>" );
		buttonDiv.insertAfter( imageUrl );

		var uploadButtonText = getUploadButtonText( preview );

		var imageFieldId    = jQuery( imageUrl ).attr( "id" );
		var imageButtonId   = imageFieldId + "_button";
		var imageButtonHtml = '<button id="' + imageButtonId + '" ' +
			'class="button button-primary wpseo_preview_image_upload_button" type="button">' + uploadButtonText + '</button>';

		var removeButtonId   = imageFieldId + "_remove_button";
		var removeButtonHtml = '<button id="' + removeButtonId + '" type="button" ' +
			'class="button wpseo_preview_image_upload_button">' + yoastSocialPreview.removeImageButton + '</button>';

		$( buttonDiv ).append( imageButtonHtml );
		$( buttonDiv ).append( removeButtonHtml );

		imageUrl.hide();
		if ( imageUrl.val() === "" ) {
			$( "#" + removeButtonId ).hide();
		}

		bindUploadButtonEvents(
			imageUrl,
			"#" + imageButtonId,
			"#" + removeButtonId,
			preview.updatePreview.bind( preview ),
			$( preview.element.container ).find( ".editable-preview__image" )
		);
	}

	/**
	 * Returns the type of the current page: post or term.
	 *
	 * @returns {string} The current type.
	 */
	function getCurrentType() {
		// When this field exists, it is a post.
		if ( $( "#post_ID" ).length > 0 ) {
			return "post";
		}

		// When this field is found, it is a term.
		if ( $( "input[name=tag_ID]" ).length > 0 ) {
			return "term";
		}

		return "";
	}

	/**
	 * Returns the prefix for the fields, because of the fields for the post do have an othere prefix than the ones for
	 * a taxonomy.
	 *
	 * @returns {*} The prefix to use.
	 */
	function fieldPrefix() {
		switch( getCurrentType() ) {
			case "post":
				return "yoast_wpseo";
			case "term":
				return "wpseo";
			default :
				return "";
		}
	}

	/**
	 * Returns the name of the tinymce and textarea fields.
	 *
	 * @returns {string} The name for the content field.
	 */
	function contentTextName() {
		switch ( getCurrentType() ) {
			case "post" :
				return "content";
			case "term" :
				return "description";
			default :
				return "";
		}
	}

	/**
	 * Creates the social preview container and hides the old form table, to replace it.
	 *
	 * @param {Object} socialPreviewholder The holder element where the container will be append to.
	 * @param {string} containerId The id the container will get
	 * @returns {void}
	 */
	function createSocialPreviewContainer( socialPreviewholder, containerId ) {
		socialPreviewholder.append( '<div id="' + containerId + '"></div>' );
	}

	/**
	 * Gets the meta description from the snippet editor
	 * @returns {void}
	 */
	function getMetaDescription() {
		return $( "#yoast_wpseo_metadesc" ).val();
	}

	/**
	 * Returns the placeholder for the meta description field.
	 *
	 * @returns {string} The placeholder for the meta description.
	 */
	function getSocialDescriptionPlaceholder() {
		var description = getMetaDescription();

		if ( "" === description ) {
			description = getDescriptionPlaceholder();
		}

		return description;
	}

	/**
	 * Returns the arguments for the social preview prototypes.
	 *
	 * @param {string} targetElement The element where the preview is loaded.
	 * @param {string} fieldPrefix The prefix each form element has.
	 *
	 * @returns { {
	 * 		targetElement: Element,
	 *		data: {title: *, description: *, imageUrl: *},
	 * 		baseURL: *,
	 * 		callbacks: {updateSocialPreview: callbacks.updateSocialPreview}
	 * } } The arguments for the social preview.
	 */
	function getSocialPreviewArgs( targetElement, fieldPrefix ) {
		var titlePlaceholder = getTitlePlaceholder();
		var descriptionPlaceholder = getSocialDescriptionPlaceholder();

		var args = {
			targetElement: $( targetElement ).get( 0 ),
			data: {
				title: $( "#" + fieldPrefix + "-title" ).val(),
				description: $( "#" + fieldPrefix + "-description" ).val(),
				imageUrl: $( "#" + fieldPrefix + "-image" ).val(),
			},
			baseURL: yoastSocialPreview.website,
			callbacks: {
				updateSocialPreview: function( data ) {
					$( "#" + fieldPrefix + "-title" ).val( data.title );
					$( "#" + fieldPrefix + "-description" ).val( data.description );
					$( "#" + fieldPrefix + "-image" ).val( data.imageUrl );

					// Make sure Twitter is updated if a Facebook image is set
					$( ".editable-preview" ).trigger( "imageUpdate" );

					if ( data.imageUrl !== "" ) {
						var buttonPrefix = targetElement.attr( "id" ).replace( "Preview", "" );
						setUploadButtonValue( buttonPrefix, yoastSocialPreview.useOtherImage );
					}

					jQuery( targetElement ).find( ".editable-preview" ).trigger( "titleUpdate" );
					jQuery( targetElement ).find( ".editable-preview" ).trigger( "descriptionUpdate" );
				},
				modifyImageUrl: function( imageUrl ) {
					if ( imageUrl === "" ) {
						imageUrl = getFallbackImage( "" );
					}

					return imageUrl;
				},
				modifyTitle: function( title ) {
					if ( fieldPrefix.indexOf( "twitter" ) > -1 ) {
						if ( title === $( "#twitter-editor-title" ).attr( "placeholder" ) ) {
							var facebookTitle = $( "#facebook-editor-title" ).val();
							if ( ! isUndefined( facebookTitle ) && facebookTitle !== "" ) {
								title = facebookTitle;
							}
						}
					}
					return YoastSEO.wp.replaceVarsPlugin.replaceVariables( title );
				},
				modifyDescription: function( description ) {
					if ( fieldPrefix.indexOf( "twitter" ) > -1 ) {
						if ( description === $( "#twitter-editor-description" ).attr( "placeholder" ) ) {
							var facebookDescription = $( "#facebook-editor-description" ).val();
							if ( facebookDescription !== "" ) {
								description = facebookDescription;
							}
						}
						if ( isUndefined( description ) ){
							description = $( '#twitter-editor-description' ).attr( 'placeholder' );
						}
					}

					return YoastSEO.wp.replaceVarsPlugin.replaceVariables( description );
				},
			},
			placeholder: {
				title: titlePlaceholder,
			},
			defaultValue: {
				title: titlePlaceholder,
			},
		};

		if ( "" !== descriptionPlaceholder ) {
			args.placeholder.description = descriptionPlaceholder;
			args.defaultValue.description = descriptionPlaceholder;
		}

		return args;
	}

	/**
	 * Try to get the Facebook author name via AJAX and put it to the Facebook preview.
	 *
	 * @param {FacebookPreview} facebookPreview The Facebook preview object
	 * @returns {void}
	 */
	function getFacebookAuthor( facebookPreview ) {
		$.get(
			ajaxurl,
			{
				action: "wpseo_get_facebook_name",
				_ajax_nonce: yoastSocialPreview.facebookNonce,
				user_id: $( "#post_author_override" ).val(),
			},
			function( author ) {
				if ( author !== 0 ) {
					facebookPreview.setAuthor( author );
				}
			}
		);
	}

	/**
	 * Initialize the Facebook preview.
	 *
	 * @param {Object} facebookHolder Target element for adding the Facebook preview.
	 * @returns {void}
	 */
	function initFacebook( facebookHolder ) {
		createSocialPreviewContainer( facebookHolder, "facebookPreview" );

		var facebookPreviewContainer = $( "#facebookPreview" );
		facebookPreview = new FacebookPreview(
			getSocialPreviewArgs( facebookPreviewContainer, fieldPrefix() + "_opengraph" ),
			i18n
		);

		facebookPreviewContainer.on(
			"imageUpdate",
			".editable-preview",
			function() {
				setUploadButtonValue( "facebook", getUploadButtonText( facebookPreview ) );
				setFallbackImage( facebookPreview );
			}
		);

		facebookPreview.init();

		addUploadButton( facebookPreview );

		var postAuthorDropdown = $( "#post_author_override" );
		if( postAuthorDropdown.length > 0 ) {
			postAuthorDropdown.on( "change", getFacebookAuthor.bind( this, facebookPreview ) );
			postAuthorDropdown.trigger( "change" );
		}

		$( "#" + postTitleInputId ).on(
			"keydown keyup input focus blur",
			_debounce( facebookPreview.updatePreview.bind( facebookPreview ), 500 )
		);
	}

	/**
	 * Initialize the twitter preview.
	 *
	 * @param {Object} twitterHolder Target element for adding the twitter preview.
	 * @returns {void}
	 */
	function initTwitter( twitterHolder ) {
		createSocialPreviewContainer( twitterHolder, "twitterPreview" );

		var twitterPreviewContainer = $( "#twitterPreview" );
		twitterPreview = new TwitterPreview(
			getSocialPreviewArgs( twitterPreviewContainer, fieldPrefix() + "_twitter" ),
			i18n
		);

		twitterPreviewContainer.on(
			"imageUpdate",
			".editable-preview",
			function() {
				setUploadButtonValue( "twitter", getUploadButtonText( twitterPreview ) );
				setFallbackImage( twitterPreview );
			}
		);

		var facebookPreviewContainer = $( "#facebookPreview" );
		facebookPreviewContainer.on(
			"titleUpdate",
			".editable-preview",
			twitterTitleFallback.bind( this, twitterPreview )
		);

		facebookPreviewContainer.on(
			"descriptionUpdate",
			".editable-preview",
			twitterDescriptionFallback.bind( this, twitterPreview )
		);

		twitterPreview.init();

		addUploadButton( twitterPreview );
		twitterTitleFallback( twitterPreview );
		twitterDescriptionFallback( twitterPreview );

		$( "#" + postTitleInputId ).on(
			"keydown keyup input focus blur",
			_debounce( twitterTitleFallback.bind( this, twitterPreview ), 500 )
		);
	}

	/**
	 * When twitter title is empty, use the Facebook title
	 *
	 * @param {TwitterPreview} twitterPreview The twitter preview object
	 * @returns {void}
	 */
	function twitterTitleFallback( twitterPreview ) {
		var $twitterTitle = $( "#twitter-editor-title" );
		var twitterTitle = $twitterTitle.val();
		if( twitterTitle !== "" ) {
			return;
		}

		var facebookTitle = $( "#facebook-editor-title" ).val();
		if ( ! isUndefined( facebookTitle ) && facebookTitle !== "" ) {
			twitterPreview.setTitle( facebookTitle );
		} else {
			twitterPreview.setTitle( $twitterTitle.attr( "placeholder" ) );
		}
	}

	/**
	 * When twitter description is empty, use the description title
	 *
	 * @param {TwitterPreview} twitterPreview The twitter preview object
	 * @returns {void}
	 */
	function twitterDescriptionFallback( twitterPreview ) {
		var $twitterDescription = $( "#twitter-editor-description" );
		var twitterDescription = $twitterDescription.val();
		if( twitterDescription !== "" ) {
			return;
		}

		var facebookDescription = $( "#facebook-editor-description" ).val();
		if ( facebookDescription !== "" ) {
			twitterPreview.setDescription( facebookDescription );
		} else {
			twitterPreview.setDescription( $twitterDescription.attr( "placeholder" ) );
		}
	}

	/**
	 * Set the fallback image for the preview if no image has been set
	 *
	 * @param {Object} preview Preview to set fallback image on.
	 * @returns {void}
     */
	function setFallbackImage( preview ) {
		if ( preview.data.imageUrl === "" ) {
			preview.setImage( getFallbackImage( "" ) );
		}
	}

	/**
	 * Changes the upload button value when there are fallback images present.
	 *
	 * @param {string} buttonPrefix The value before the id name.
	 * @param {string} text The text on the button.
	 * @returns {void}
	 */
	function setUploadButtonValue( buttonPrefix, text ) {
		$( "#"  + buttonPrefix + "-editor-imageUrl_button" ).html( text );
	}

	/**
	 * Bind the image events to set the fallback and rendering the preview.
	 *
	 * @returns {void}
	 */
	function bindImageEvents() {
		if ( getCurrentType() === "post" ) {
			bindFeaturedImageEvents();
		}

		bindContentEvents();
	}

	/**
	 * Get the text that the upload button needs to display
	 *
	 * @param {Object} preview Preview to read image from.
	 * @returns {*} The text for the button.
     */
	function getUploadButtonText( preview ) {
		return preview.data.imageUrl === "" ? yoastSocialPreview.uploadImage : yoastSocialPreview.useOtherImage;
	}

	/**
	 * Binds the events for the featured image.
	 *
	 * @returns {void}
	 */
	function bindFeaturedImageEvents() {
		if ( isUndefined( wp.media ) || isUndefined( wp.media.featuredImage ) ) {
			return;
		}

		// When the featured image is being changed
		var featuredImage = wp.media.featuredImage.frame();

		featuredImage.on( "select", function() {
			var imageDetails = featuredImage.state().get( "selection" ).first().attributes;

			canReadFeaturedImage = true;

			setFeaturedImage( imageDetails.url );
		} );

		$( "#postimagediv" ).on( "click", "#remove-post-thumbnail", function() {
			canReadFeaturedImage = false;

			clearFeaturedImage();
		} );
	}

	/**
	 * Bind the events for the content.
	 *
	 * @returns {void}
	 */
	function bindContentEvents() {
		// Bind the event when something changed in the text editor.
		var contentElement = $( "#" + contentTextName() );
		if ( contentElement.length > 0 ) {
			contentElement.on( "input", detectImageFallback );
		}

		// Bind the events when something changed in the tinyMCE editor.
		if ( typeof tinyMCE !== "undefined" && typeof tinyMCE.on === "function" ) {
			var events = [ "input", "change", "cut", "paste" ];
			tinyMCE.on( "addEditor", function( e ) {
				for ( var i = 0; i < events.length; i++ ) {
					e.editor.on( events[ i ], detectImageFallback );
				}
			} );
		}
	}

	/**
	 * Sets the featured image fallback value as an empty value and runs the fallback method.
	 *
	 * @returns {void}
	 */
	function clearFeaturedImage() {
		setFeaturedImage( "" );
		detectImageFallback();
	}

	/**
	 * Sets the image fallbacks like the featured image (in case of a post) and the content image.
	 *
	 * @returns {void}
	 */
	function detectImageFallback() {
		// In case of a post: we want to have the featured image.
		if ( getCurrentType() === "post" ) {
			var featuredImage = getFeaturedImage();
			setFeaturedImage( featuredImage );

			if ( featuredImage !== "" ) {
				return;
			}
		}

		setContentImage( getContentImage( function( image ) {
			setContentImage( image );
		} ) );
	}

	/**
	 * Sets the featured image based on the given image URL.
	 *
	 * @param {string} featuredImage The image we want to set.
	 * @returns {void}
	 */
	function setFeaturedImage( featuredImage ) {
		if ( imageFallBack.featured !== featuredImage ) {
			imageFallBack.featured = featuredImage;

			// Just refresh the image URL.
			$( ".editable-preview" ).trigger( "imageUpdate" );
		}
	}

	/**
	 * Sets the content image base on the given image URL
	 *
	 * @param {string} contentImage The image we want to set.
	 * @returns {void}
	 */
	function setContentImage( contentImage ) {
		if ( imageFallBack.content !== contentImage ) {
			imageFallBack.content = contentImage;

			// Just refresh the image URL.
			$( ".editable-preview" ).trigger( "imageUpdate" );
		}
	}

	/**
	 * Gets the featured image source from the DOM.
	 *
	 * @returns {string} The url to the featured image.
	 */
	function getFeaturedImage() {
		if ( canReadFeaturedImage === false ) {
			return "";
		}

		var postThumbnail = $( ".attachment-post-thumbnail" );
		if ( postThumbnail.length > 0 ) {
			return $( postThumbnail.get( 0 ) ).attr( "src" );
		}

		return "";
	}

	/**
	 * Returns the image from the content.
	 *
	 * @param {Function} callback function to call if a bigger size is available.
	 *
	 * @returns {string} The first image found in the content.
	 */
	function getContentImage( callback ) {
		var content = getContent();

		var images = getImages( content );
		var image  = "";

		if ( images.length === 0 ) {
			return image;
		}

		do {
			var currentImage = images.shift();
			currentImage = $( currentImage );

			var imageSource = currentImage.prop( "src" );

			if ( imageSource ) {
				image = imageSource;
			}
		} while ( "" === image && images.length > 0 );

		image = getBiggerImage( image, callback );

		return image;
	}

	/**
	 * Try to retrieve a bigger image for a certain image found in the content.
	 *
	 * @param {string}   url      The URL to retrieve.
	 * @param {Function} callback The callback to call if there is a bigger image.
	 * @returns {string} Returns the bigger image url.
	 */
	function getBiggerImage( url, callback ) {
		if ( _has( biggerImages, url ) ) {
			return biggerImages[ url ];
		}

		retrieveImageDataFromURL( url, function( imageUrl ) {
			biggerImages[ url ] = imageUrl;

			callback( imageUrl );
		} );

		return url;
	}

	/**
	 * Retrieves the image metadata from an image url and saves it to the image manager afterwards
	 *
	 * @param {string} url The image URL to retrieve the metadata from.
	 * @param {Function} callback Callback to call with the image URL result.
	 * @returns {void}
	 */
	function retrieveImageDataFromURL( url, callback ) {
		$.getJSON( ajaxurl, {
			action: "retrieve_image_data_from_url",
			imageURL: url,
		}, function( response ) {
			if ( "success" === response.status ) {
				callback( response.result );
			}
		} );
	}

	/**
	 * Returns the content from current visible content editor
	 *
	 * @returns {string} The value of the tinymce box.
	 */
	function getContent() {
		if ( isTinyMCEAvailable() ) {
			return tinyMCE.get( contentTextName() ).getContent();
		}

		var contentElement = $( "#" + contentTextName() );
		if ( contentElement.length > 0 ) {
			return contentElement.val();
		}

		return "";
	}

	/**
	 * Check if tinymce is active on the current page.
	 *
	 * @returns {boolean} True when tinymce is available.
	 * @private
	 */
	function isTinyMCEAvailable() {
		if ( typeof tinyMCE === "undefined" ||
			typeof tinyMCE.editors === "undefined" ||
			tinyMCE.editors.length === 0 ||
			tinyMCE.get( contentTextName() ) === null ||
			tinyMCE.get( contentTextName()  ).isHidden() ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if there is a fallback image like the featured image or the first image in the content.
	 *
	 * @param {string} defaultImage The default image when nothing has been found.
	 * @returns {string} The image to use.
	 */
	function getFallbackImage( defaultImage ) {
		// Twitter always first falls back to Facebook
		if ( ! isUndefined( facebookPreview ) && facebookPreview.data.imageUrl !== "" ) {
			return facebookPreview.data.imageUrl;
		}

		// In case of an post: we want to have the featured image.
		if ( getCurrentType() === "post" ) {
			if ( imageFallBack.featured !== "" ) {
				return imageFallBack.featured;
			}
		}

		// When the featured image is empty, try an image in the content
		if ( imageFallBack.content !== "" ) {
			return imageFallBack.content;
		}

		if ( defaultImage !== undefined ) {
			return defaultImage;
		}

		return "";
	}

	/**
	 * Adds the help panels to the social previews
	 *
	 * @returns {void}
	 */
	function addHelpPanels() {
		var panels = [
			{
				beforeElement: "#facebook-editor-imageUrl",
				buttonText: translations.helpButton.facebookImage,
				descriptionText: translations.help.facebookImage,
				id: "facebook-editor-image-help",
			},
			{
				beforeElement: "#facebook-editor-title",
				buttonText: translations.helpButton.facebookTitle,
				descriptionText: translations.help.facebookTitle,
				id: "facebook-editor-title-help",
			},
			{
				beforeElement: "#facebook-editor-description",
				buttonText: translations.helpButton.facebookDescription,
				descriptionText: translations.help.facebookDescription,
				id: "facebook-editor-description-help",
			},
			{
				beforeElement: "#twitter-editor-imageUrl",
				buttonText: translations.helpButton.twitterImage,
				descriptionText: translations.help.twitterImage,
				id: "twitter-editor-image-help",
			},
			{
				beforeElement: "#twitter-editor-title",
				buttonText: translations.helpButton.twitterTitle,
				descriptionText: translations.help.twitterTitle,
				id: "twitter-editor-title-help",
			},
			{
				beforeElement: "#twitter-editor-description",
				buttonText: translations.helpButton.twitterDescription,
				descriptionText: translations.help.twitterDescription,
				id: "twitter-editor-description-help",
			},
		];

		forEach( panels, function( panel ) {
			$( panel.beforeElement ).before(
				helpPanel.helpButton( panel.buttonText, panel.id ) +
				helpPanel.helpText( panel.descriptionText, panel.id )
			);
		} );

		$( ".snippet-editor__form" ).on( "click", ".yoast-help-button", function() {
			var $button = $( this ),
				helpPanel = $( "#" + $button.attr( "aria-controls" ) ),
				isPanelVisible = helpPanel.is( ":visible" );

			$( helpPanel ).slideToggle( 200, function() {
				$button.attr( "aria-expanded", ! isPanelVisible );
			} );
		} );
	}

	/**
	 * Adds library translations
	 * @param {Object} translations The translations to use.
	 * @returns {Object} translations mapped to the proper domain.
	 */
	function addLibraryTranslations( translations ) {
		if ( typeof translations !== "undefined" && typeof translations.domain !== "undefined" ) {
			translations.domain = "yoast-social-previews";
			translations.locale_data[ "yoast-social-previews" ] = clone( translations.locale_data[ "wordpress-seo-premium" ] );

			delete( translations.locale_data[ "wordpress-seo-premium" ] );

			return translations;
		}

		return {
			domain: "yoast-social-previews",
			locale_data: {
				"yoast-social-previews": {
					"": {},
				},
			},
		};
	}

	/**
	 * Initialize the social previews.
	 *
	 * @returns {void}
	 */
	function initYoastSocialPreviews() {
		var facebookHolder = $( "#wpseo_facebook" );
		var twitterHolder = $( "#wpseo_twitter" );

		if ( facebookHolder.length > 0 || twitterHolder.length > 0 ) {
			jQuery( window ).on( "YoastSEO:ready", function() {
				detectImageFallback();

				if ( facebookHolder.length > 0 ) {
					initFacebook( facebookHolder );
				}

				if ( twitterHolder.length > 0 ) {
					initTwitter( twitterHolder );
				}

				addHelpPanels();
				bindImageEvents();
			} );
		}
	}

	$( initYoastSocialPreviews );
}( jQuery ) );
