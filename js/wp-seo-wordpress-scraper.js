/* global YoastSEO: true, tinyMCE, wp */
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
		baseUrl: this.getDataFromInput( 'baseUrl' ),
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
				val = document.getElementById( 'sample-permalink' ).textContent;
			}
			break;
		case 'baseUrl':
			val = YoastSEO.app.config.sampleText.baseUrl;
			if ( document.getElementById( 'sample-permalink' ) !== null ) {
				var url = document.getElementById( 'sample-permalink' ).getElementsByTagName( 'a' )[0];
				if ( typeof url === 'undefined' ) {
					url = document.getElementById( 'sample-permalink' );
				}
				if ( typeof url !== 'undefined' ) {
					val = url.innerHTML.split( '<span' )[0];
				}
				else {
					val = '';
				}
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

	var elems = [ 'snippet_meta', 'snippet_title' ];
	if ( document.getElementById( 'editable-post-name' ) !== null ) {
		elems.push ( 'snippet_cite' );
	}
	for ( var i = 0; i < elems.length; i++ ) {
		var curElem = document.getElementById( elems [ i ] );
		curElem.addEventListener( 'keydown', snippetPreview.disableEnter );
		curElem.addEventListener( 'blur', snippetPreview.checkTextLength );
		//textFeedback is given on input (when user types or pastests), but also on focus. If a string that is too long is being recalled
		//from the saved values, it gets the correct classname right away.
		curElem.addEventListener( 'input', snippetPreview.textFeedback );
		curElem.addEventListener( 'focus', snippetPreview.textFeedback );
		//shows edit icon by hovering over element
		curElem.addEventListener( 'mouseover', snippetPreview.showEditIcon );
		//hides the edit icon onmouseout, on focus and on keyup. If user clicks or types AND moves his mouse, the edit icon could return while editting
		//by binding to these 3 events
		curElem.addEventListener( 'mouseout', snippetPreview.hideEditIcon );
		curElem.addEventListener( 'focus', snippetPreview.hideEditIcon );
		curElem.addEventListener( 'keyup', snippetPreview.hideEditIcon );

		curElem.addEventListener( 'focus', snippetPreview.getUnformattedText );
		curElem.addEventListener( 'keyup', snippetPreview.setUnformattedText );
		curElem.addEventListener( 'click', snippetPreview.setFocus );

		//adds the showIcon class to show the editIcon;
		curElem.className = curElem.className + ' showIcon' ;
	}
};

/**
 * binds the renewData function on the change of inputelements.
 */
YoastSEO.WordPressScraper.prototype.inputElementEventBinder = function() {
	'use strict';

	var elems = [ 'excerpt', 'content', 'editable-post-name', 'yoast_wpseo_focuskw', 'title' ];
	for ( var i = 0; i < elems.length; i++ ) {
		var elem = document.getElementById( elems[ i ] );
		if ( elem !== null ) {
			document.getElementById( elems[ i ] ).addEventListener( 'input', YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
		}
	}
	document.getElementById( 'yoast_wpseo_focuskw' ).addEventListener( 'blur', this.resetQueue );
};

/**
 * Resets the current queue if focus keyword is changed and not empty.
 */
YoastSEO.WordPressScraper.prototype.resetQueue = function() {
	'use strict';

	if ( YoastSEO.app.rawData.keyword !== '' ) {
		YoastSEO.app.runAnalyzer( this.rawData );
	}
};

/**
 * Updates the snippet values, is bound by the loader when generating the elements for the snippet.
 * Uses the unformattedText object of the if the textFeedback function has put a string there (if text was too long).
 * clears this after use.
 *
 * @param {Object} ev
 */
YoastSEO.WordPressScraper.prototype.updateSnippetValues = function( ev ) {
	'use strict';

	var dataFromSnippet = ev.currentTarget.textContent;
	var currentElement = ev.currentTarget.id;
	if ( typeof ev.currentTarget.refObj.snippetPreview.unformattedText[ currentElement ] !== 'undefined' ) {
		ev.currentTarget.textContent = ev.currentTarget.refObj.snippetPreview.unformattedText[ currentElement ];
	}
	ev.currentTarget.refObj.callbacks.setDataFromSnippet( dataFromSnippet, ev.currentTarget.id );
	this.refObj.rawData = ev.currentTarget.refObj.callbacks.getData();
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

	var tmpl =  wp.template('score_svg');
	document.getElementById( YoastSEO.analyzerArgs.targets.overall ).innerHTML = tmpl();
	document.getElementById( 'yoast_wpseo_linkdex' ).value = score;
};

/**
 * checks if the editable-post-name is present on page, so we can use this to disable
 * the snippet url field.
 * @returns {boolean}
 */
YoastSEO.WordPressScraper.prototype.citeAvailable = function() {
	'use strict';
	if ( document.getElementById( 'editable-post-name' ) ===  null ) {
		document.getElementById( 'snippet_cite' ).contentEditable = false;
	}
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
