/* global wpseoAdminL10n, ajaxurl, setWPOption, tb_remove, YoastSEO, wpseoSelect2Locale, tb_show */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */

/* jshint ignore:start */
import React from 'react';
import ReactDom from 'react-dom';
import AlgoliaSearcher from './kb-search/wp-seo-kb-search.js';
/* jshint ignore:end */

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
		jQuery( '#company_or_person' ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale
		} );

		// Select2 for Twitter card meta data in Settings
		jQuery( '#twitter_card_type' ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale
		} );

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery( '#post_types-post-maintax' ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale
		} );

		// Select2 for profile in Search Console
		jQuery( '#profile' ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale
		} );
	}

	/**
	 * Shows the "buy Yoast SEO premium" popup.
	 */
	function showContactPopup() {
		var $ = jQuery;
		var $buyButton = $( '#wpseo-contact-support-popup' ),
			title = 'Buy Yoast SEO premium',
			$popupWindow,
			$closeButton;

		tb_show( title, '#TB_inline?width=650&height=235&inlineId=wpseo-contact-support-popup', 'group' );

		// The thicbox popup UI is now available.
		$popupWindow = $( '#TB_window' );
		$closeButton = $( '#TB_closeWindowButton' );

		// The container window isn't the correct size, rectify this and also the centering.
		$popupWindow.css( { width: 680, height: 235, 'margin-left': -340 } );

		// Accessibility improvements.
		$popupWindow
			.attr( {
				role: 'dialog',
				'aria-labelledby': 'TB_ajaxWindowTitle',
				'aria-describedby': 'TB_ajaxContent'
			} )
			.on( 'keydown', function( event ) {
				var id;

				// Constrain tabbing within the modal.
				if ( 9 === event.which ) {
					id = event.target.id;

					if ( id === 'wpseo-contact-support-popup-button' && !event.shiftKey ) {
						$closeButton.focus();
						event.preventDefault();
					} else if ( id === 'TB_closeWindowButton' && event.shiftKey ) {
						$buyButton.focus();
						event.preventDefault();
					}
				}
			} );

		// Move focus back to the element that opened the modal.
		$( 'body' ).on( 'thickbox:removed', function() {
			$( '.contact-support' ).focus();
		} );
	}

	window.wpseoDetectWrongVariables = wpseoDetectWrongVariables;
	window.setWPOption = setWPOption;
	window.wpseoKillBlockingFiles = wpseoKillBlockingFiles;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	window.wpseo_add_fb_admin = wpseo_add_fb_admin;
	window.wpseoSetTabHash = wpseoSetTabHash;

	jQuery( document ).ready( function() {
			// Inject kb-search in divs with the classname of 'wpseo-kb-search'.
			var mountingPoints = jQuery( '.wpseo-kb-search' );
			var algoliaSearchers = [];
			jQuery.each( mountingPoints, function( index, mountingPoint ) {
				var tabId = jQuery( mountingPoint ).closest( '.wpseotab' ).attr( 'id' );
				var translations = {
					noResultsText: wpseoAdminL10n.kb_no_results,
					headingText: wpseoAdminL10n.kb_heading,
					errorMessage: wpseoAdminL10n.kb_error_message,
					loadingPlaceholder: wpseoAdminL10n.kb_loading_placeholder,
					search: wpseoAdminL10n.kb_search,
					open: wpseoAdminL10n.open,
					back: wpseoAdminL10n.kb_back
				};
				algoliaSearchers.push( {
					tabName: tabId,
					algoliaSearcher: ReactDom.render( React.createElement( AlgoliaSearcher , translations ), mountingPoint ) //jshint ignore:line
				} );
			} );

			// Get the used search strings from the algoliaSearcher React component for the active tab and fire an event with this data.
			jQuery( '.contact-support' ).on( 'click', function( e ) {
				var activeTabName = jQuery( '.wpseotab.active' ).attr( 'id' );
				var activeAlgoliaSearcher = algoliaSearchers[ 0 ].algoliaSearcher; // 1st by default. (Used for the Advanced settings pages because of how the tabs were set up)
				jQuery.each( algoliaSearchers, function( key, searcher ) {
					if ( searcher.tabName === activeTabName ) {
						activeAlgoliaSearcher = searcher.algoliaSearcher;
						return false; // returning false breaks the loop.
					}
				} );
				var usedQueries = activeAlgoliaSearcher.state.usedQueries;
				jQuery( window ).trigger( 'YoastSEO:ContactSupport', { usedQueries: usedQueries } );
			} );

			// Open "functionality only avalible for premium" popup.
			jQuery( window ).on( 'YoastSEO:ContactSupport', function() {
				showContactPopup();
			} );

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
