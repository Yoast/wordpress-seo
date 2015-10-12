/* browser:true */
/* global wpseoMetaboxL10n */
/* global YoastReplaceVarPlugin */
/* global ajaxurl */
/* global YoastSEO */
/* global YoastShortcodePlugin */
/* jshint -W097 */
/* jshint -W003 */
'use strict';

jQuery( document ).ready(function() {
		if ( jQuery( '.wpseo-metabox-tabs-div' ).length > 0 ) {
			var active_tab = window.location.hash;
			if ( active_tab === '' || active_tab.search( 'wpseo' ) === -1 ) {
				active_tab = 'general';
			}
			else {
				active_tab = active_tab.replace( '#wpseo_', '' );
			}
			jQuery( '.' + active_tab ).addClass( 'active' );

			jQuery( 'a.wpseo_tablink' ).click( function() {
					jQuery( '.wpseo-metabox-tabs li' ).removeClass( 'active' );
					jQuery( '.wpseotab' ).removeClass( 'active' );

					var id = jQuery( this ).attr( 'href' ).replace( '#wpseo_', '' );
					jQuery( '.' + id ).addClass( 'active' );
					jQuery( this ).parent( 'li' ).addClass( 'active' );

					if ( jQuery( this ).hasClass( 'scroll' ) ) {
						var scrollto = jQuery( this ).attr( 'href' ).replace( 'wpseo_', '' );
						jQuery( 'html, body' ).animate( {
								scrollTop: jQuery( scrollto ).offset().top
							}, 500
						);
					}
				}
			);
		}

		jQuery( '.wpseo-heading' ).hide();
		jQuery( '.wpseo-metabox-tabs' ).show();
		// End Tabs code

		var cache = {}, lastXhr;

		jQuery( '.yoast_help' ).qtip(
			{
				content: {
					attr: 'alt'
				},
				position: {
					my: 'bottom left',
					at: 'top center'
				},
				style: {
					tip: {
						corner: true
					},
					classes: 'yoast-qtip qtip-rounded qtip-blue'
				},
				show: 'click',
				hide: {
					fixed: true,
					delay: 500
				}

			}
		);

		function init() {
			var wordpressScraper = new YoastSEO.WordPressScraper();

			YoastSEO.analyzerArgs.callbacks = {
				getData: wordpressScraper.getData.bind( wordpressScraper ),
				bindElementEvents: wordpressScraper.bindElementEvents.bind( wordpressScraper ),
				updateSnippetValues: wordpressScraper.updateSnippetValues.bind( wordpressScraper ),
				saveScores: wordpressScraper.saveScores.bind( wordpressScraper )
			};

			window.YoastSEO.app = new YoastSEO.App( YoastSEO.analyzerArgs );

			//Init Plugins
			window.yoastReplaceVarPlugin = new YoastReplaceVarPlugin();
			window.yoastShortcodePlugin = new YoastShortcodePlugin();
		}

		jQuery( init );
	}
);
