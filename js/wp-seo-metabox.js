/* browser:true */
/* global wpseoMetaboxL10n */
/* global ajaxurl */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
'use strict';

var YoastShortcodePlugin = function() {
	this.registerTime = 0;
	this.register();

	this.unparsedShortcodes = [];
	this.parsedShortcodes = [];

	// The regex for matching shortcodes based on the available shortcode keywords.
	this.keywordRegex = '(' + wpseoMetaboxL10n.wpseo_shortcode_tags.join('|') + ')';

	this.loadShortcodes();
};

YoastShortcodePlugin.prototype.register = function() {
	if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" && typeof YoastSEO.app.plugins !== "undefined" ) {
		YoastSEO.app.plugins.register("YoastShortcodePlugin");
	} else if ( this.registerTime < 1001 ) {
		this.registerTime += 100;
		setTimeout( this.register, 100 );
	} else {
		console.error("Failed to register shortcode plugin with YoastSEO. YoastSEO is not available.");
	}
};

/**
 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippetpreview
 */
YoastShortcodePlugin.prototype.loadShortcodes = function() {
	var title = document.getElementById( 'title' ).value;
	var content = this.getContentTinyMCE();

	this.checkUnparsedShortcodes( title );
	this.checkUnparsedShortcodes( content );

	this.parseShortcodes();
};

/**
 * Checks a given text for shortcodes and adds the ones that have not been parsed yet to `this.unparsedShortcodes`.
 *
 * @param text The text to be analyzed.
 */
YoastShortcodePlugin.prototype.checkUnparsedShortcodes = function ( text ) {
	if ( typeof text !== 'string') {
		console.error( 'Failed to get unparsed shortcodes. Expected parameter to be a string, instead received' + typeof text );
		return false;
	}

	var shortcodes = this.matchShortcodes( text );
	for (var i in shortcodes) {
		var shortcode = shortcodes[ i ];

		if ( this.parsedShortcodes[ shortcode ] === undefined && this.unparsedShortcodes.indexOf( shortcode ) === -1 ) {
			this.unparsedShortcodes.push( shortcode );
		}
	}
};

/**
 * Matches a text for shortcodes. Returns a unique array with shortcodes.
 *
 * @param text
 * @returns {Array} The shortcodes contained in the text
 */
YoastShortcodePlugin.prototype.matchShortcodes = function( text ) {
	var shortcodes = [];

	//var text = "[embed][wp_caption]because I think we need some text with [caption id='1'] and [gallery id='24' value='something']which also encapsulates stuff[/gallery]How cool is this right? We could use shorcodes like hasthags [playlist][audio][video]Now let's put in some self [wpseo_breadcrumb /] stuff like [wpseo_breadcrumb/] and we should have [wpseo_breadcrumb] of the same. I mean of the same. That should only be included once right?"
	//var shortcodeTags = ["embed", "wp_caption", "caption", "gallery", "playlist", "audio", "video", "wpseo_breadcrumb", "wpseo_sitemap"];

	// First identify which tags are being used in a capturing shortcode by looking for closing tags.
	var closingTagRegex = "\\[\\/" + this.keywordRegex + "\\]";
	var captureKeywords = ( text.match( new RegExp(closingTagRegex, "g") ) || [] ).join(" ").match(new RegExp( this.keywordRegex, 'g') );

	// Fetch the capturing shortcodes and strip them from the text so we can easily match the non capturing shortcodes.
	for ( var i in captureKeywords ) {
		var captureKeyword = captureKeywords[i];
		var captureRegex = "\\[" + captureKeyword + "[^\\]]*?\\].*?\\[\\/" + captureKeyword + "\\]";

		shortcodes.push(text.match(new RegExp(captureRegex, "g"))[0]);
		text = text.replace(new RegExp(captureRegex, "g"), "");
	}
	// Fetch the non capturing shortcodes from the text.
	var nonCaptureRegex = "\\[" + this.keywordRegex + "[^\\]]*?\\]";
	var nonCaptures = text.match(new RegExp(nonCaptureRegex, "g"));
	// Add the non capturing shortcodes to the shortcodes array if they have not been added previously.
	for ( var i in nonCaptures ) {
		var nonCapture = nonCaptures[ i ];
		if ( shortcodes.indexOf( nonCapture ) === -1 ) {
			shortcodes.push( nonCapture );
		}
	}

	return shortcodes;
};

/**
 * Parses the unparsed shortcodes through AJAX and clears them.
 */
YoastShortcodePlugin.prototype.parseShortcodes = function() {
	if ( typeof this.unparsedShortcodes === 'object' && this.unparsedShortcodes.length > 0 ) {
		var shortcodes = this.unparsedShortcodes;
		this.unparsedShortcodes = [];
		var self = this;
		jQuery.get( ajaxurl, {
				action: 'wpseo_filter_shortcodes',
				_wpnonce: wpseoMetaboxL10n.wpseo_filter_shortcodes_nonce,
				data: shortcodes
			},
			function( shortcodeResults ) {
				shortcodeResults = JSON.parse( shortcodeResults);
				for ( var i in shortcodeResults ) {
					self.parsedShortcodes.push( shortcodeResults[ i ] );
				}
			}
		);
	}
};

/**
 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
 * @returns {String}
 */
YoastShortcodePlugin.prototype.getContentTinyMCE = function() {
	var val = document.getElementById( 'content' ).value;
	if ( tinyMCE.editors.length !== 0 ) {
		val = tinyMCE.get( 'content' ).getContent();
	}
	return val;
};

/* MODIFICATIONS */

YoastShortcodePlugin.prototype.registerModifications = function() {
	YoastSEO.app.plugins.registerModification( 'title', this.replaceShortcodes, 'YoastShortcodePlugin' );
	YoastSEO.app.plugins.registerModification( 'content', this.replaceShortcodes, 'YoastShortcodePlugin' );
};

YoastShortcodePlugin.prototype.replaceShortcodes = function( data ) {
	if ( typeof data === 'string' && this.parsedShortcodes.length > 0 ) {
		console.log(data);
		for ( var i in this.parsedShortcodes ) {
			data = data.replace( this.parsedShortcodes[ i ].shortcode, this.parsedShortcodes[ i ].output );
		}
	}
	return data;
};

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
		}

		jQuery( init );
	}
);
