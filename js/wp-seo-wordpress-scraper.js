/* global YoastSEO: true, tinyMCE */
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
			if ( document.getElementById( 'excerpt' ) !== null ) {
				val = document.getElementById('excerpt').value;
			}
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

	if ( typeof YoastSEO.app.snippetPreview === 'undefined' ) {
		YoastSEO.app.init();
	} else {
		YoastSEO.app.reloadSnippetText();
	}
	YoastSEO.app.runAnalyzerCallback();
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
	document.getElementById( 'yoast_wpseo_focuskw' ).addEventListener( 'blur', YoastSEO.app.resetQueue );
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
	ev.currentTarget.refObj.callbacks.setDataFromSnippet( dataFromSnippet, ev.currentTarget.id );
	ev.currentTarget.refObj.callbacks.getData();
	ev.currentTarget.refObj.callbacks.getAnalyzerInput();
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
	document.getElementById( YoastSEO.analyzerArgs.targets.overall ).innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve" width="50" height="50">			<g id="BG">			</g>			<g id="BG_dark">			</g>			<g id="bg_light">			<path fill="#5B2942" d="M415,500H85c-46.8,0-85-38.2-85-85V85C0,38.2,38.2,0,85,0h330c46.8,0,85,38.2,85,85v330			C500,461.8,461.8,500,415,500z"/>			<path fill="none" stroke="#7EADB9" stroke-width="17" stroke-miterlimit="10" d="M404.6,467H95.4C61.1,467,33,438.9,33,404.6V95.4			C33,61.1,61.1,33,95.4,33h309.2c34.3,0,62.4,28.1,62.4,62.4v309.2C467,438.9,438.9,467,404.6,467z"/>			</g>			<g id="Layer_2">			<circle id="score_circle_shadow" fill="#77B227" cx="250" cy="250" r="155"/>			<path id="score_circle" fill="#9FDA4F" d="M172.5,384.2C98.4,341.4,73,246.6,115.8,172.5S253.4,73,327.5,115.8"/>			<g>			<g>			<g display="none">			<path display="inline" fill="#FEC228" d="M668,338.4c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>			<path display="inline" fill="#8BDA53" d="M668,215.1c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>			<path display="inline" fill="#FF443D" d="M668,461.7c-30.4,0-55-24.6-55-55s24.6-55,55-55"/></g></g></g></g></svg>';
	document.getElementById( 'yoast_wpseo_linkdex' ).value = score;
};

/**
 * binds to the WordPress jQuery function to put the permalink on the page.
 * If the response matches with permalinkstring, the snippet can be rerendered.
 */
jQuery( document ).on( 'ajaxComplete', function( ev, response ) {
	'use strict';

	if ( response.responseText.match( 'Permalink:' ) !== null ) {
		YoastSEO.app.callbacks.getData();
		YoastSEO.app.callbacks.getAnalyzerInput();
		YoastSEO.app.snippetPreview.reRender();
	}
} );
