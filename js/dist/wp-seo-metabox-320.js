(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* browser:true */
/* global tb_show, wpseoSelect2Locale */
(function( $ ) {
	'use strict';

	window.wpseo_init_tabs = function() {
		if ( jQuery( '.wpseo-metabox-tabs-div' ).length > 0 ) {
			var active_tab = window.location.hash;
			if ( active_tab === '' || active_tab.search( 'wpseo' ) === -1 ) {
				active_tab = 'content';
			}
			else {
				active_tab = active_tab.replace( '#wpseo_', '' );
			}
			jQuery( '.' + active_tab ).addClass( 'active' );

			jQuery( '.wpseo-metabox-tabs' ).on( 'click', 'a.wpseo_tablink', function( ev ) {
					ev.preventDefault();

					jQuery( '.wpseo-meta-section.active .wpseo-metabox-tabs li' ).removeClass( 'active' );
					jQuery( '.wpseo-meta-section.active .wpseotab' ).removeClass( 'active' );

					var targetElem = jQuery( jQuery( this ).attr( 'href' ) );
					targetElem.addClass( 'active' );
					jQuery( this ).parent( 'li' ).addClass( 'active' );

					if ( jQuery( this ).hasClass( 'scroll' ) ) {
						jQuery( 'html, body' ).animate( {
								scrollTop: jQuery( targetElem ).offset().top
							}, 500
						);
					}
				}
			);
		}

		if ( jQuery( '.wpseo-meta-section' ).length > 0 ) {
			var active_page = window.location.hash;
			if ( active_page === '' || active_page.search( 'wpseo' ) === -1 ) {
				active_page = 'content';
			}
			else {
				active_page = active_page.replace( '#wpseo-meta-section-', '' );
			}
			jQuery( '#wpseo-meta-section-' + active_page ).addClass( 'active' );
			jQuery( '.wpseo-metabox-sidebar li').filter( function() {
				return jQuery( this ).find('.wpseo-meta-section-link').attr( 'href' ) === '#wpseo-meta-section-' + active_page;
			} ).addClass('active');

			jQuery( 'a.wpseo-meta-section-link' ).click( function( ev ) {
					ev.preventDefault();

					jQuery( '.wpseo-metabox-sidebar li' ).removeClass( 'active' );
					jQuery( '.wpseo-meta-section' ).removeClass( 'active' );

					var targetElem = jQuery( jQuery( this ).attr( 'href' ) );
					targetElem.addClass( 'active' );

					jQuery( this ).parent( 'li' ).addClass( 'active' );
				}
			);
		}

		jQuery( '.wpseo-heading' ).hide();
		jQuery( '.wpseo-metabox-tabs' ).show();
		// End Tabs code
	};

	/**
	 * Adds keyword popup if the template for it is found
	 */
	function initAddKeywordPopup() {
		// If add keyword popup exists bind it to the add keyword button
		if ( 1 === $( '#wpseo-add-keyword-popup' ).length ) {
			$( '.wpseo-add-keyword' ).on( 'click', addKeywordPopup );
		}
	}

	/**
	 * Adds select2 for selected fields.
	 */
	function initSelect2() {
		// Select2 for Yoast SEO Metabox Advanced tab
		$( '#yoast_wpseo_meta-robots-noindex' ).select2( { width: '100%', language: wpseoSelect2Locale } );
		$( '#yoast_wpseo_meta-robots-adv' ).select2( { width: '100%', language: wpseoSelect2Locale } );
	}

	/**
	 * Shows a informational popup if someone click the add keyword button
	 */
	function addKeywordPopup() {
		var $buyButton = $( '#wpseo-add-keyword-popup-button' ),
			title = $buyButton.text(),
			$popupWindow,
			$closeButton;

		tb_show( title, '#TB_inline?width=650&height=350&inlineId=wpseo-add-keyword-popup', 'group' );

		// The thicbox popup UI is now available.
		$popupWindow = $( '#TB_window' );
		$closeButton = $( '#TB_closeWindowButton' );

		// The container window isn't the correct size, rectify this and also the centering.
		$popupWindow.css({ width: 680, height: 235, 'margin-left': -340 });

		// Accessibility improvements.
		$popupWindow
			.attr({
				role: 'dialog',
				'aria-labelledby': 'TB_ajaxWindowTitle',
				'aria-describedby': 'TB_ajaxContent'
			})
			.on( 'keydown', function( event ) {
				var id;

				// Constrain tabbing within the modal.
				if ( 9 === event.which ) {
					id = event.target.id;

					if ( id === 'wpseo-add-keyword-popup-button' && ! event.shiftKey ) {
						$closeButton.focus();
						event.preventDefault();
					} else if ( id === 'TB_closeWindowButton' && event.shiftKey ) {
						$buyButton.focus();
						event.preventDefault();
					}
				}
			});

		// Move focus back to the element that opened the modal.
		$( 'body' ).on( 'thickbox:removed', function() {
			$( '.wpseo-add-keyword' ).focus();
		});
	}

	jQuery( document ).ready( function() {
		jQuery( '.wpseo-meta-section').each( function( _, el ) {
			jQuery( el ).find( '.wpseo-metabox-tabs li:first' ).addClass( 'active' );
			jQuery( el ).find( '.wpseotab:first' ).addClass( 'active' );
		});
		window.wpseo_init_tabs();

		initAddKeywordPopup();
		initSelect2();
	});
}( jQuery ));

/* jshint ignore:start */
/**
 * Cleans up a string, removing script tags etc.
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @returns {string}
 */
function ystClean( str ) {
	console.error( 'ystClean is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return str;
}

/**
 * Tests whether given element `str` matches `p`.
 *
 * @deprecated since version 3.0
 *
 * @param {string} str The string to match
 * @param {RegExp} p The regex to match
 * @returns {string}
 */
function ystFocusKwTest( str, p ) {
	console.error( 'ystFocusKwTest is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return '';
}

/**
 * The function name says it all, removes lower case diacritics
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @returns {string}
 */
function ystRemoveLowerCaseDiacritics( str ) {
	console.error( 'ystRemoveLowerCaseDiacritics is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return str;
}

/**
 * Tests whether the focus keyword is used in title, body and description
 *
 * @deprecated since version 3.0
 */
function ystTestFocusKw() {
	console.error( 'ystTestFocusKw is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );
}

/**
 * This callback is used for variable replacement
 *
 * This is done through a callback as it _could_ be that `ystReplaceVariables` has to do an AJAX request.
 *
 * @callback replaceVariablesCallback
 * @param {string} str The string with the replaced variables in it
 */

/**
 * Replaces variables either with values from wpseoMetaboxL10n, by grabbing them from the page or (ultimately) getting them through AJAX
 *
 * @deprecated since version 3.0
 *
 * @param {string} str The string with variables to be replaced
 * @param {replaceVariablesCallback} callback Callback function for when the
 */
function ystReplaceVariables( str, callback ) {
	console.error( 'ystReplaceVariables is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	callback( str );
}

/**
 * Replace a variable with a string, through an AJAX call to WP
 *
 * @deprecated since version 3.0
 *
 * @param {string} replaceableVar
 * @param {replaceVariablesCallback} callback
 */
function ystAjaxReplaceVariables( replaceableVar, callback ) {
	console.error( 'ystAjaxReplaceVariables is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );
}

/**
 * Updates the title in the snippet preview
 *
 * @deprecated since version 3.0
 *
 * @param {boolean} [force = false]
 */
function ystUpdateTitle( force ) {
	console.error( 'ystUpdateTitle is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );
}

/**
 * Cleans the title before use
 *
 * @deprecated since version 3.0
 *
 * @param {string} title
 * @returns {string}
 */
function ystSanitizeTitle( title ) {
	console.error( 'ystSanitizeTitle is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return title;
}

/**
 * Updates the meta description in the snippet preview
 *
 * @deprecated since version 3.0
 */
function ystUpdateDesc() {
	console.error( 'ystUpdateDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );
}

/**
 * Sanitized the description
 *
 * @deprecated since version 3.0
 *
 * @param {string} desc
 * @returns {string}
 */
function ystSanitizeDesc( desc ) {
	console.error( 'ystSanitizeDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return desc;
}

/**
 * Trims the description to the desired length
 *
 * @deprecated since version 3.0
 *
 * @param {string} desc
 * @returns {string}
 */
function ystTrimDesc( desc ) {
	console.error( 'ystTrimDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return desc;
}

/**
 * Updates the URL in the snippet preview
 *
 * @deprecated since version 3.0
 */
function ystUpdateURL() {
	console.error( 'ystUpdateURL is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );
}

/**
 * Bolds the keywords in a string
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @param {boolean} url
 * @returns {string}
 */
function ystBoldKeywords( str, url ) {
	console.error( 'ystBoldKeywords is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return str;
}

/**
 * Updates the entire snippet preview
 *
 * @deprecated since version 3.0
 */
function ystUpdateSnippet() {
	console.error( 'ystUpdateSnippet is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );
}

/**
 * Escapres the focus keyword
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @returns {string}
 */
function ystEscapeFocusKw( str ) {
	console.error( 'ystEscapeFocusKw is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.' );

	return str;
}

window.ystClean = ystClean;
window.ystFocusKwTest = ystFocusKwTest;
window.ystRemoveLowerCaseDiacritics = ystRemoveLowerCaseDiacritics;
window.ystTestFocusKw = ystTestFocusKw;
window.ystReplaceVariables = ystReplaceVariables;
window.ystAjaxReplaceVariables = ystAjaxReplaceVariables;
window.ystUpdateTitle = ystUpdateTitle;
window.ystSanitizeTitle = ystSanitizeTitle;
window.ystUpdateDesc = ystUpdateDesc;
window.ystSanitizeDesc = ystSanitizeDesc;
window.ystTrimDesc = ystTrimDesc;
window.ystUpdateURL = ystUpdateURL;
window.ystBoldKeywords = ystBoldKeywords;
window.ystUpdateSnippet = ystUpdateSnippet;
window.ystEscapeFocusKw = ystEscapeFocusKw;
/* jshint ignore:end */

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW1ldGFib3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBicm93c2VyOnRydWUgKi9cbi8qIGdsb2JhbCB0Yl9zaG93LCB3cHNlb1NlbGVjdDJMb2NhbGUgKi9cbihmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHdpbmRvdy53cHNlb19pbml0X3RhYnMgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIGpRdWVyeSggJy53cHNlby1tZXRhYm94LXRhYnMtZGl2JyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgYWN0aXZlX3RhYiA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdFx0aWYgKCBhY3RpdmVfdGFiID09PSAnJyB8fCBhY3RpdmVfdGFiLnNlYXJjaCggJ3dwc2VvJyApID09PSAtMSApIHtcblx0XHRcdFx0YWN0aXZlX3RhYiA9ICdjb250ZW50Jztcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRhY3RpdmVfdGFiID0gYWN0aXZlX3RhYi5yZXBsYWNlKCAnI3dwc2VvXycsICcnICk7XG5cdFx0XHR9XG5cdFx0XHRqUXVlcnkoICcuJyArIGFjdGl2ZV90YWIgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0alF1ZXJ5KCAnLndwc2VvLW1ldGFib3gtdGFicycgKS5vbiggJ2NsaWNrJywgJ2Eud3BzZW9fdGFibGluaycsIGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0alF1ZXJ5KCAnLndwc2VvLW1ldGEtc2VjdGlvbi5hY3RpdmUgLndwc2VvLW1ldGFib3gtdGFicyBsaScgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRqUXVlcnkoICcud3BzZW8tbWV0YS1zZWN0aW9uLmFjdGl2ZSAud3BzZW90YWInICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdFx0XHR2YXIgdGFyZ2V0RWxlbSA9IGpRdWVyeSggalF1ZXJ5KCB0aGlzICkuYXR0ciggJ2hyZWYnICkgKTtcblx0XHRcdFx0XHR0YXJnZXRFbGVtLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdGpRdWVyeSggdGhpcyApLnBhcmVudCggJ2xpJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5oYXNDbGFzcyggJ3Njcm9sbCcgKSApIHtcblx0XHRcdFx0XHRcdGpRdWVyeSggJ2h0bWwsIGJvZHknICkuYW5pbWF0ZSgge1xuXHRcdFx0XHRcdFx0XHRcdHNjcm9sbFRvcDogalF1ZXJ5KCB0YXJnZXRFbGVtICkub2Zmc2V0KCkudG9wXG5cdFx0XHRcdFx0XHRcdH0sIDUwMFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkoICcud3BzZW8tbWV0YS1zZWN0aW9uJyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgYWN0aXZlX3BhZ2UgPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRcdGlmICggYWN0aXZlX3BhZ2UgPT09ICcnIHx8IGFjdGl2ZV9wYWdlLnNlYXJjaCggJ3dwc2VvJyApID09PSAtMSApIHtcblx0XHRcdFx0YWN0aXZlX3BhZ2UgPSAnY29udGVudCc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YWN0aXZlX3BhZ2UgPSBhY3RpdmVfcGFnZS5yZXBsYWNlKCAnI3dwc2VvLW1ldGEtc2VjdGlvbi0nLCAnJyApO1xuXHRcdFx0fVxuXHRcdFx0alF1ZXJ5KCAnI3dwc2VvLW1ldGEtc2VjdGlvbi0nICsgYWN0aXZlX3BhZ2UgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdGpRdWVyeSggJy53cHNlby1tZXRhYm94LXNpZGViYXIgbGknKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4galF1ZXJ5KCB0aGlzICkuZmluZCgnLndwc2VvLW1ldGEtc2VjdGlvbi1saW5rJykuYXR0ciggJ2hyZWYnICkgPT09ICcjd3BzZW8tbWV0YS1zZWN0aW9uLScgKyBhY3RpdmVfcGFnZTtcblx0XHRcdH0gKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRcdGpRdWVyeSggJ2Eud3BzZW8tbWV0YS1zZWN0aW9uLWxpbmsnICkuY2xpY2soIGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0alF1ZXJ5KCAnLndwc2VvLW1ldGFib3gtc2lkZWJhciBsaScgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRqUXVlcnkoICcud3BzZW8tbWV0YS1zZWN0aW9uJyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0dmFyIHRhcmdldEVsZW0gPSBqUXVlcnkoIGpRdWVyeSggdGhpcyApLmF0dHIoICdocmVmJyApICk7XG5cdFx0XHRcdFx0dGFyZ2V0RWxlbS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0XHRcdGpRdWVyeSggdGhpcyApLnBhcmVudCggJ2xpJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGpRdWVyeSggJy53cHNlby1oZWFkaW5nJyApLmhpZGUoKTtcblx0XHRqUXVlcnkoICcud3BzZW8tbWV0YWJveC10YWJzJyApLnNob3coKTtcblx0XHQvLyBFbmQgVGFicyBjb2RlXG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZHMga2V5d29yZCBwb3B1cCBpZiB0aGUgdGVtcGxhdGUgZm9yIGl0IGlzIGZvdW5kXG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0QWRkS2V5d29yZFBvcHVwKCkge1xuXHRcdC8vIElmIGFkZCBrZXl3b3JkIHBvcHVwIGV4aXN0cyBiaW5kIGl0IHRvIHRoZSBhZGQga2V5d29yZCBidXR0b25cblx0XHRpZiAoIDEgPT09ICQoICcjd3BzZW8tYWRkLWtleXdvcmQtcG9wdXAnICkubGVuZ3RoICkge1xuXHRcdFx0JCggJy53cHNlby1hZGQta2V5d29yZCcgKS5vbiggJ2NsaWNrJywgYWRkS2V5d29yZFBvcHVwICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgc2VsZWN0MiBmb3Igc2VsZWN0ZWQgZmllbGRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFNlbGVjdDIoKSB7XG5cdFx0Ly8gU2VsZWN0MiBmb3IgWW9hc3QgU0VPIE1ldGFib3ggQWR2YW5jZWQgdGFiXG5cdFx0JCggJyN5b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2luZGV4JyApLnNlbGVjdDIoIHsgd2lkdGg6ICcxMDAlJywgbGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSB9ICk7XG5cdFx0JCggJyN5b2FzdF93cHNlb19tZXRhLXJvYm90cy1hZHYnICkuc2VsZWN0MiggeyB3aWR0aDogJzEwMCUnLCBsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlIH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93cyBhIGluZm9ybWF0aW9uYWwgcG9wdXAgaWYgc29tZW9uZSBjbGljayB0aGUgYWRkIGtleXdvcmQgYnV0dG9uXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRLZXl3b3JkUG9wdXAoKSB7XG5cdFx0dmFyICRidXlCdXR0b24gPSAkKCAnI3dwc2VvLWFkZC1rZXl3b3JkLXBvcHVwLWJ1dHRvbicgKSxcblx0XHRcdHRpdGxlID0gJGJ1eUJ1dHRvbi50ZXh0KCksXG5cdFx0XHQkcG9wdXBXaW5kb3csXG5cdFx0XHQkY2xvc2VCdXR0b247XG5cblx0XHR0Yl9zaG93KCB0aXRsZSwgJyNUQl9pbmxpbmU/d2lkdGg9NjUwJmhlaWdodD0zNTAmaW5saW5lSWQ9d3BzZW8tYWRkLWtleXdvcmQtcG9wdXAnLCAnZ3JvdXAnICk7XG5cblx0XHQvLyBUaGUgdGhpY2JveCBwb3B1cCBVSSBpcyBub3cgYXZhaWxhYmxlLlxuXHRcdCRwb3B1cFdpbmRvdyA9ICQoICcjVEJfd2luZG93JyApO1xuXHRcdCRjbG9zZUJ1dHRvbiA9ICQoICcjVEJfY2xvc2VXaW5kb3dCdXR0b24nICk7XG5cblx0XHQvLyBUaGUgY29udGFpbmVyIHdpbmRvdyBpc24ndCB0aGUgY29ycmVjdCBzaXplLCByZWN0aWZ5IHRoaXMgYW5kIGFsc28gdGhlIGNlbnRlcmluZy5cblx0XHQkcG9wdXBXaW5kb3cuY3NzKHsgd2lkdGg6IDY4MCwgaGVpZ2h0OiAyMzUsICdtYXJnaW4tbGVmdCc6IC0zNDAgfSk7XG5cblx0XHQvLyBBY2Nlc3NpYmlsaXR5IGltcHJvdmVtZW50cy5cblx0XHQkcG9wdXBXaW5kb3dcblx0XHRcdC5hdHRyKHtcblx0XHRcdFx0cm9sZTogJ2RpYWxvZycsXG5cdFx0XHRcdCdhcmlhLWxhYmVsbGVkYnknOiAnVEJfYWpheFdpbmRvd1RpdGxlJyxcblx0XHRcdFx0J2FyaWEtZGVzY3JpYmVkYnknOiAnVEJfYWpheENvbnRlbnQnXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dmFyIGlkO1xuXG5cdFx0XHRcdC8vIENvbnN0cmFpbiB0YWJiaW5nIHdpdGhpbiB0aGUgbW9kYWwuXG5cdFx0XHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdFx0aWQgPSBldmVudC50YXJnZXQuaWQ7XG5cblx0XHRcdFx0XHRpZiAoIGlkID09PSAnd3BzZW8tYWRkLWtleXdvcmQtcG9wdXAtYnV0dG9uJyAmJiAhIGV2ZW50LnNoaWZ0S2V5ICkge1xuXHRcdFx0XHRcdFx0JGNsb3NlQnV0dG9uLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIGlkID09PSAnVEJfY2xvc2VXaW5kb3dCdXR0b24nICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXHRcdFx0XHRcdFx0JGJ1eUJ1dHRvbi5mb2N1cygpO1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0Ly8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBlbGVtZW50IHRoYXQgb3BlbmVkIHRoZSBtb2RhbC5cblx0XHQkKCAnYm9keScgKS5vbiggJ3RoaWNrYm94OnJlbW92ZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdCQoICcud3BzZW8tYWRkLWtleXdvcmQnICkuZm9jdXMoKTtcblx0XHR9KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCAnLndwc2VvLW1ldGEtc2VjdGlvbicpLmVhY2goIGZ1bmN0aW9uKCBfLCBlbCApIHtcblx0XHRcdGpRdWVyeSggZWwgKS5maW5kKCAnLndwc2VvLW1ldGFib3gtdGFicyBsaTpmaXJzdCcgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdGpRdWVyeSggZWwgKS5maW5kKCAnLndwc2VvdGFiOmZpcnN0JyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH0pO1xuXHRcdHdpbmRvdy53cHNlb19pbml0X3RhYnMoKTtcblxuXHRcdGluaXRBZGRLZXl3b3JkUG9wdXAoKTtcblx0XHRpbml0U2VsZWN0MigpO1xuXHR9KTtcbn0oIGpRdWVyeSApKTtcblxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuLyoqXG4gKiBDbGVhbnMgdXAgYSBzdHJpbmcsIHJlbW92aW5nIHNjcmlwdCB0YWdzIGV0Yy5cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdENsZWFuKCBzdHIgKSB7XG5cdGNvbnNvbGUuZXJyb3IoICd5c3RDbGVhbiBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xuXG5cdHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogVGVzdHMgd2hldGhlciBnaXZlbiBlbGVtZW50IGBzdHJgIG1hdGNoZXMgYHBgLlxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIG1hdGNoXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcCBUaGUgcmVnZXggdG8gbWF0Y2hcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdEZvY3VzS3dUZXN0KCBzdHIsIHAgKSB7XG5cdGNvbnNvbGUuZXJyb3IoICd5c3RGb2N1c0t3VGVzdCBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xuXG5cdHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gbmFtZSBzYXlzIGl0IGFsbCwgcmVtb3ZlcyBsb3dlciBjYXNlIGRpYWNyaXRpY3NcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdFJlbW92ZUxvd2VyQ2FzZURpYWNyaXRpY3MoIHN0ciApIHtcblx0Y29uc29sZS5lcnJvciggJ3lzdFJlbW92ZUxvd2VyQ2FzZURpYWNyaXRpY3MgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLicgKTtcblxuXHRyZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgdGhlIGZvY3VzIGtleXdvcmQgaXMgdXNlZCBpbiB0aXRsZSwgYm9keSBhbmQgZGVzY3JpcHRpb25cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICovXG5mdW5jdGlvbiB5c3RUZXN0Rm9jdXNLdygpIHtcblx0Y29uc29sZS5lcnJvciggJ3lzdFRlc3RGb2N1c0t3IGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC4nICk7XG59XG5cbi8qKlxuICogVGhpcyBjYWxsYmFjayBpcyB1c2VkIGZvciB2YXJpYWJsZSByZXBsYWNlbWVudFxuICpcbiAqIFRoaXMgaXMgZG9uZSB0aHJvdWdoIGEgY2FsbGJhY2sgYXMgaXQgX2NvdWxkXyBiZSB0aGF0IGB5c3RSZXBsYWNlVmFyaWFibGVzYCBoYXMgdG8gZG8gYW4gQUpBWCByZXF1ZXN0LlxuICpcbiAqIEBjYWxsYmFjayByZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB3aXRoIHRoZSByZXBsYWNlZCB2YXJpYWJsZXMgaW4gaXRcbiAqL1xuXG4vKipcbiAqIFJlcGxhY2VzIHZhcmlhYmxlcyBlaXRoZXIgd2l0aCB2YWx1ZXMgZnJvbSB3cHNlb01ldGFib3hMMTBuLCBieSBncmFiYmluZyB0aGVtIGZyb20gdGhlIHBhZ2Ugb3IgKHVsdGltYXRlbHkpIGdldHRpbmcgdGhlbSB0aHJvdWdoIEFKQVhcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB3aXRoIHZhcmlhYmxlcyB0byBiZSByZXBsYWNlZFxuICogQHBhcmFtIHtyZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2t9IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB3aGVuIHRoZVxuICovXG5mdW5jdGlvbiB5c3RSZXBsYWNlVmFyaWFibGVzKCBzdHIsIGNhbGxiYWNrICkge1xuXHRjb25zb2xlLmVycm9yKCAneXN0UmVwbGFjZVZhcmlhYmxlcyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xuXG5cdGNhbGxiYWNrKCBzdHIgKTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlIGEgdmFyaWFibGUgd2l0aCBhIHN0cmluZywgdGhyb3VnaCBhbiBBSkFYIGNhbGwgdG8gV1BcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXBsYWNlYWJsZVZhclxuICogQHBhcmFtIHtyZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIHlzdEFqYXhSZXBsYWNlVmFyaWFibGVzKCByZXBsYWNlYWJsZVZhciwgY2FsbGJhY2sgKSB7XG5cdGNvbnNvbGUuZXJyb3IoICd5c3RBamF4UmVwbGFjZVZhcmlhYmxlcyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHRpdGxlIGluIHRoZSBzbmlwcGV0IHByZXZpZXdcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZvcmNlID0gZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHlzdFVwZGF0ZVRpdGxlKCBmb3JjZSApIHtcblx0Y29uc29sZS5lcnJvciggJ3lzdFVwZGF0ZVRpdGxlIGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC4nICk7XG59XG5cbi8qKlxuICogQ2xlYW5zIHRoZSB0aXRsZSBiZWZvcmUgdXNlXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdFNhbml0aXplVGl0bGUoIHRpdGxlICkge1xuXHRjb25zb2xlLmVycm9yKCAneXN0U2FuaXRpemVUaXRsZSBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xuXG5cdHJldHVybiB0aXRsZTtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBtZXRhIGRlc2NyaXB0aW9uIGluIHRoZSBzbmlwcGV0IHByZXZpZXdcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICovXG5mdW5jdGlvbiB5c3RVcGRhdGVEZXNjKCkge1xuXHRjb25zb2xlLmVycm9yKCAneXN0VXBkYXRlRGVzYyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xufVxuXG4vKipcbiAqIFNhbml0aXplZCB0aGUgZGVzY3JpcHRpb25cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB5c3RTYW5pdGl6ZURlc2MoIGRlc2MgKSB7XG5cdGNvbnNvbGUuZXJyb3IoICd5c3RTYW5pdGl6ZURlc2MgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLicgKTtcblxuXHRyZXR1cm4gZGVzYztcbn1cblxuLyoqXG4gKiBUcmltcyB0aGUgZGVzY3JpcHRpb24gdG8gdGhlIGRlc2lyZWQgbGVuZ3RoXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0VHJpbURlc2MoIGRlc2MgKSB7XG5cdGNvbnNvbGUuZXJyb3IoICd5c3RUcmltRGVzYyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xuXG5cdHJldHVybiBkZXNjO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIFVSTCBpbiB0aGUgc25pcHBldCBwcmV2aWV3XG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqL1xuZnVuY3Rpb24geXN0VXBkYXRlVVJMKCkge1xuXHRjb25zb2xlLmVycm9yKCAneXN0VXBkYXRlVVJMIGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC4nICk7XG59XG5cbi8qKlxuICogQm9sZHMgdGhlIGtleXdvcmRzIGluIGEgc3RyaW5nXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVybFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0Qm9sZEtleXdvcmRzKCBzdHIsIHVybCApIHtcblx0Y29uc29sZS5lcnJvciggJ3lzdEJvbGRLZXl3b3JkcyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuJyApO1xuXG5cdHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgZW50aXJlIHNuaXBwZXQgcHJldmlld1xuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKi9cbmZ1bmN0aW9uIHlzdFVwZGF0ZVNuaXBwZXQoKSB7XG5cdGNvbnNvbGUuZXJyb3IoICd5c3RVcGRhdGVTbmlwcGV0IGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC4nICk7XG59XG5cbi8qKlxuICogRXNjYXByZXMgdGhlIGZvY3VzIGtleXdvcmRcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdEVzY2FwZUZvY3VzS3coIHN0ciApIHtcblx0Y29uc29sZS5lcnJvciggJ3lzdEVzY2FwZUZvY3VzS3cgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLicgKTtcblxuXHRyZXR1cm4gc3RyO1xufVxuXG53aW5kb3cueXN0Q2xlYW4gPSB5c3RDbGVhbjtcbndpbmRvdy55c3RGb2N1c0t3VGVzdCA9IHlzdEZvY3VzS3dUZXN0O1xud2luZG93LnlzdFJlbW92ZUxvd2VyQ2FzZURpYWNyaXRpY3MgPSB5c3RSZW1vdmVMb3dlckNhc2VEaWFjcml0aWNzO1xud2luZG93LnlzdFRlc3RGb2N1c0t3ID0geXN0VGVzdEZvY3VzS3c7XG53aW5kb3cueXN0UmVwbGFjZVZhcmlhYmxlcyA9IHlzdFJlcGxhY2VWYXJpYWJsZXM7XG53aW5kb3cueXN0QWpheFJlcGxhY2VWYXJpYWJsZXMgPSB5c3RBamF4UmVwbGFjZVZhcmlhYmxlcztcbndpbmRvdy55c3RVcGRhdGVUaXRsZSA9IHlzdFVwZGF0ZVRpdGxlO1xud2luZG93LnlzdFNhbml0aXplVGl0bGUgPSB5c3RTYW5pdGl6ZVRpdGxlO1xud2luZG93LnlzdFVwZGF0ZURlc2MgPSB5c3RVcGRhdGVEZXNjO1xud2luZG93LnlzdFNhbml0aXplRGVzYyA9IHlzdFNhbml0aXplRGVzYztcbndpbmRvdy55c3RUcmltRGVzYyA9IHlzdFRyaW1EZXNjO1xud2luZG93LnlzdFVwZGF0ZVVSTCA9IHlzdFVwZGF0ZVVSTDtcbndpbmRvdy55c3RCb2xkS2V5d29yZHMgPSB5c3RCb2xkS2V5d29yZHM7XG53aW5kb3cueXN0VXBkYXRlU25pcHBldCA9IHlzdFVwZGF0ZVNuaXBwZXQ7XG53aW5kb3cueXN0RXNjYXBlRm9jdXNLdyA9IHlzdEVzY2FwZUZvY3VzS3c7XG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuIl19
