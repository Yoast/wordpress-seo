(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wpseoAdminL10n, ajaxurl, setWPOption, tb_remove, YoastSEO, wpseoSelect2Locale */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */
(function() {
	'use strict';

	/**
	 * Detects the wrong use of variables in title and description templates
	 *
	 * @param {element} e
	 */
	function wpseoDetectWrongVariables( e ) {
		var warn = false;
		var error_id = '';
		var wrongVariables = [];
		var authorVariables = [ 'userid', 'name', 'user_description' ];
		var dateVariables = [ 'date' ];
		var postVariables = [ 'title', 'parent_title', 'excerpt', 'excerpt_only', 'caption', 'focuskw', 'pt_single', 'pt_plural', 'modified', 'id' ];
		var specialVariables = [ 'term404', 'searchphrase' ];
		var taxonomyVariables = [ 'term_title', 'term_description' ];
		var taxonomyPostVariables = [ 'category', 'category_description', 'tag', 'tag_description' ];
		if ( e.hasClass( 'posttype-template' ) ) {
			wrongVariables = wrongVariables.concat( specialVariables, taxonomyVariables );
		}
		else if ( e.hasClass( 'homepage-template' ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		}
		else if ( e.hasClass( 'taxonomy-template' ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables );
		}
		else if ( e.hasClass( 'author-template' ) ) {
			wrongVariables = wrongVariables.concat( postVariables, dateVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		}
		else if ( e.hasClass( 'date-template' ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		}
		else if ( e.hasClass( 'search-template' ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ 'term404' ] );
		}
		else if ( e.hasClass( 'error404-template' ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ 'searchphrase' ] );
		}
		jQuery.each( wrongVariables, function( index, variable ) {
				error_id = e.attr( 'id' ) + '-' + variable + '-warning';
				if ( e.val().search( '%%' + variable + '%%' ) !== -1 ) {
					e.addClass( 'wpseo_variable_warning' );
					var msg = wpseoAdminL10n.variable_warning.replace( '%s', '%%' + variable + '%%' );
					if ( jQuery( '#' + error_id ).length ) {
						jQuery( '#' + error_id ).html( msg );
					}
					else {
						e.after( ' <div id="' + error_id + '" class="wpseo_variable_warning"><div class="clear"></div>' + msg + '</div>' );
					}
					warn = true;
				}
				else {
					if ( jQuery( '#' + error_id ).length ) {
						jQuery( '#' + error_id ).remove();
					}
				}
			}
		);
		if ( warn === false ) {
			e.removeClass( 'wpseo_variable_warning' );
		}
	}

	/**
	 * Sets a specific WP option
	 *
	 * @param {string} option The option to update
	 * @param {string} newval The new value for the option
	 * @param {string} hide The ID of the element to hide on success
	 * @param {string} nonce The nonce for the action
	 */
	function setWPOption( option, newval, hide, nonce ) {
		jQuery.post( ajaxurl, {
				action: 'wpseo_set_option',
				option: option,
				newval: newval,
				_wpnonce: nonce
			}, function( data ) {
				if ( data ) {
					jQuery( '#' + hide ).hide();
				}
			}
		);
	}

	/**
	 * Do the kill blocking files action
	 *
	 * @param {string} nonce
	 */
	function wpseoKillBlockingFiles( nonce ) {
		jQuery.post( ajaxurl, {
				action: 'wpseo_kill_blocking_files',
				_ajax_nonce: nonce
			}, function( data ) {
				if ( data === 'success' ) {
					jQuery( '#blocking_files' ).hide();
				}
				else {
					jQuery( '#blocking_files' ).html( data );
				}
			}
		);
	}

	/**
	 * Copies the meta description for the homepage
	 */
	function wpseoCopyHomeMeta() {
		jQuery( '#og_frontpage_desc' ).val( jQuery( '#meta_description' ).val() );
	}

	/**
	 * Makes sure we store the action hash so we can return to the right hash
	 */
	function wpseoSetTabHash() {
		var conf = jQuery( '#wpseo-conf' );
		if ( conf.length ) {
			var currentUrl = conf.attr( 'action' ).split( '#' )[ 0 ];
			conf.attr( 'action', currentUrl + window.location.hash );
		}
	}

	/**
	 * When the hash changes, get the base url from the action and then add the current hash
	 */
	jQuery( window ).on( 'hashchange', wpseoSetTabHash );

	/**
	 * When the hash changes, get the base url from the action and then add the current hash
	 */
	jQuery( document ).on( 'ready', wpseoSetTabHash );

	function wpseo_add_fb_admin() {
		var target_form = jQuery( '#TB_ajaxContent' );

		jQuery.post(
			ajaxurl,
			{
				_wpnonce: target_form.find( 'input[name=fb_admin_nonce]' ).val(),
				admin_name: target_form.find( 'input[name=fb_admin_name]' ).val(),
				admin_id: target_form.find( 'input[name=fb_admin_id]' ).val(),
				action: 'wpseo_add_fb_admin'
			},
			function( response ) {
				var resp = jQuery.parseJSON( response );

				target_form.find( 'p.notice' ).remove();

				switch ( resp.success ) {
					case 1:

						target_form.find( 'input[type=text]' ).val( '' );

						jQuery( '#user_admin' ).append( resp.html );
						jQuery( '#connected_fb_admins' ).show();
						tb_remove();
						break;
					case 0 :
						jQuery( resp.html ).insertAfter( target_form.find( 'h3' ) );
						break;
				}
			}
		);
	}

	/**
	 * Adds select2 for selected fields.
	 */
	function initSelect2() {
		var select2Width = '400px';

		// Select2 for General settings: your info: company or person. Width is the same as the width for the other fields on this page.
		jQuery('#company_or_person').select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for Twitter card meta data in Settings
		jQuery('#twitter_card_type').select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery('#post_types-post-maintax').select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for profile in Search Console
		jQuery('#profile').select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});
	}

	window.wpseoDetectWrongVariables = wpseoDetectWrongVariables;
	window.setWPOption = setWPOption;
	window.wpseoKillBlockingFiles = wpseoKillBlockingFiles;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	window.wpseo_add_fb_admin = wpseo_add_fb_admin;
	window.wpseoSetTabHash = wpseoSetTabHash;

	jQuery( document ).ready( function() {
			/* Fix banner images overlapping help texts */
			jQuery( '.screen-meta-toggle a' ).click( function() {
					jQuery( '#sidebar-container' ).toggle();
				}
			);

			// events
			jQuery( '#enablexmlsitemap' ).change( function() {
					jQuery( '#sitemapinfo' ).toggle( jQuery( this ).is( ':checked' ) );
				}
			).change();

			jQuery( '#disable-post_format' ).change( function() {
					jQuery( '#post_format-titles-metas' ).toggle( jQuery( this ).is( ':not(:checked)' ) );
				}
			).change();

			jQuery( '#breadcrumbs-enable' ).change( function() {
					jQuery( '#breadcrumbsinfo' ).toggle( jQuery( this ).is( ':checked' ) );
				}
			).change();

			jQuery( '#disable_author_sitemap' ).find( 'input:radio' ).change( function() {
					if ( jQuery( this ).is( ':checked' ) ) {
						jQuery( '#xml_user_block' ).toggle( jQuery( this ).val() === 'off' );
					}
				}
			).change();

			jQuery( '#cleanpermalinks' ).change( function() {
					jQuery( '#cleanpermalinksdiv' ).toggle( jQuery( this ).is( ':checked' ) );
				}
			).change();

			jQuery( '#wpseo-tabs' ).find( 'a' ).click( function() {
					jQuery( '#wpseo-tabs' ).find( 'a' ).removeClass( 'nav-tab-active' );
					jQuery( '.wpseotab' ).removeClass( 'active' );

					var id = jQuery( this ).attr( 'id' ).replace( '-tab', '' );
					jQuery( '#' + id ).addClass( 'active' );
					jQuery( this ).addClass( 'nav-tab-active' );
				}
			);

			jQuery( '#company_or_person' ).change( function() {
					var companyOrPerson = jQuery( this ).val();
					if ( 'company' === companyOrPerson ) {
						jQuery( '#knowledge-graph-company' ).show();
						jQuery( '#knowledge-graph-person' ).hide();
					}
					else if ( 'person' === companyOrPerson ) {
						jQuery( '#knowledge-graph-company' ).hide();
						jQuery( '#knowledge-graph-person' ).show();
					}
					else {
						jQuery( '#knowledge-graph-company' ).hide();
						jQuery( '#knowledge-graph-person' ).hide();
					}
				}
			).change();

			jQuery( '.template' ).change( function() {
					wpseoDetectWrongVariables( jQuery( this ) );
				}
			).change();

			// init
			var activeTab = window.location.hash.replace( '#top#', '' );

			// default to first tab
			if ( activeTab === '' || activeTab === '#_=_' ) {
				activeTab = jQuery( '.wpseotab' ).attr( 'id' );
			}

			jQuery( '#' + activeTab ).addClass( 'active' );
			jQuery( '#' + activeTab + '-tab' ).addClass( 'nav-tab-active' );

			jQuery( '.nav-tab-active' ).click();
			initSelect2();
		}
	);
}());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3BzZW9BZG1pbkwxMG4sIGFqYXh1cmwsIHNldFdQT3B0aW9uLCB0Yl9yZW1vdmUsIFlvYXN0U0VPLCB3cHNlb1NlbGVjdDJMb2NhbGUgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IC1XMDAzICovXG4vKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogRGV0ZWN0cyB0aGUgd3JvbmcgdXNlIG9mIHZhcmlhYmxlcyBpbiB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdGVtcGxhdGVzXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gZVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyggZSApIHtcblx0XHR2YXIgd2FybiA9IGZhbHNlO1xuXHRcdHZhciBlcnJvcl9pZCA9ICcnO1xuXHRcdHZhciB3cm9uZ1ZhcmlhYmxlcyA9IFtdO1xuXHRcdHZhciBhdXRob3JWYXJpYWJsZXMgPSBbICd1c2VyaWQnLCAnbmFtZScsICd1c2VyX2Rlc2NyaXB0aW9uJyBdO1xuXHRcdHZhciBkYXRlVmFyaWFibGVzID0gWyAnZGF0ZScgXTtcblx0XHR2YXIgcG9zdFZhcmlhYmxlcyA9IFsgJ3RpdGxlJywgJ3BhcmVudF90aXRsZScsICdleGNlcnB0JywgJ2V4Y2VycHRfb25seScsICdjYXB0aW9uJywgJ2ZvY3Vza3cnLCAncHRfc2luZ2xlJywgJ3B0X3BsdXJhbCcsICdtb2RpZmllZCcsICdpZCcgXTtcblx0XHR2YXIgc3BlY2lhbFZhcmlhYmxlcyA9IFsgJ3Rlcm00MDQnLCAnc2VhcmNocGhyYXNlJyBdO1xuXHRcdHZhciB0YXhvbm9teVZhcmlhYmxlcyA9IFsgJ3Rlcm1fdGl0bGUnLCAndGVybV9kZXNjcmlwdGlvbicgXTtcblx0XHR2YXIgdGF4b25vbXlQb3N0VmFyaWFibGVzID0gWyAnY2F0ZWdvcnknLCAnY2F0ZWdvcnlfZGVzY3JpcHRpb24nLCAndGFnJywgJ3RhZ19kZXNjcmlwdGlvbicgXTtcblx0XHRpZiAoIGUuaGFzQ2xhc3MoICdwb3N0dHlwZS10ZW1wbGF0ZScgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggJ2hvbWVwYWdlLXRlbXBsYXRlJyApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggJ3RheG9ub215LXRlbXBsYXRlJyApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggJ2F1dGhvci10ZW1wbGF0ZScgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBwb3N0VmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCAnZGF0ZS10ZW1wbGF0ZScgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoICdzZWFyY2gtdGVtcGxhdGUnICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzLCBbICd0ZXJtNDA0JyBdICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCAnZXJyb3I0MDQtdGVtcGxhdGUnICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzLCBbICdzZWFyY2hwaHJhc2UnIF0gKTtcblx0XHR9XG5cdFx0alF1ZXJ5LmVhY2goIHdyb25nVmFyaWFibGVzLCBmdW5jdGlvbiggaW5kZXgsIHZhcmlhYmxlICkge1xuXHRcdFx0XHRlcnJvcl9pZCA9IGUuYXR0ciggJ2lkJyApICsgJy0nICsgdmFyaWFibGUgKyAnLXdhcm5pbmcnO1xuXHRcdFx0XHRpZiAoIGUudmFsKCkuc2VhcmNoKCAnJSUnICsgdmFyaWFibGUgKyAnJSUnICkgIT09IC0xICkge1xuXHRcdFx0XHRcdGUuYWRkQ2xhc3MoICd3cHNlb192YXJpYWJsZV93YXJuaW5nJyApO1xuXHRcdFx0XHRcdHZhciBtc2cgPSB3cHNlb0FkbWluTDEwbi52YXJpYWJsZV93YXJuaW5nLnJlcGxhY2UoICclcycsICclJScgKyB2YXJpYWJsZSArICclJScgKTtcblx0XHRcdFx0XHRpZiAoIGpRdWVyeSggJyMnICsgZXJyb3JfaWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkoICcjJyArIGVycm9yX2lkICkuaHRtbCggbXNnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0ZS5hZnRlciggJyA8ZGl2IGlkPVwiJyArIGVycm9yX2lkICsgJ1wiIGNsYXNzPVwid3BzZW9fdmFyaWFibGVfd2FybmluZ1wiPjxkaXYgY2xhc3M9XCJjbGVhclwiPjwvZGl2PicgKyBtc2cgKyAnPC9kaXY+JyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3YXJuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiAoIGpRdWVyeSggJyMnICsgZXJyb3JfaWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkoICcjJyArIGVycm9yX2lkICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRpZiAoIHdhcm4gPT09IGZhbHNlICkge1xuXHRcdFx0ZS5yZW1vdmVDbGFzcyggJ3dwc2VvX3ZhcmlhYmxlX3dhcm5pbmcnICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgYSBzcGVjaWZpYyBXUCBvcHRpb25cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbiBUaGUgb3B0aW9uIHRvIHVwZGF0ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3dmFsIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBvcHRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGUgVGhlIElEIG9mIHRoZSBlbGVtZW50IHRvIGhpZGUgb24gc3VjY2Vzc1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgVGhlIG5vbmNlIGZvciB0aGUgYWN0aW9uXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRXUE9wdGlvbiggb3B0aW9uLCBuZXd2YWwsIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRcdGFjdGlvbjogJ3dwc2VvX3NldF9vcHRpb24nLFxuXHRcdFx0XHRvcHRpb246IG9wdGlvbixcblx0XHRcdFx0bmV3dmFsOiBuZXd2YWwsXG5cdFx0XHRcdF93cG5vbmNlOiBub25jZVxuXHRcdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0XHRqUXVlcnkoICcjJyArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvIHRoZSBraWxsIGJsb2NraW5nIGZpbGVzIGFjdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2Vcblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvS2lsbEJsb2NraW5nRmlsZXMoIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRcdGFjdGlvbjogJ3dwc2VvX2tpbGxfYmxvY2tpbmdfZmlsZXMnLFxuXHRcdFx0XHRfYWpheF9ub25jZTogbm9uY2Vcblx0XHRcdH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRpZiAoIGRhdGEgPT09ICdzdWNjZXNzJyApIHtcblx0XHRcdFx0XHRqUXVlcnkoICcjYmxvY2tpbmdfZmlsZXMnICkuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGpRdWVyeSggJyNibG9ja2luZ19maWxlcycgKS5odG1sKCBkYXRhICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmb3IgdGhlIGhvbWVwYWdlXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0NvcHlIb21lTWV0YSgpIHtcblx0XHRqUXVlcnkoICcjb2dfZnJvbnRwYWdlX2Rlc2MnICkudmFsKCBqUXVlcnkoICcjbWV0YV9kZXNjcmlwdGlvbicgKS52YWwoKSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHN1cmUgd2Ugc3RvcmUgdGhlIGFjdGlvbiBoYXNoIHNvIHdlIGNhbiByZXR1cm4gdG8gdGhlIHJpZ2h0IGhhc2hcblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0VGFiSGFzaCgpIHtcblx0XHR2YXIgY29uZiA9IGpRdWVyeSggJyN3cHNlby1jb25mJyApO1xuXHRcdGlmICggY29uZi5sZW5ndGggKSB7XG5cdFx0XHR2YXIgY3VycmVudFVybCA9IGNvbmYuYXR0ciggJ2FjdGlvbicgKS5zcGxpdCggJyMnIClbIDAgXTtcblx0XHRcdGNvbmYuYXR0ciggJ2FjdGlvbicsIGN1cnJlbnRVcmwgKyB3aW5kb3cubG9jYXRpb24uaGFzaCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoXG5cdCAqL1xuXHRqUXVlcnkoIHdpbmRvdyApLm9uKCAnaGFzaGNoYW5nZScsIHdwc2VvU2V0VGFiSGFzaCApO1xuXG5cdC8qKlxuXHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoXG5cdCAqL1xuXHRqUXVlcnkoIGRvY3VtZW50ICkub24oICdyZWFkeScsIHdwc2VvU2V0VGFiSGFzaCApO1xuXG5cdGZ1bmN0aW9uIHdwc2VvX2FkZF9mYl9hZG1pbigpIHtcblx0XHR2YXIgdGFyZ2V0X2Zvcm0gPSBqUXVlcnkoICcjVEJfYWpheENvbnRlbnQnICk7XG5cblx0XHRqUXVlcnkucG9zdChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XG5cdFx0XHRcdF93cG5vbmNlOiB0YXJnZXRfZm9ybS5maW5kKCAnaW5wdXRbbmFtZT1mYl9hZG1pbl9ub25jZV0nICkudmFsKCksXG5cdFx0XHRcdGFkbWluX25hbWU6IHRhcmdldF9mb3JtLmZpbmQoICdpbnB1dFtuYW1lPWZiX2FkbWluX25hbWVdJyApLnZhbCgpLFxuXHRcdFx0XHRhZG1pbl9pZDogdGFyZ2V0X2Zvcm0uZmluZCggJ2lucHV0W25hbWU9ZmJfYWRtaW5faWRdJyApLnZhbCgpLFxuXHRcdFx0XHRhY3Rpb246ICd3cHNlb19hZGRfZmJfYWRtaW4nXG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHR2YXIgcmVzcCA9IGpRdWVyeS5wYXJzZUpTT04oIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0dGFyZ2V0X2Zvcm0uZmluZCggJ3Aubm90aWNlJyApLnJlbW92ZSgpO1xuXG5cdFx0XHRcdHN3aXRjaCAoIHJlc3Auc3VjY2VzcyApIHtcblx0XHRcdFx0XHRjYXNlIDE6XG5cblx0XHRcdFx0XHRcdHRhcmdldF9mb3JtLmZpbmQoICdpbnB1dFt0eXBlPXRleHRdJyApLnZhbCggJycgKTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCAnI3VzZXJfYWRtaW4nICkuYXBwZW5kKCByZXNwLmh0bWwgKTtcblx0XHRcdFx0XHRcdGpRdWVyeSggJyNjb25uZWN0ZWRfZmJfYWRtaW5zJyApLnNob3coKTtcblx0XHRcdFx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAwIDpcblx0XHRcdFx0XHRcdGpRdWVyeSggcmVzcC5odG1sICkuaW5zZXJ0QWZ0ZXIoIHRhcmdldF9mb3JtLmZpbmQoICdoMycgKSApO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgc2VsZWN0MiBmb3Igc2VsZWN0ZWQgZmllbGRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFNlbGVjdDIoKSB7XG5cdFx0dmFyIHNlbGVjdDJXaWR0aCA9ICc0MDBweCc7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBHZW5lcmFsIHNldHRpbmdzOiB5b3VyIGluZm86IGNvbXBhbnkgb3IgcGVyc29uLiBXaWR0aCBpcyB0aGUgc2FtZSBhcyB0aGUgd2lkdGggZm9yIHRoZSBvdGhlciBmaWVsZHMgb24gdGhpcyBwYWdlLlxuXHRcdGpRdWVyeSgnI2NvbXBhbnlfb3JfcGVyc29uJykuc2VsZWN0Mih7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZVxuXHRcdH0pO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgVHdpdHRlciBjYXJkIG1ldGEgZGF0YSBpbiBTZXR0aW5nc1xuXHRcdGpRdWVyeSgnI3R3aXR0ZXJfY2FyZF90eXBlJykuc2VsZWN0Mih7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZVxuXHRcdH0pO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgdGF4b25vbXkgYnJlYWRjcnVtYnMgaW4gQWR2YW5jZWRcblx0XHRqUXVlcnkoJyNwb3N0X3R5cGVzLXBvc3QtbWFpbnRheCcpLnNlbGVjdDIoe1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGVcblx0XHR9KTtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIHByb2ZpbGUgaW4gU2VhcmNoIENvbnNvbGVcblx0XHRqUXVlcnkoJyNwcm9maWxlJykuc2VsZWN0Mih7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZVxuXHRcdH0pO1xuXHR9XG5cblx0d2luZG93Lndwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMgPSB3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzO1xuXHR3aW5kb3cuc2V0V1BPcHRpb24gPSBzZXRXUE9wdGlvbjtcblx0d2luZG93Lndwc2VvS2lsbEJsb2NraW5nRmlsZXMgPSB3cHNlb0tpbGxCbG9ja2luZ0ZpbGVzO1xuXHR3aW5kb3cud3BzZW9Db3B5SG9tZU1ldGEgPSB3cHNlb0NvcHlIb21lTWV0YTtcblx0d2luZG93Lndwc2VvX2FkZF9mYl9hZG1pbiA9IHdwc2VvX2FkZF9mYl9hZG1pbjtcblx0d2luZG93Lndwc2VvU2V0VGFiSGFzaCA9IHdwc2VvU2V0VGFiSGFzaDtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdFx0LyogRml4IGJhbm5lciBpbWFnZXMgb3ZlcmxhcHBpbmcgaGVscCB0ZXh0cyAqL1xuXHRcdFx0alF1ZXJ5KCAnLnNjcmVlbi1tZXRhLXRvZ2dsZSBhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRqUXVlcnkoICcjc2lkZWJhci1jb250YWluZXInICkudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdC8vIGV2ZW50c1xuXHRcdFx0alF1ZXJ5KCAnI2VuYWJsZXhtbHNpdGVtYXAnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRqUXVlcnkoICcjc2l0ZW1hcGluZm8nICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdCkuY2hhbmdlKCk7XG5cblx0XHRcdGpRdWVyeSggJyNkaXNhYmxlLXBvc3RfZm9ybWF0JyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0alF1ZXJ5KCAnI3Bvc3RfZm9ybWF0LXRpdGxlcy1tZXRhcycgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLmlzKCAnOm5vdCg6Y2hlY2tlZCknICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0KS5jaGFuZ2UoKTtcblxuXHRcdFx0alF1ZXJ5KCAnI2JyZWFkY3J1bWJzLWVuYWJsZScgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGpRdWVyeSggJyNicmVhZGNydW1ic2luZm8nICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdCkuY2hhbmdlKCk7XG5cblx0XHRcdGpRdWVyeSggJyNkaXNhYmxlX2F1dGhvcl9zaXRlbWFwJyApLmZpbmQoICdpbnB1dDpyYWRpbycgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRcdGpRdWVyeSggJyN4bWxfdXNlcl9ibG9jaycgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSAnb2ZmJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KS5jaGFuZ2UoKTtcblxuXHRcdFx0alF1ZXJ5KCAnI2NsZWFucGVybWFsaW5rcycgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGpRdWVyeSggJyNjbGVhbnBlcm1hbGlua3NkaXYnICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdCkuY2hhbmdlKCk7XG5cblx0XHRcdGpRdWVyeSggJyN3cHNlby10YWJzJyApLmZpbmQoICdhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRqUXVlcnkoICcjd3BzZW8tdGFicycgKS5maW5kKCAnYScgKS5yZW1vdmVDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXHRcdFx0XHRcdGpRdWVyeSggJy53cHNlb3RhYicgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmF0dHIoICdpZCcgKS5yZXBsYWNlKCAnLXRhYicsICcnICk7XG5cdFx0XHRcdFx0alF1ZXJ5KCAnIycgKyBpZCApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdGpRdWVyeSggdGhpcyApLmFkZENsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGpRdWVyeSggJyNjb21wYW55X29yX3BlcnNvbicgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBjb21wYW55T3JQZXJzb24gPSBqUXVlcnkoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRpZiAoICdjb21wYW55JyA9PT0gY29tcGFueU9yUGVyc29uICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCAnI2tub3dsZWRnZS1ncmFwaC1jb21wYW55JyApLnNob3coKTtcblx0XHRcdFx0XHRcdGpRdWVyeSggJyNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uJyApLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoICdwZXJzb24nID09PSBjb21wYW55T3JQZXJzb24gKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkoICcja25vd2xlZGdlLWdyYXBoLWNvbXBhbnknICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCAnI2tub3dsZWRnZS1ncmFwaC1wZXJzb24nICkuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGpRdWVyeSggJyNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueScgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRqUXVlcnkoICcja25vd2xlZGdlLWdyYXBoLXBlcnNvbicgKS5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpLmNoYW5nZSgpO1xuXG5cdFx0XHRqUXVlcnkoICcudGVtcGxhdGUnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzKCBqUXVlcnkoIHRoaXMgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHQpLmNoYW5nZSgpO1xuXG5cdFx0XHQvLyBpbml0XG5cdFx0XHR2YXIgYWN0aXZlVGFiID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSggJyN0b3AjJywgJycgKTtcblxuXHRcdFx0Ly8gZGVmYXVsdCB0byBmaXJzdCB0YWJcblx0XHRcdGlmICggYWN0aXZlVGFiID09PSAnJyB8fCBhY3RpdmVUYWIgPT09ICcjXz1fJyApIHtcblx0XHRcdFx0YWN0aXZlVGFiID0galF1ZXJ5KCAnLndwc2VvdGFiJyApLmF0dHIoICdpZCcgKTtcblx0XHRcdH1cblxuXHRcdFx0alF1ZXJ5KCAnIycgKyBhY3RpdmVUYWIgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdGpRdWVyeSggJyMnICsgYWN0aXZlVGFiICsgJy10YWInICkuYWRkQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblxuXHRcdFx0alF1ZXJ5KCAnLm5hdi10YWItYWN0aXZlJyApLmNsaWNrKCk7XG5cdFx0XHRpbml0U2VsZWN0MigpO1xuXHRcdH1cblx0KTtcbn0oKSk7XG4iXX0=
