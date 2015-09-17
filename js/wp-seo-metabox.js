/* browser:true */
/* global wpseoMetaboxL10n */
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

		jQuery( '#' + wpseoMetaboxL10n.field_prefix + 'focuskw' ).autocomplete( {
				minLength: 3,
				formatResult: function( row ) {
					return jQuery( '<div/>' ).html( row ).html();
				},
				source: function( request, response ) {
					var term = request.term;
					if ( term in cache ) {
						response( cache[ term ] );
						return;
					}
					request._ajax_nonce = wpseoMetaboxL10n.wpseo_keyword_suggest_nonce;
					request.action = 'wpseo_get_suggest';

					lastXhr = jQuery.getJSON( ajaxurl, request, function( data, status, xhr ) {
							cache[ term ] = data;
							if ( xhr === lastXhr ) {
								response( data );
							}
						}
					);
				}
			}
		);

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
			var wordpressScraper = new YoastSEO.WordPressScraper( YoastSEO.analyzerArgs );

			YoastSEO.analyzerArgs.callbacks = {
				getData: wordpressScraper.getData,
				getAnalyzerInput: wordpressScraper.getAnalyzerInput,
				bindElementEvents: wordpressScraper.bindElementEvents,
				updateSnippetValues: wordpressScraper.updateSnippetValues,
				saveScores: wordpressScraper.saveScores,

				// Only necessary for the above functions to function
				replaceVariables: wordpressScraper.replaceVariables,
				getDataFromInput: wordpressScraper.getDataFromInput,
				getContentTinyMCE: wordpressScraper.getContentTinyMCE,
				runDataQueue: wordpressScraper.runDataQueue,
				snippetPreviewEventBinder: wordpressScraper.snippetPreviewEventBinder,
				inputElementEventBinder: wordpressScraper.inputElementEventBinder,
				titleReplace: wordpressScraper.titleReplace,
				defaultReplace: wordpressScraper.defaultReplace,
				parentReplace: wordpressScraper.parentReplace,
				doubleSepReplace: wordpressScraper.doubleSepReplace,
				excerptReplace: wordpressScraper.excerptReplace
			};

			YoastSEO.app = new YoastSEO.App( YoastSEO.analyzerArgs );

			YoastSEO.app.formattedData = {};
			YoastSEO.app.formattedData.usedKeywords = wpseoMetaboxL10n.keyword_usage;
			YoastSEO.app.formattedData.searchUrl = '<a target="new" href=' + wpseoMetaboxL10n.search_url + '>';
			YoastSEO.app.formattedData.postUrl = '<a target="new" href=' + wpseoMetaboxL10n.post_edit_url + '>';
			YoastSEO.app.formattedData.queue = [ 'wordCount',
				'keywordDensity',
				'subHeadings',
				'stopwords',
				'fleschReading',
				'linkCount',
				'imageCount',
				'urlKeyword',
				'urlLength',
				'metaDescription',
				'pageTitleKeyword',
				'pageTitleLength',
				'firstParagraph',
				'keywordDoubles' ];

			YoastSEO.app.replacedVars = {};

			YoastSEO.app.refresh();

			//Init Plugins
			window.yoastShortcodePlugin = new YoastShortcodePlugin();
		}

		jQuery( init );
	}
);
