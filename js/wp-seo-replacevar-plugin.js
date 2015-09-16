/* global wpseoReplaceVarsL10n, ReplaceVarPlugin:true, YoastSEO, YoastReplaceVarPlugin, console */

/**
 * variable replacement plugin for wordpress.
 */
ReplaceVarPlugin = function() {
	'use strict';

	window.YoastReplaceVarPlugin = this;
	this.replaceVars = wpseoReplaceVarsL10n.replace_vars;
	this.registerTime = 0;
	this.init();
};

/**
 * inits the ReplaceVarPlugin.
 */
ReplaceVarPlugin.prototype.init = function() {
	'use strict';

	if ( typeof YoastSEO !== 'undefined' && typeof YoastSEO.app !== 'undefined' && typeof YoastSEO.app.registerPlugin !== 'undefined' ) {
		YoastSEO.app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );
		this.registerModifications();
	} else if ( this.registerTime < 1001 ) {
		setTimeout( this.init, 100 );
	} else {
		console.error('Failed to register replace variables plugin with YoastSEO. YoastSEO is not available.');
	}
};

/**
 * Registers the modifications for the plugin.
 */
ReplaceVarPlugin.prototype.registerModifications = function() {
	'use strict';

	YoastSEO.app.registerModification( 'content', this.replaceVariablesPlugin, 'replaceVariablePlugin', 10 );
	YoastSEO.app.registerModification( 'title', this.replaceVariablesPlugin, 'replaceVariablePlugin', 10 );
};

/**
 * runs the different replacements on the data-string
 * @param {String} data
 * @returns {string}
 */
ReplaceVarPlugin.prototype.replaceVariablesPlugin = function( data ) {
	'use strict';
	var refObj = YoastReplaceVarPlugin;
	if( typeof data !== 'undefined'  && data !== '') {
		data = refObj.titleReplace( data );
		data = refObj.defaultReplace( data );
		data = refObj.parentReplace( data );
		data = refObj.doubleSepReplace( data );
		data = refObj.excerptReplace( data );
	}
	return data;
};

/**
 * Replaces %%title%% with the title
 * @param {String} data
 * @returns {string}
 */
ReplaceVarPlugin.prototype.titleReplace = function( data ) {
	'use strict';
	var title = YoastSEO.app.rawData.title;
	if ( typeof title === 'undefined' ) {
		title = YoastSEO.app.rawData.pageTitle;
	}
	if ( title.length > 0 ) {
		data = data.replace( /%%title%%/g, title );
	}
	return data;
};

/**
 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
 *
 * @param {String} data
 * @returns {String}
 */
ReplaceVarPlugin.prototype.parentReplace = function( data ) {
	'use strict';
	var parentId = document.getElementById( 'parent_id' );

	if ( parentId !== null && parentId.options[ parentId.selectedIndex ].text !== wpseoReplaceVarsL10n.no_parent_text ) {
		data = data.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
	}
	return data;
};

/**
 * removes double seperators and replaces them with a single seperator
 *
 * @param {String} data
 * @returns {String}
 */
ReplaceVarPlugin.prototype.doubleSepReplace = function( data ) {
	'use strict';
	var escaped_seperator = YoastSEO.app.stringHelper.addEscapeChars( this.replaceVars.sep );
	var pattern = new RegExp( escaped_seperator + ' ' + escaped_seperator, 'g' );
	data = data.replace( pattern, this.replaceVars.sep );
	return data;
};

/**
 * replaces the excerpts strings with strings for the excerpts, if not empty.
 *
 * @param {String} data
 * @returns {String}
 */
ReplaceVarPlugin.prototype.excerptReplace = function( data ) {
	'use strict';
	if ( YoastSEO.app.rawData.excerpt.length > 0 ) {
		data.replace( /%%excerpt_only%%/, YoastSEO.app.rawData.excerpt );
		data.replace( /%%excerpt%%/, YoastSEO.app.rawData.excerpt );
	}
	return data;
};

/**
 * replaces default variables with the values stored in the wpseoMetaboxL10n object.
 *
 * @param {String} textString
 * @return {String}
 */
ReplaceVarPlugin.prototype.defaultReplace = function( textString ) {
	'use strict';
	return textString.replace( /%%sitedesc%%/g, this.replaceVars.sitedesc )
		.replace( /%%sitename%%/g, this.replaceVars.sitename )
		.replace( /%%sep%%/g, this.replaceVars.sep )
		.replace( /%%date%%/g, this.replaceVars.date )
		.replace( /%%id%%/g, this.replaceVars.id )
		.replace( /%%page%%/g, this.replaceVars.page )
		.replace( /%%currenttime%%/g, this.replaceVars.currenttime )
		.replace( /%%currentdate%%/g, this.replaceVars.currentdate )
		.replace( /%%currentday%%/g, this.replaceVars.currentday )
		.replace( /%%currentmonth%%/g, this.replaceVars.currentmonth )
		.replace( /%%currentyear%%/g, this.replaceVars.currentyear )
		.replace( /%%focuskw%%/g, YoastSEO.app.stringHelper.stripAllTags( YoastSEO.app.rawData.keyword ) );
};
