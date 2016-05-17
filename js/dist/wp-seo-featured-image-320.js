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

		this.registerPlugin();
		this.registerModifications();
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdwICovXG4vKiBnbG9iYWwgd3BzZW9GZWF0dXJlZEltYWdlTDEwbiAqL1xuLyogZ2xvYmFsIFlvYXN0U0VPICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCAtVzAwMyAqL1xuXG4oZnVuY3Rpb24oICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGZlYXR1cmVkSW1hZ2VQbHVnaW47XG5cdHZhciBmZWF0dXJlZEltYWdlRWxlbWVudDtcblxuXHR2YXIgRmVhdHVyZWRJbWFnZVBsdWdpbiA9IGZ1bmN0aW9uKCBhcHAgKSB7XG5cdFx0dGhpcy5fYXBwID0gYXBwO1xuXG5cdFx0dGhpcy5mZWF0dXJlZEltYWdlID0gbnVsbDtcblx0XHR0aGlzLnBsdWdpbk5hbWUgPSAnYWRkRmVhdHVyZWRJbWFnZVBsdWdpbic7XG5cblx0XHR0aGlzLnJlZ2lzdGVyUGx1Z2luKCk7XG5cdFx0dGhpcy5yZWdpc3Rlck1vZGlmaWNhdGlvbnMoKTtcblx0fTtcblxuXHQvKipcblx0ICogU2V0J3MgdGhlIGZlYXR1cmVkIGltYWdlIHRvIHVzZSBpbiB0aGUgYW5hbHlzaXNcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGZlYXR1cmVkSW1hZ2Vcblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnNldEZlYXR1cmVkSW1hZ2UgPSBmdW5jdGlvbiggZmVhdHVyZWRJbWFnZSApIHtcblx0XHR0aGlzLmZlYXR1cmVkSW1hZ2UgPSBmZWF0dXJlZEltYWdlO1xuXG5cdFx0dGhpcy5fYXBwLnBsdWdpblJlbG9hZGVkKCB0aGlzLnBsdWdpbk5hbWUgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZlcyBmZWF0dXJlZCBpbWFnZSBhbmQgcmVsb2FkcyBhbmFseXplclxuXHQgKi9cblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUucmVtb3ZlRmVhdHVyZWRJbWFnZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0RmVhdHVyZWRJbWFnZSggbnVsbCApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgdGhpcyBwbHVnaW4gdG8gWW9hc3RTRU9cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyUGx1Z2luID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyUGx1Z2luKCB0aGlzLnBsdWdpbk5hbWUsIHsgc3RhdHVzOiAncmVhZHknIH0gKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIG1vZGlmaWNhdGlvbnMgdG8gWW9hc3RTRU9cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggJ2NvbnRlbnQnLCB0aGlzLmFkZEltYWdlVG9Db250ZW50LmJpbmQoIHRoaXMgKSwgdGhpcy5wbHVnaW5OYW1lLCAxMCApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBBZGRzIGZlYXR1cmVkIGltYWdlIHRvIHNvcnQgc28gaXQgY2FuIGJlIGFuYWx5emVkXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjb250ZW50XG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGVudCA9IGZ1bmN0aW9uKCBjb250ZW50ICkge1xuXHRcdGlmICggbnVsbCAhPT0gdGhpcy5mZWF0dXJlZEltYWdlICkge1xuXHRcdFx0Y29udGVudCArPSB0aGlzLmZlYXR1cmVkSW1hZ2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH07XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGltYWdlIGlzIHNtYWxsZXIgdGhhbiAyMDB4MjAwIHBpeGVscy4gSWYgdGhpcyBpcyB0aGUgY2FzZSwgc2hvdyBhIHdhcm5pbmdcblx0ICogQHBhcmFtIHtvYmplY3R9IGZlYXR1cmVkSW1hZ2Vcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcblx0XHR2YXIgYXR0YWNobWVudCA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoICdzZWxlY3Rpb24nICkuZmlyc3QoKS50b0pTT04oKTtcblxuXHRcdGlmICggYXR0YWNobWVudC53aWR0aCA8IDIwMCB8fCBhdHRhY2htZW50LmhlaWdodCA8IDIwMCApIHtcblx0XHRcdC8vU2hvdyB3YXJuaW5nIHRvIHVzZXIgYW5kIGRvIG5vdCBhZGQgaW1hZ2UgdG8gT0dcblx0XHRcdGlmICggMCA9PT0gJCggJyN5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmcnICkubGVuZ3RoICkge1xuXHRcdFx0XHR2YXIgJHBvc3RJbWFnZURpdiA9ICQoICcjcG9zdGltYWdlZGl2JyApO1xuXHRcdFx0XHQkKCAnPGRpdiBpZD1cInlzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiPjxwPicgKyB3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuLmZlYXR1cmVkX2ltYWdlX25vdGljZSArICc8L3A+PC9kaXY+JyApLmluc2VydEJlZm9yZSggJHBvc3RJbWFnZURpdiApO1xuXHRcdFx0XHQkcG9zdEltYWdlRGl2LmNzcygge1xuXHRcdFx0XHRcdGJvcmRlcjogJ3NvbGlkICNkZDNkMzYnLFxuXHRcdFx0XHRcdGJvcmRlcldpZHRoOiAnM3B4IDRweCA0cHggNHB4J1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEZvcmNlIHJlc2V0IHdhcm5pbmdcblx0XHRcdHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlIG9wZW5ncmFwaCB3YXJuaW5nIGZyYW1lIGFuZCBib3JkZXJzXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCkge1xuXHRcdCQoICcjeXN0X29wZW5ncmFwaF9pbWFnZV93YXJuaW5nJyApLnJlbW92ZSgpO1xuXHRcdCQoICcjcG9zdGltYWdlZGl2JykuY3NzKCAnYm9yZGVyJywgJ25vbmUnICk7XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4gPSBuZXcgRmVhdHVyZWRJbWFnZVBsdWdpbiggWW9hc3RTRU8uYXBwICk7XG5cblx0XHRmZWF0dXJlZEltYWdlLm9uKCAnc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRJbWFnZUhUTUwsIHNlbGVjdGVkSW1hZ2UsIGFsdDtcblxuXHRcdFx0Y2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICk7XG5cblx0XHRcdHNlbGVjdGVkSW1hZ2UgPSBmZWF0dXJlZEltYWdlLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCk7XG5cblx0XHRcdC8vIFdvcmRQcmVzcyBmYWxscyBiYWNrIHRvIHRoZSB0aXRsZSBmb3IgdGhlIGFsdCBhdHRyaWJ1dGUgaWYgbm8gYWx0IGlzIHByZXNlbnQuXG5cdFx0XHRhbHQgPSBzZWxlY3RlZEltYWdlLmdldCggJ2FsdCcgKTtcblxuXHRcdFx0aWYgKCAnJyA9PT0gYWx0ICkge1xuXHRcdFx0XHRhbHQgPSBzZWxlY3RlZEltYWdlLmdldCggJ3RpdGxlJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3RlZEltYWdlSFRNTCA9ICc8aW1nJyArXG5cdFx0XHRcdCcgc3JjPVwiJyArIHNlbGVjdGVkSW1hZ2UuZ2V0KCAndXJsJyApICsgJ1wiJyArXG5cdFx0XHRcdCcgd2lkdGg9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoICd3aWR0aCcgKSArICdcIicgK1xuXHRcdFx0XHQnIGhlaWdodD1cIicgKyBzZWxlY3RlZEltYWdlLmdldCggJ2hlaWdodCcgKSArICdcIicgK1xuXHRcdFx0XHQnIGFsdD1cIicgKyBhbHQgK1xuXHRcdFx0XHQnXCIvPic7XG5cblx0XHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4uc2V0RmVhdHVyZWRJbWFnZSggc2VsZWN0ZWRJbWFnZUhUTUwgKTtcblx0XHR9KTtcblxuXHRcdCQoICcjcG9zdGltYWdlZGl2JyApLm9uKCAnY2xpY2snLCAnI3JlbW92ZS1wb3N0LXRodW1ibmFpbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5yZW1vdmVGZWF0dXJlZEltYWdlKCk7XG5cdFx0XHRyZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCk7XG5cdFx0fSk7XG5cblx0XHRmZWF0dXJlZEltYWdlRWxlbWVudCA9ICQoICcjc2V0LXBvc3QtdGh1bWJuYWlsID4gaW1nJyApO1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBmZWF0dXJlZEltYWdlRWxlbWVudC5wcm9wKCAnc3JjJyApICkge1xuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5zZXRGZWF0dXJlZEltYWdlKCAkKCAnI3NldC1wb3N0LXRodW1ibmFpbCAnICkuaHRtbCgpICk7XG5cdFx0fVxuXHR9KTtcbn0oIGpRdWVyeSApKTtcblxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuLyoqXG4gKiBDaGVjayBpZiBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gMjAweDIwMCBwaXhlbHMuIElmIHRoaXMgaXMgdGhlIGNhc2UsIHNob3cgYSB3YXJuaW5nXG4gKiBAcGFyYW0ge29iamVjdH0gZmVhdHVyZWRJbWFnZVxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG5mdW5jdGlvbiB5c3RfY2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICkge1xuXHRyZXR1cm47XG59XG5cbi8qKlxuICogQ291bnRlciB0byBtYWtlIHN1cmUgd2UgZG8gbm90IGVuZCB1cCBpbiBhbiBlbmRsZXNzIGxvb3AgaWYgdGhlcmUnIG5vIHJlbW92ZS1wb3N0LXRodW1ibmFpbCBpZFxuICogQHR5cGUge251bWJlcn1cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xudmFyIHRodW1iSWRDb3VudGVyID0gMDtcblxuLyoqXG4gKiBWYXJpYWJsZSB0byBob2xkIHRoZSBvbmNsaWNrIGZ1bmN0aW9uIGZvciByZW1vdmUtcG9zdC10aHVtYm5haWwuXG4gKiBAdHlwZSB7ZnVuY3Rpb259XG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbnZhciByZW1vdmVUaHVtYjtcblxuLyoqXG4gKiBJZiB0aGVyZSdzIGEgcmVtb3ZlLXBvc3QtdGh1bWJuYWlsIGlkLCBhZGQgYW4gb25jbGljay4gV2hlbiB0aGlzIGlkIGlzIGNsaWNrZWQsIGNhbGwgeXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmdcbiAqIElmIG5vdCwgY2hlY2sgYWdhaW4gYWZ0ZXIgMTAwbXMuIERvIG5vdCBkbyB0aGlzIGZvciBtb3JlIHRoYW4gMTAgdGltZXMgc28gd2UgZG8gbm90IGVuZCB1cCBpbiBhbiBlbmRsZXNzIGxvb3BcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xuZnVuY3Rpb24geXN0X292ZXJyaWRlRWxlbUZ1bmN0aW9uKCkge1xuXHRyZXR1cm47XG59XG5cbi8qKlxuICogUmVtb3ZlIGVycm9yIG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24geXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKSB7XG5cdHJldHVybjtcbn1cblxud2luZG93LnlzdF9jaGVja0ZlYXR1cmVkSW1hZ2UgPSB5c3RfY2hlY2tGZWF0dXJlZEltYWdlO1xud2luZG93LnRodW1iSWRDb3VudGVyID0gdGh1bWJJZENvdW50ZXI7XG53aW5kb3cucmVtb3ZlVGh1bWIgPSByZW1vdmVUaHVtYjtcbndpbmRvdy55c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb24gPSB5c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb247XG53aW5kb3cueXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmcgPSB5c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZztcbi8qIGpzaGludCBpZ25vcmU6ZW5kICovXG4iXX0=
