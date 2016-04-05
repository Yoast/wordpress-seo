/* global wpseoReplaceVarsL10n */
(function() {
	'use strict';

	/**
	 * variable replacement plugin for wordpress.
	 */
	var YoastReplaceVarPlugin = function( app ) {
		this._app = app;

		this.replaceVars = wpseoReplaceVarsL10n.replace_vars;

		this._app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerModifications();
	};

	/**
	 * Registers the modifications for the plugin.
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function() {
		var callback = this.replaceVariablesPlugin.bind( this );

		this._app.registerModification( 'content', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'title', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'snippet_title', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'snippet_meta', callback, 'replaceVariablePlugin', 10 );

		//modifications applied on the getData from the scrapers to use templates
		this._app.registerModification( 'data_page_title', callback, 'replaceVariablePlugin', 10);
		this._app.registerModification( 'data_meta_desc', callback, 'replaceVariablePlugin', 10);
	};

	/**
	 * runs the different replacements on the data-string
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceVariablesPlugin = function( data ) {
		if( typeof data !== 'undefined' ) {
			data = this.titleReplace( data );
			data = this.termtitleReplace( data );
			data = this.defaultReplace( data );
			data = this.parentReplace( data );
			data = this.replaceSeparators( data );
			data = this.excerptReplace( data );
		}
		return data;
	};

	/**
	 * Replaces %%title%% with the title
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.titleReplace = function( data ) {
		var title = this._app.rawData.title;

		data = data.replace( /%%title%%/g, title );

		return data;
	};

	/**
	 * Replaces %%term_title%% with the title of the term
	 * @param {String} data the data to replace the term_title var
	 * @returns {String} the data with the replaced variables
	 */
	YoastReplaceVarPlugin.prototype.termtitleReplace = function( data ) {
		var term_title = this._app.rawData.name;

		data = data.replace( /%%term_title%%/g, term_title);

		return data;
	};

	/**
	 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.parentReplace = function( data ) {
		var parentId = document.getElementById( 'parent_id' );

		if ( parentId !== null && typeof parentId.options !== 'undefined' && parentId.options[ parentId.selectedIndex ].text !== wpseoReplaceVarsL10n.no_parent_text ) {
			data = data.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
		}
		return data;
	};

	/**
	 * Replaces separators in the string.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceSeparators = function( data ) {
		return data.replace( /%%sep%%(\s+%%sep%%)*/g, this.replaceVars.sep );
	};

	/**
	 * replaces the excerpts strings with strings for the excerpts, if not empty.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.excerptReplace = function( data ) {
		if ( typeof this._app.rawData.excerpt !== 'undefined' ) {
			data = data.replace( /%%excerpt_only%%/g, this._app.rawData.excerpt );
			data = data.replace( /%%excerpt%%/g, this._app.rawData.excerpt );
		}
		return data;
	};

	/**
	 * replaces default variables with the values stored in the wpseoMetaboxL10n object.
	 *
	 * @param {String} textString
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.defaultReplace = function( textString ) {
		var focusKeyword = this._app.rawData.keyword;

		return textString.replace( /%%sitedesc%%/g, this.replaceVars.sitedesc )
			.replace( /%%sitename%%/g, this.replaceVars.sitename )
			.replace( /%%term_title%%/g, this.replaceVars.term_title )
			.replace( /%%term_description%%/g, this.replaceVars.term_description )
			.replace( /%%category_description%%/g, this.replaceVars.category_description )
			.replace( /%%tag_description%%/g, this.replaceVars.tag_description )
			.replace( /%%searchphrase%%/g, this.replaceVars.searchphrase )
			.replace( /%%date%%/g, this.replaceVars.date )
			.replace( /%%id%%/g, this.replaceVars.id )
			.replace( /%%page%%/g, this.replaceVars.page )
			.replace( /%%currenttime%%/g, this.replaceVars.currenttime )
			.replace( /%%currentdate%%/g, this.replaceVars.currentdate )
			.replace( /%%currentday%%/g, this.replaceVars.currentday )
			.replace( /%%currentmonth%%/g, this.replaceVars.currentmonth )
			.replace( /%%currentyear%%/g, this.replaceVars.currentyear )
			.replace( /%%focuskw%%/g, focusKeyword );
	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());
