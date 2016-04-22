(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wp */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */

(function( $ ) {
	'use strict';
	var featuredImagePlugin;
	var featuredImageElement;

	var FeaturedImagePlugin = function( app ) {
		this._app = app;

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

		this._app.pluginReloaded( this.pluginName );
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
		this._app.registerPlugin( this.pluginName, { status: 'ready' } );
	};

	/**
	 * Registers modifications to YoastSEO
	 */
	FeaturedImagePlugin.prototype.registerModifications = function() {
		this._app.registerModification( 'content', this.addImageToContent.bind( this ), this.pluginName, 10 );
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

	/**
	 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
	 * @param {object} featuredImage
	 */
	function checkFeaturedImage( featuredImage ) {
		var attachment = featuredImage.state().get( 'selection' ).first().toJSON();

		if ( attachment.width < 200 || attachment.height < 200 ) {
			//Show warning to user and do not add image to OG
			if ( 0 === $( '#yst_opengraph_image_warning' ).length ) {
				var $postImageDiv = $( '#postimagediv' );
				$( '<div id="yst_opengraph_image_warning"><p>' + wpseoFeaturedImageL10n.featured_image_notice + '</p></div>' ).insertBefore( $postImageDiv );
				$postImageDiv.css( {
					border: 'solid #dd3d36',
					borderWidth: '3px 4px 4px 4px'
				} );
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	/**
	 * Remove opengraph warning frame and borders
	 */
	function removeOpengraphWarning() {
		$( '#yst_opengraph_image_warning' ).remove();
		$( '#postimagediv').css( 'border', 'none' );
	}

	$( document ).ready( function() {
		var featuredImage = wp.media.featuredImage.frame();

		featuredImagePlugin = new FeaturedImagePlugin( YoastSEO.app );
		featuredImagePlugin.registerPlugin();
		featuredImagePlugin.registerModifications();

		featuredImage.on( 'select', function() {
			var selectedImageHTML, selectedImage, alt;

			checkFeaturedImage( featuredImage );

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
			removeOpengraphWarning();
		});

		featuredImageElement = $( '#set-post-thumbnail > img' );
		if ( 'undefined' !== typeof featuredImageElement.prop( 'src' ) ) {
			featuredImagePlugin.setFeaturedImage( $( '#set-post-thumbnail ' ).html() );
		}
	});
}( jQuery ));

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

},{}]},{},[1]);
