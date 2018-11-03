/* global wp */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
import a11ySpeak from "a11y-speak";

( function( $ ) {
	var featuredImagePlugin;
	var $featuredImageElement;
	var $postImageDiv;
	var $postImageDivHeading;

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

		if ( attachment.width < 200 || attachment.height < 200 ) {
			// Show warning to user and do not add image to OG
			if ( 0 === $( "#yst_opengraph_image_warning" ).length ) {
				// Create a warning using native WordPress notices styling.
				$( '<div id="yst_opengraph_image_warning" class="notice notice-error notice-alt"><p>' +
					wpseoFeaturedImageL10n.featured_image_notice +
					"</p></div>" )
					.insertAfter( $postImageDivHeading );

				$postImageDiv.addClass( "yoast-opengraph-image-notice" );

				a11ySpeak( wpseoFeaturedImageL10n.featured_image_notice, "assertive" );
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	$( document ).ready( function() {
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

			// WordPress falls back to the title for the alt attribute if no alt is present.
			alt = selectedImage.get( "alt" );

			if ( "" === alt ) {
				alt = selectedImage.get( "title" );
			}

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
	} );
}( jQuery ) );

/* eslint-disable */
/* jshint ignore:start */
/**
 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
 * @param {object} featuredImage
 *
 * @deprecated since 3.1
 */
function yst_checkFeaturedImage( featuredImage ) {
	return;
}

/**
 * Counter to make sure we do not end up in an endless loop if there' no remove-post-thumbnail id
 * @type {number}
 *
 * @deprecated since 3.1
 */
var thumbIdCounter = 0;

/**
 * Variable to hold the onclick function for remove-post-thumbnail.
 * @type {function}
 *
 * @deprecated since 3.1
 */
var removeThumb;

/**
 * If there's a remove-post-thumbnail id, add an onclick. When this id is clicked, call yst_removeOpengraphWarning
 * If not, check again after 100ms. Do not do this for more than 10 times so we do not end up in an endless loop
 *
 * @deprecated since 3.1
 */
function yst_overrideElemFunction() {
	return;
}

/**
 * Remove error message
 */
function yst_removeOpengraphWarning() {
	return;
}

window.yst_checkFeaturedImage = yst_checkFeaturedImage;
window.thumbIdCounter = thumbIdCounter;
window.removeThumb = removeThumb;
window.yst_overrideElemFunction = yst_overrideElemFunction;
window.yst_removeOpengraphWarning = yst_removeOpengraphWarning;
/* jshint ignore:end */
/* eslint-enable */
