(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wpseoMediaL10n */
/* global ajaxurl */
/* global wp */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */

// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/
jQuery(document).ready(
	function($) {
		'use strict';
		if( typeof wp.media === 'undefined' ) {
			return;
		}

		$('.wpseo_image_upload_button').each(function(index, element) {
			var wpseo_target_id = $(element).attr('id').replace(/_button$/, '');
			var wpseo_custom_uploader = wp.media.frames.file_frame = wp.media({
				title: wpseoMediaL10n.choose_image,
				button: { text: wpseoMediaL10n.choose_image },
				multiple: false
			});

			wpseo_custom_uploader.on( 'select', function() {
					var attachment = wpseo_custom_uploader.state().get( 'selection' ).first().toJSON();
					$( '#' + wpseo_target_id ).val( attachment.url );
				}
			);

			$(element).click( function( e ) {
				e.preventDefault();
				wpseo_custom_uploader.open();
			} );
		} );
	}
);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLW1lZGlhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdwc2VvTWVkaWFMMTBuICovXG4vKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIHdwICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCAtVzAwMyAqL1xuLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuXG4vLyBUYWtlbiBhbmQgYWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cud2VibWFzdGVyLXNvdXJjZS5jb20vMjAxMy8wMi8wNi91c2luZy10aGUtd29yZHByZXNzLTMtNS1tZWRpYS11cGxvYWRlci1pbi15b3VyLXBsdWdpbi1vci10aGVtZS9cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoXG5cdGZ1bmN0aW9uKCQpIHtcblx0XHQndXNlIHN0cmljdCc7XG5cdFx0aWYoIHR5cGVvZiB3cC5tZWRpYSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JCgnLndwc2VvX2ltYWdlX3VwbG9hZF9idXR0b24nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgd3BzZW9fdGFyZ2V0X2lkID0gJChlbGVtZW50KS5hdHRyKCdpZCcpLnJlcGxhY2UoL19idXR0b24kLywgJycpO1xuXHRcdFx0dmFyIHdwc2VvX2N1c3RvbV91cGxvYWRlciA9IHdwLm1lZGlhLmZyYW1lcy5maWxlX2ZyYW1lID0gd3AubWVkaWEoe1xuXHRcdFx0XHR0aXRsZTogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlLFxuXHRcdFx0XHRidXR0b246IHsgdGV4dDogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlIH0sXG5cdFx0XHRcdG11bHRpcGxlOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdHdwc2VvX2N1c3RvbV91cGxvYWRlci5vbiggJ3NlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBhdHRhY2htZW50ID0gd3BzZW9fY3VzdG9tX3VwbG9hZGVyLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCkudG9KU09OKCk7XG5cdFx0XHRcdFx0JCggJyMnICsgd3BzZW9fdGFyZ2V0X2lkICkudmFsKCBhdHRhY2htZW50LnVybCApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHQkKGVsZW1lbnQpLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR3cHNlb19jdXN0b21fdXBsb2FkZXIub3BlbigpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuKTtcbiJdfQ==
