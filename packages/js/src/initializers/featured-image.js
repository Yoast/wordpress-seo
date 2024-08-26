/* global wp */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
import { select, subscribe } from "@wordpress/data";
import a11ySpeak from "a11y-speak";
import isBlockEditor from "../helpers/isBlockEditor";
import { __ } from "@wordpress/i18n";

/**
 * @summary Initializes the featured image integration.
 * @param {object} $ jQuery
 * @returns {void}
 */
export default function initFeaturedImageIntegration( $ ) {
	var featuredImagePlugin;
	var $featuredImageElement;
	var $postImageDiv;
	var $postImageDivHeading;

	/**
	 * A content analysis plugin for the featured image.
	 *
	 * @param {object} app The Yoast SEO app.
	 *
	 * @constructor
	 */
	var FeaturedImagePlugin = function( app ) {
		this._app = app;

		this.featuredImage = null;
		this.pluginName = "addFeaturedImagePlugin";

		this.registerPlugin();
		this.registerModifications();
	};

	/**
	 * Sets the featured image to use in the analysis
	 *
	 * @param {String} featuredImage The featured image to use.
	 *
	 * @returns {void}
	 */
	FeaturedImagePlugin.prototype.setFeaturedImage = function( featuredImage ) {
		this.featuredImage = featuredImage;

		this._app.pluginReloaded( this.pluginName );
	};

	/**
	 * Removes featured image and reloads analyzer
	 *
	 * @returns {void}
	 */
	FeaturedImagePlugin.prototype.removeFeaturedImage = function() {
		this.setFeaturedImage( null );
	};

	/**
	 * Registers this plugin to YoastSEO
	 *
	 * @returns {void}
	 */
	FeaturedImagePlugin.prototype.registerPlugin = function() {
		this._app.registerPlugin( this.pluginName, { status: "ready" } );
	};

	/**
	 * Registers modifications to YoastSEO
	 *
	 * @returns {void}
	 */
	FeaturedImagePlugin.prototype.registerModifications = function() {
		this._app.registerModification( "content", this.addImageToContent.bind( this ), this.pluginName, 10 );
	};

	/**
	 * Adds featured image to sort so it can be analyzed
	 *
	 * @param {String} content The content to alter.
	 *
	 * @returns {String} Returns the possible altered content.
	 */
	FeaturedImagePlugin.prototype.addImageToContent = function( content ) {
		if ( null !== this.featuredImage ) {
			content += this.featuredImage;
		}

		return content;
	};

	/**
	 * Remove opengraph warning frame and borders
	 *
	 * @returns {void}
	 */
	function removeOpengraphWarning() {
		$( "#yst_opengraph_image_warning" ).remove();
		$postImageDiv.removeClass( "yoast-opengraph-image-notice" );
	}

	/**
	 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
	 *
	 * @param {object} featuredImage The featured image object.
	 *
	 * @returns {void}
	 */
	function checkFeaturedImage( featuredImage ) {
		var attachment = featuredImage.state().get( "selection" ).first().toJSON();
		const featuredImageNotice = __( "SEO issue: The featured image should be at least 200 by 200 pixels to be picked up by Facebook and other social media sites.", "wordpress-seo" );

		if ( attachment.width < 200 || attachment.height < 200 ) {
			// Show warning to user and do not add image to OG
			if ( 0 === $( "#yst_opengraph_image_warning" ).length ) {
				// Create a warning using native WordPress notices styling.
				$( '<div id="yst_opengraph_image_warning" class="notice notice-error notice-alt"><p>' +
					featuredImageNotice +
					"</p></div>" )
					.insertAfter( $postImageDivHeading );

				$postImageDiv.addClass( "yoast-opengraph-image-notice" );

				a11ySpeak( featuredImageNotice, "assertive" );
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	/**
	 * Returns whether the featured image ID is a valid media ID.
	 *
	 * @param {*} featuredImageId The candidate featured image ID.
	 * @returns {boolean} Whether the given ID is a valid ID.
	 */
	function isValidMediaId( featuredImageId ) {
		return typeof featuredImageId === "number" && featuredImageId > 0;
	}

	var featuredImage = wp.media.featuredImage.frame();

	if ( typeof YoastSEO === "undefined" ) {
		return;
	}

	featuredImagePlugin = new FeaturedImagePlugin( YoastSEO.app );

	$postImageDiv = $( "#postimagediv" );
	$postImageDivHeading = $postImageDiv.find( ".hndle" );

	featuredImage.on( "select", function() {
		var selectedImageHTML, selectedImage, alt;

		checkFeaturedImage( featuredImage );

		selectedImage = featuredImage.state().get( "selection" ).first();

		alt = selectedImage.get( "alt" );

		selectedImageHTML = "<img" +
			' src="' + selectedImage.get( "url" ) + '"' +
			' width="' + selectedImage.get( "width" ) + '"' +
			' height="' + selectedImage.get( "height" ) + '"' +
			' alt="' + alt +
			'"/>';

		featuredImagePlugin.setFeaturedImage( selectedImageHTML );
	} );

	$postImageDiv.on( "click", "#remove-post-thumbnail", function() {
		featuredImagePlugin.removeFeaturedImage();
		removeOpengraphWarning();
	} );

	$featuredImageElement = $( "#set-post-thumbnail > img" );
	if ( "undefined" !== typeof $featuredImageElement.prop( "src" ) ) {
		featuredImagePlugin.setFeaturedImage( $( "#set-post-thumbnail " ).html() );
	}

	// Fallback for Gutenberg, as the featured image id does not exist there.
	if ( ! isBlockEditor() ) {
		return;
	}

	let imageData;
	let previousImageData;
	subscribe( () => {
		const featuredImageId = select( "core/editor" ).getEditedPostAttribute( "featured_media" );

		if ( ! isValidMediaId( featuredImageId ) ) {
			return;
		}

		imageData = select( "core" ).getMedia( featuredImageId );

		if ( typeof imageData === "undefined" ) {
			return;
		}

		if ( imageData !== previousImageData ) {
			previousImageData = imageData;
			const featuredImageHTML = `<img src="${imageData.source_url}" alt="${imageData.alt_text}" >`;
			featuredImagePlugin.setFeaturedImage( featuredImageHTML );
		}
	} );
}
