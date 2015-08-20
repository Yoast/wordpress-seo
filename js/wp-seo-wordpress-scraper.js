/* global YoastSEO: true, wpseoMetaboxL10n, ajaxurl, tinyMCE */
YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * wordpress scraper to gather inputfields.
 * @constructor
 */
YoastSEO.WordPressScraper = function() {};

/**
 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippetpreview
 */
YoastSEO.WordPressScraper.prototype.getData = function() {
	'use strict';

	return {
		keyword: this.getDataFromInput( 'keyword' ),
		meta: this.getDataFromInput( 'meta' ),
		text: this.getDataFromInput( 'text' ),
		pageTitle: this.getDataFromInput( 'pageTitle' ),
		title: this.getDataFromInput( 'title' ),
		url: this.getDataFromInput( 'url' ),
		excerpt: this.getDataFromInput( 'excerpt' ),
		snippetTitle: this.getDataFromInput( 'snippetTitle' ),
		snippetMeta: this.getDataFromInput( 'meta' ),
		snippetCite: this.getDataFromInput( 'cite' )
	};
};

/**
 * gets the values from the given input. Returns this value
 * @param {String} inputType
 * @returns {String}
 */
YoastSEO.WordPressScraper.prototype.getDataFromInput = function( inputType ) {
	'use strict';

	var val = '';
	switch ( inputType ) {
		case 'text':
		case 'content':
			val = this.getContentTinyMCE();
			break;
		case 'url':
			if ( document.getElementById( 'sample-permalink' ) !== null ) {
				val = document.getElementById( 'sample-permalink' ).innerHTML.split( '<span' )[ 0 ];
			}
			break;
		case 'cite':
		case 'editable-post-name':
			if ( document.getElementById( 'editable-post-name' ) !== null ) {
				val = document.getElementById( 'editable-post-name' ).textContent;
				var elem = document.getElementById( 'new-post-slug' );
				if ( elem !== null && val === '' ) {
					val = document.getElementById( 'new-post-slug' ).value;
				}
			}
			break;
		case 'meta':
			val = document.getElementById( 'yoast_wpseo_metadesc' ).value;
			break;
		case 'keyword':
			val = document.getElementById( 'yoast_wpseo_focuskw' ).value;
			break;
		case 'title':
		case 'snippetTitle':
			val = document.getElementById( 'yoast_wpseo_title' ).value;
			break;
		case 'pageTitle':
			val = document.getElementById( 'title' ).value;
			break;
		case 'excerpt':
			val = document.getElementById( 'excerpt' ).value;
			break;
		default:
			break;
	}
	return val;
};

/**
 * When the snippet is updated, update the (hidden) fields on the page
 * @param {Object} value
 * @param {String} type
 */
YoastSEO.WordPressScraper.prototype.setDataFromSnippet = function( value, type ) {
	'use strict';

	switch ( type ) {
		case 'snippet_meta':
			document.getElementById( 'yoast_wpseo_metadesc' ).value = value;
			break;
		case 'snippet_cite':
			if ( document.getElementById( 'editable-post-name' ) !== null ) {
				document.getElementById( 'editable-post-name' ).textContent = value;
				document.getElementById( 'editable-post-name-full' ).textContent = value;
			}
			break;
		case 'snippet_title':
			document.getElementById( 'yoast_wpseo_title' ).value = value;
			break;
		default:
			break;
	}
};

/**
 * feeds data to the loader that is required for the analyzer
 */
YoastSEO.WordPressScraper.prototype.getAnalyzerInput = function() {
	'use strict';

	YoastSEO.app.analyzerDataQueue = [ 'text', 'keyword', 'meta', 'url', 'title', 'pageTitle', 'snippetTitle', 'snippetMeta', 'snippetCite', 'excerpt' ];
	this.runDataQueue();
};

/**
 * Queue for the analyzer data. Runs a queue to prevent timing issues with the replace variable callback
 */
YoastSEO.WordPressScraper.prototype.runDataQueue = function() {
	'use strict';

	if ( YoastSEO.app.analyzerDataQueue.length > 0 ) {
		var currentData = YoastSEO.app.analyzerDataQueue.shift();
		this.replaceVariables( YoastSEO.app.analyzerData[ currentData ], currentData, YoastSEO.app.formattedData );
	} else {
		if ( typeof YoastSEO.app.snippetPreview === 'undefined' ) {
			YoastSEO.app.init();
		} else {
			YoastSEO.app.reloadSnippetText();
		}
		YoastSEO.app.runAnalyzerCallback();
	}
};

/**
 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
 * @returns {String}
 */
YoastSEO.WordPressScraper.prototype.getContentTinyMCE = function() {
	'use strict';

	var val = document.getElementById( 'content' ).value;
	if ( tinyMCE.editors.length !== 0 ) {
		val = tinyMCE.get( 'content' ).getContent();
	}
	return val;
};

/**
 * gets data from hidden input fields. Is triggered on click in the snippet preview. Fetches data and inserts into snippetPreview
 * @param {Object} ev
 */
YoastSEO.WordPressScraper.prototype.getInputFieldsData = function( ev ) {
	'use strict';

	var inputType = ev.currentTarget.id.replace( /snippet_/i, '' );
	switch ( inputType ) {
		case 'title':
			document.getElementById( 'snippet_title' ).textContent = document.getElementById( 'yoast_wpseo_title' ).value;
			document.getElementById( 'snippet_title' ).focus();
			break;
		case 'meta':
			document.getElementById( 'snippet_meta' ).focus();
			document.getElementById( 'snippet_meta' ).textContent = document.getElementById( 'yoast_wpseo_metadesc' ).value;

			break;
		case 'url':
			var newUrl = document.getElementById( 'snippet_cite' ).textContent;
			document.getElementById( 'editable-post-name' ).textContent = newUrl;
			document.getElementById( 'editable-post-name' ).focus();
			break;
		default:
			break;
	}
};

/**
 * Replaces %% strings with WordPress variables
 * @param {String} textString
 * @param {String} type
 * @param {Object} object
 */
YoastSEO.WordPressScraper.prototype.replaceVariables = function( textString, type, object ) {
	'use strict';

	if ( typeof textString === 'undefined' ) {
		object[ type ] = '';
		this.runDataQueue();
	} else {
		textString = this.titleReplace( textString );
		textString = this.defaultReplace( textString );
		textString = this.parentReplace( textString );
		textString = this.doubleSepReplace( textString );
		textString = this.excerptReplace( textString );

		if ( textString.indexOf( '%%' ) !== -1 && textString.match( /%%[a-z0-9_-]+%%/i ) !== null && typeof this.replacedVars !== 'undefined' ) {
			var regex = /%%[a-z0-9_-]+%%/gi;
			var matches = textString.match( regex );
			for ( var i = 0; i < matches.length; i++ ) {
				if ( typeof( this.replacedVars[ matches[ i ] ] ) !== 'undefined' ) {
					textString = textString.replace( matches[ i ], this.replacedVars[ matches[ i ] ] );
				}
				else {
					var replaceableVar = matches[ i ];
					// create the cache already, so we don't do the request twice.
					this.replacedVars[ replaceableVar ] = '';
					var srcObj = {};
					srcObj.replaceableVar = replaceableVar;
					srcObj.textString = textString;
					srcObj.type = type;
					srcObj.object = object;
					this.ajaxReplaceVariables( srcObj );
				}
			}
			if ( textString.match( /%%[a-z0-9_-]+%%/i ) === null ) {
				object[ type ] = textString;
				this.runDataQueue();
			}
		} else {
			object[ type ] = textString;
			this.runDataQueue();
		}
	}
};

/**
 * Replaces %%title%% with the title
 *
 * @param {String} textString
 * @returns {String}
 */
YoastSEO.WordPressScraper.prototype.titleReplace = function( textString ) {
	'use strict';

	var title = YoastSEO.app.analyzerData.title;
	if ( typeof title === 'undefined' ) {
		title = YoastSEO.app.analyzerData.pageTitle;
	}
	if ( title.length > 0 ) {
		textString = textString.replace( /%%title%%/g, title );
	}
	return textString;
};

/**
 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
 *
 * @param {String} textString
 * @returns {String}
 */
YoastSEO.WordPressScraper.prototype.parentReplace = function( textString ) {
	'use strict';

	var parentId = document.getElementById( 'parent_id' );

	if ( parentId !== null && parentId.options[ parentId.selectedIndex ].text !== wpseoMetaboxL10n.no_parent_text ) {
		textString = textString.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
	}
	return textString;
};

/**
 * removes double seperators and replaces them with a single seperator
 *
 * @param {String} textString
 * @returns {String}
 */
YoastSEO.WordPressScraper.prototype.doubleSepReplace = function( textString ) {
	'use strict';

	var escaped_seperator = YoastSEO.app.stringHelper.addEscapeChars( wpseoMetaboxL10n.sep );
	var pattern = new RegExp( escaped_seperator + ' ' + escaped_seperator, 'g' );
	textString = textString.replace( pattern, wpseoMetaboxL10n.sep );
	return textString;
};

/**
 * replaces the excerpts strings with strings for the excerpts, if not empty.
 *
 * @param {String} textString
 * @returns {String}
 */
YoastSEO.WordPressScraper.prototype.excerptReplace = function( textString ) {
	'use strict';

	if ( YoastSEO.app.analyzerData.excerpt.length > 0 ) {
		textString.replace( /%%excerpt_only%%/, YoastSEO.app.analyzerData.excerpt );
		textString.replace( /%%excerpt%%/, YoastSEO.app.analyzerData.excerpt );
	}
	return textString;
};

/**
 * replaces default variables with the values stored in the wpseoMetaboxL10n object.
 *
 * @param {String} textString
 * @return {String}
 */
YoastSEO.WordPressScraper.prototype.defaultReplace = function( textString ) {
	'use strict';

	return textString.replace( /%%sitedesc%%/g, wpseoMetaboxL10n.sitedesc )
		.replace( /%%sitename%%/g, wpseoMetaboxL10n.sitename )
		.replace( /%%sep%%/g, wpseoMetaboxL10n.sep )
		.replace( /%%date%%/g, wpseoMetaboxL10n.date )
		.replace( /%%id%%/g, wpseoMetaboxL10n.id )
		.replace( /%%page%%/g, wpseoMetaboxL10n.page )
		.replace( /%%currenttime%%/g, wpseoMetaboxL10n.currenttime )
		.replace( /%%currentdate%%/g, wpseoMetaboxL10n.currentdate )
		.replace( /%%currentday%%/g, wpseoMetaboxL10n.currentday )
		.replace( /%%currentmonth%%/g, wpseoMetaboxL10n.currentmonth )
		.replace( /%%currentyear%%/g, wpseoMetaboxL10n.currentyear )
		.replace( /%%focuskw%%/g, YoastSEO.app.stringHelper.stripAllTags( YoastSEO.app.analyzerData.keyword ) );
};

/**
 * Variable replacer. Gets the replaceable var from an Ajaxcall, saves this in the replacedVars object and runs the
 * replace function again to replace the new found values.
 *
 * @param {Object} srcObj
 */
YoastSEO.WordPressScraper.prototype.ajaxReplaceVariables = function( srcObj ) {
	'use strict';

	jQuery.post( ajaxurl, {
			action: 'wpseo_replace_vars',
			string: srcObj.replaceableVar,
			post_id: jQuery( '#post_ID' ).val(),
			_wpnonce: wpseoMetaboxL10n.wpseo_replace_vars_nonce
		}, function( data ) {
			if ( data ) {
				YoastSEO.app.source.replacedVars[ srcObj.replaceableVar ] = data;
				YoastSEO.app.source.replaceVariables( srcObj.textString, srcObj.type, srcObj.object );
			}
		}
	);
};

/**
 * Calls the eventbinders.
 */
YoastSEO.WordPressScraper.prototype.bindElementEvents = function() {
	'use strict';

	this.snippetPreviewEventBinder( YoastSEO.app.snippetPreview );
	this.inputElementEventBinder();
	document.getElementById( 'yoast_wpseo_focuskw' ).addEventListener( 'keydown', YoastSEO.app.snippetPreview.disableEnter );
};

/**
 * binds the getinputfieldsdata to the snippetelements.
 *
 * @param {YoastSEO.SnippetPreview} snippetPreview The snippet preview object to bind the events on.
 */
YoastSEO.WordPressScraper.prototype.snippetPreviewEventBinder = function( snippetPreview ) {
	'use strict';

	var elems = [ 'snippet_cite', 'snippet_meta', 'snippet_title' ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( 'focus', this.getInputFieldsData );
		document.getElementById( elems[ i ] ).addEventListener( 'keydown', snippetPreview.disableEnter );
		document.getElementById( elems[ i ] ).addEventListener( 'blur', snippetPreview.checkTextLength );
		//textFeedback is given on input (when user types or pastests), but also on focus. If a string that is too long is being recalled
		//from the saved values, it gets the correct classname right away.
		document.getElementById( elems[ i ] ).addEventListener( 'input', snippetPreview.textFeedback );
		document.getElementById( elems[ i ] ).addEventListener( 'focus', snippetPreview.textFeedback );
		//shows edit icon by hovering over element
		document.getElementById( elems[ i ] ).addEventListener( 'mouseover', snippetPreview.showEditIcon );
		//hides the edit icon onmouseout, on focus and on keyup. If user clicks or types AND moves his mouse, the edit icon could return while editting
		//by binding to these 3 events
		document.getElementById( elems[ i ] ).addEventListener( 'mouseout', snippetPreview.hideEditIcon );
		document.getElementById( elems[ i ] ).addEventListener( 'focus', snippetPreview.hideEditIcon );
		document.getElementById( elems[ i ] ).addEventListener( 'keyup', snippetPreview.hideEditIcon );
	}
	elems = [ 'title_container', 'url_container', 'meta_container' ];
	//when clicked on the
	for ( i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( 'click', snippetPreview.setFocus );
	}
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO.WordPressScraper.prototype.inputElementEventBinder = function() {
	'use strict';

	var elems = [ 'excerpt', 'content', 'editable-post-name', 'yoast_wpseo_focuskw' ];
	for ( var i = 0; i < elems.length; i++ ) {
		var elem = document.getElementById( elems[ i ] );
		if ( elem !== null ) {
			document.getElementById( elems[ i ] ).addEventListener( 'change', YoastSEO.app.refresh.bind( YoastSEO.app ) );
		}
	}
};

/**
 * Updates the snippet values, is bound by the loader when generating the elements for the snippet.
 * Uses the __unformattedText if the textFeedback function has put a string there (if text was too long).
 * clears this after use.
 *
 * @param {Object} ev
 */
YoastSEO.WordPressScraper.prototype.updateSnippetValues = function( ev ) {
	'use strict';

	var dataFromSnippet = ev.currentTarget.textContent;
	if ( typeof ev.currentTarget.__unformattedText !== 'undefined' ) {
		if ( ev.currentTarget.__unformattedText !== '' ) {
			dataFromSnippet = ev.currentTarget.__unformattedText;
			ev.currentTarget.__unformattedText = '';
		}
	}
	ev.currentTarget.refObj.source.setDataFromSnippet( dataFromSnippet, ev.currentTarget.id );
	ev.currentTarget.refObj.source.getData();
	ev.currentTarget.refObj.source.getAnalyzerInput();
};

/**
 * Saves the score to the linkdex.
 * Outputs the score in the overall target.
 *
 * @param {String} score
 */
YoastSEO.WordPressScraper.prototype.saveScores = function( score ) {
	'use strict';

	//fancy SVG needs to go here.
	document.getElementById( YoastSEO.analyzerArgs.targets.overall ).textContent = score;
	document.getElementById( 'yoast_wpseo_linkdex' ).value = score;
};

/**
 * binds to the WordPress jQuery function to put the permalink on the page.
 * If the response matches with permalinkstring, the snippet can be rerendered.
 */
jQuery( document ).on( 'ajaxComplete', function( ev, response ) {
	'use strict';

	if ( response.responseText.match( 'Permalink:' ) !== null ) {
		YoastSEO.app.source.getData();
		YoastSEO.app.source.getAnalyzerInput();
		YoastSEO.app.snippetPreview.reRender();
	}
} );
