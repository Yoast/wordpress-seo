/* browser:true */
/* global wpseoMetaboxL10n */
/* global ajaxurl */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
'use strict';

var YoastShortcodePlugin = function() {
	this.unparsedShortcodes = [];
	this.parsedShortcodes = {};

	// The regex for matching shortcodes based on the available shortcode keywords.
	this.keywordRegex = '(' + wpseoMetaboxL10n.wpseo_shortcode_tags.join('|') + ')';

	//this.loadShortcodes();
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

		if ( this.parsedShortcodes[ shortcode ] === undefined && this.unparsedShortcodes.indexOf( shortcode ) !== -1 ) {
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

	//var text = "[embed][wp_caption]because I think we need some text with [caption id='1'] and [gallery id='24' value='something']which also encapsulates stuff[/gallery]How cool is this right? We could use shorcodes like hasthags [playlist][audio][video]Now let's put in some self [wpseo_breadcrumb /] stuff like [wpseo_sitemap/] and we should have [wpseo_sitemap] of the same. I mean [wpseo_sitemap] of the same. That should only be included once right?"
	//var shortcodeTags = ["embed", "wp_caption", "caption", "gallery", "playlist", "audio", "video", "wpseo_breadcrumb", "wpseo_sitemap"];

	// First identify which tags are being used in a capturing shortcode by looking for closing tags.
	var closingTagRegex = "\\[\\/" + this.keywordRegex + "\\]";
	var captureKeywords = text.match( new RegExp(closingTagRegex, "g") ).join(" ").match(new RegExp( this.keywordRegex, 'g') );

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
	if ( typeof this.unparsedShortcodes === 'array' && this.unparsedShortcodes.length > 0 ) {
		var shortcodes = this.unparsedShortcodes;
		this.unparsedShortcodes = [];

		jQuery.get( ajaxurl, {
				action: 'wpseo_filter_shortcodes',
				_wpnonce: wpseoMetaboxL10n.wpseo_filter_shortcodes_nonce,
				data: shortcodes
			},
			function( shortcodeResults ) {
				for ( var shortcode in shortcodeResults ) {
					this.parsedShortcodes[shortcode] = shortcodeResults[shortcode];
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
	YoastSEO.app.plugins.registerModification( 'title', this.replaceTitleShortcodes, 'YoastShortcodePlugin' );
	YoastSEO.app.plugins.registerModification( 'content', this.replaceContentShortcodes, 'YoastShortcodePlugin' );
};

YoastShortcodePlugin.prototype.replaceTitleShortcodes = function( data ) {
	this.replaceShortcodes( data, this.titleShortcodes );
};

YoastShortcodePlugin.prototype.replaceContentShortcodes = function( data ) {
	this.replaceShortcodes( data, this.contentShortcodes );
};

YoastShortcodePlugin.prototype.replaceShortcodes = function( data, shortcodes ) {
	if ( typeof data === 'string' && shortcodes.length > 0 ) {
		for ( var shortcode in shortcodes ) {
			data = data.replace( new RegExp( shortcode, 'g' ), shortcodes[shortcode] );
		}
	}
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

		YoastSEO.initialize();
	}
);
