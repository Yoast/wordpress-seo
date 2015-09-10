/**
 * variable replacement plugin for wordpress.
 */
replaceVarPlugin = function (){
	this.init();
};

/**
 * inits the replaceVarPlugin.
 */
replaceVarPlugin.prototype.init = function(){
	window.YoastReplaceVarPlugin = this;
	if( typeof YoastSEO.app !== "undefined" ) {
		YoastSEO.app.plugins.register( "replaceVariablePlugin", {status: "ready"} );
		YoastSEO.app.plugins.registerModification( "content", this.replaceVariablesPlugin, "replaceVariablePlugin", 10 );
	}else{
		setTimeout(this.init, 50);
	}
};

/**
 * runs the different replacements on the data-string
 * @param data
 * @returns {string}
 */
replaceVarPlugin.prototype.replaceVariablesPlugin = function( data ){
	var refObj = YoastReplaceVarPlugin;
	if( typeof data !== "undefined"  && data !== ""){
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
 * @param data
 * @returns {string}
 */
replaceVarPlugin.prototype.titleReplace = function( data ){
	'use strict';

	var title = YoastSEO.app.rawData.title;
	if ( typeof title === 'undefined' ) {
		title = YoastSEO.app.rawData.pageTitle;
	}
	if ( title.length > 0 ) {
		data = data.replace( /%%title%%/g, title );
	}
	return data;
}

/**
 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
 *
 * @param {String} textString
 * @returns {String}
 */
replaceVarPlugin.prototype.parentReplace = function( data ) {
	'use strict';

	var parentId = document.getElementById( 'parent_id' );

	if ( parentId !== null && parentId.options[ parentId.selectedIndex ].text !== wpseoMetaboxL10n.no_parent_text ) {
		data = data.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
	}
	return data;
};

/**
 * removes double seperators and replaces them with a single seperator
 *
 * @param {String} textString
 * @returns {String}
 */
replaceVarPlugin.prototype.doubleSepReplace = function( data ) {
	'use strict';

	var escaped_seperator = YoastSEO.app.stringHelper.addEscapeChars( wpseoMetaboxL10n.sep );
	var pattern = new RegExp( escaped_seperator + ' ' + escaped_seperator, 'g' );
	data = data.replace( pattern, wpseoMetaboxL10n.sep );
	return data;
};

/**
 * replaces the excerpts strings with strings for the excerpts, if not empty.
 *
 * @param {String} textString
 * @returns {String}
 */
replaceVarPlugin.prototype.excerptReplace = function( data ) {
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
replaceVarPlugin.prototype.defaultReplace = function( textString ) {
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
		.replace( /%%focuskw%%/g, YoastSEO.app.stringHelper.stripAllTags( YoastSEO.app.rawData.keyword ) );
};

