/* global wp */
/* global removeThumb:true */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
'use strict';
(function( $ ) {
	var featuredImagePlugin;
	var featuredImageElement;

	var FeaturedImagePlugin = function() {
		this.featuredImage = null;
		this.pluginName = 'addFeaturedImagePlugin';
	};

	/**
	 * Set's the featured image to use in the analysis
	 *
	 * @param {String} featuredImage
	 */
	FeaturedImagePlugin.prototype.setFeaturedImage = function( featuredImage ) {
		this.featuredImage = featuredImage;

		YoastSEO.app.pluginReloaded( this.pluginName );
	};

	/**
	 * Removes featured image and reloads analyzer
	 */
	FeaturedImagePlugin.prototype.removeFeaturedImage = function() {
		this.setFeaturedImage( null );
	};

	/**
	 * Registers this plugin to YoastSEO
	 */
	FeaturedImagePlugin.prototype.registerPlugin = function() {
		YoastSEO.app.registerPlugin( this.pluginName, { status: 'ready' } );
	};

	/**
	 * Registers modifications to YoastSEO
	 */
	FeaturedImagePlugin.prototype.registerModifications = function() {
		YoastSEO.app.registerModification( 'content', this.addImageToContent.bind( this ), this.pluginName, 10 );
	};

	/**
	 * Adds featured image to sort so it can be analyzed
	 *
	 * @param {String} content
	 * @returns {String}
	 */
	FeaturedImagePlugin.prototype.addImageToContent = function( content ) {
		if ( null !== this.featuredImage ) {
			content += this.featuredImage;
		}

		return content;
	};

	$( document ).ready( function() {
		var featuredImage = wp.media.featuredImage.frame();

		featuredImagePlugin = new FeaturedImagePlugin();
		featuredImagePlugin.registerPlugin();
		featuredImagePlugin.registerModifications();

		featuredImage.on( 'select', function() {
			var selectedImageHTML, selectedImage, alt;
			yst_checkFeaturedImage( featuredImage );

			selectedImage = featuredImage.state().get( 'selection' ).first();

			// WordPress falls back to the title for the alt attribute if no alt is present.
			alt = selectedImage.get( 'alt' );
			if ( '' === alt ) {
				alt = selectedImage.get( 'title' );
			}

			selectedImageHTML = '<img' +
					' src="' + selectedImage.get( 'url' ) + '"' +
					' width="' + selectedImage.get( 'width' ) + '"' +
					' height="' + selectedImage.get( 'height' ) + '"' +
					' alt="' + alt +
					'"/>';

			featuredImagePlugin.setFeaturedImage( selectedImageHTML );
		});

		$( '#postimagediv' ).on( 'click', '#remove-post-thumbnail', function() {
			featuredImagePlugin.removeFeaturedImage();
		});

		featuredImageElement = $( '#set-post-thumbnail > img' );
		if ( 'undefined' !== typeof featuredImageElement.prop( 'src' ) ) {
			featuredImagePlugin.setFeaturedImage( $( '#set-post-thumbnail ' ).html() );
		}
	});
}( jQuery ));

/**
 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
 * @param {object} featuredImage
 */
function yst_checkFeaturedImage( featuredImage ) {
	var attachment = featuredImage.state().get( 'selection' ).first().toJSON();

	if ( attachment.width < 200 || attachment.height < 200 ) {
		//Show warning to user and do not add image to OG
		if ( !document.getElementById( 'yst_opengraph_image_warning' ) ) {
			jQuery( '<div id="yst_opengraph_image_warning"><p>' + wpseoFeaturedImageL10n.featured_image_notice + '</p></div>' ).insertBefore( '#postimagediv' );
			document.getElementById( 'postimagediv' ).style.border = 'solid #dd3d36';
			document.getElementById( 'postimagediv' ).style.borderWidth = '3px 4px 4px 4px';
		}
	}

	yst_overrideElemFunction();
}

/**
 * Counter to make sure we do not end up in an endless loop if there' no remove-post-thumbnail id
 * @type {number}
 */
var thumbIdCounter = 0;

/**
 * Variable to hold the onclick function for remove-post-thumbnail.
 * @type {function}
 */
var removeThumb;

/**
 * If there's a remove-post-thumbnail id, add an onclick. When this id is clicked, call yst_removeOpengraphWarning
 * If not, check again after 100ms. Do not do this for more than 10 times so we do not end up in an endless loop
 */
function yst_overrideElemFunction() {
	if ( document.getElementById( 'remove-post-thumbnail' ) != null ) {
		thumbIdCounter = 0;
		removeThumb = document.getElementById( 'remove-post-thumbnail' ).onclick; // This variable is needed for core functionality to work
		document.getElementById( 'remove-post-thumbnail' ).onclick = yst_removeOpengraphWarning;
	}
	else {
		thumbIdCounter++;
		if ( thumbIdCounter < 10 ) {
			setTimeout( yst_overrideElemFunction, 100 );
		}
	}
}

/**
 * Remove error message
 */
function yst_removeOpengraphWarning() {
	jQuery( '#yst_opengraph_image_warning' ).remove();
	document.getElementById( 'postimagediv' ).style.border = 'none';

	//Make sure the original function does its work
	removeThumb();
}
