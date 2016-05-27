/* global wpseoReplaceVarsL10n, console, require */
(function() {
	'use strict';

	var forEach = require( 'lodash/forEach' );
	var isUndefined = require( 'lodash/isUndefined' );
	var ReplaceVar = require( './values/replaceVar' );

	var modifiableFields = [
		'content',
		'title',
		'snippet_title',
		'snippet_meta',
		'primary_category',
		'data_page_title',
		'data_meta_desc'
	];

	var placeholders = {};

	/**
	 * Variable replacement plugin for WordPress.
	 */
	var YoastReplaceVarPlugin = function( app ) {
		this._app = app;
		this._app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerReplacements();
		this.registerModifications();
	};

	YoastReplaceVarPlugin.prototype.registerReplacements = function() {
		this.addReplacement( new ReplaceVar( '%%currentdate%%', 'currentdate' ) );
		this.addReplacement( new ReplaceVar( '%%currentday%%', 'currentday' ) );
		this.addReplacement( new ReplaceVar( '%%currentmonth%%', 'currentmonth' ) );
		this.addReplacement( new ReplaceVar( '%%currenttime%%', 'currenttime' ) );
		this.addReplacement( new ReplaceVar( '%%currentyear%%', 'currentyear' ) );
		this.addReplacement( new ReplaceVar( '%%date%%', 'date' ) );
		this.addReplacement( new ReplaceVar( '%%id%%', 'id' ) );
		this.addReplacement( new ReplaceVar( '%%page%%', 'page' ) );
		this.addReplacement( new ReplaceVar( '%%searchphrase%%', 'searchphrase' ) );
		this.addReplacement( new ReplaceVar( '%%sitedesc%%', 'sitedesc' ) );
		this.addReplacement( new ReplaceVar( '%%sitename%%', 'sitename' ) );

		this.addReplacement( new ReplaceVar( '%%sep%%(\s+%%sep%%)*', 'sep' ) );
		this.addReplacement( new ReplaceVar( '%%focuskw%%', 'keyword', { source: 'app', aliases: [ '%%keyword%%' ] } ) );

		this.addReplacement( new ReplaceVar( '%%term_description%%', 'term_description', {
			scope: [ 'term', 'category' ],
			aliases: [ '%%category_description%%', '%%tag_description%%' ]
		} ) );
		this.addReplacement( new ReplaceVar( '%%term_title%%', 'term_title', { scope: [ 'post', 'term' ] } ) );

		this.addReplacement( new ReplaceVar( '%%title%%', 'title', {
			source: 'app',
			scope: [ 'post', 'term' ]
		} ) );

		// TODO: Allow passing custom replacement logic / fixed string
		this.addReplacement( new ReplaceVar( '%%parent_title%%', 'title', {
			source: 'app',
			scope: [ 'page', 'category' ]
		} ) );

		this.addReplacement( new ReplaceVar( '%%excerpt%%', 'excerpt', {
			source: 'app',
			scope: [ 'post' ],
			aliases: [ '%%excerpt_only%%' ]
		} ) );

		this.addReplacement( new ReplaceVar( '%%primary_category%%', 'primaryCategory', {
			source: 'app', scope: [ 'post' ]
		} ) );
	};

	/**
	 * Add a replacement object to be used when replacing placeholders.
	 *
	 * @param {Object} replacement
	 */
	YoastReplaceVarPlugin.prototype.addReplacement = function( replacement ) {
		placeholders[ replacement.placeholder ] = replacement;
	};

	/**
	 * Registers the modifications for the plugin on initial load.
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function() {
		var callback = this.replaceVariables.bind( this );

		forEach( modifiableFields, function( field ) {
			this._app.registerModification( field, callback, 'replaceVariablePlugin', 10 );
		}.bind( this ) );
	};

	/**
	 * Runs the different replacements on the data-string.
	 *
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {
		if ( isUndefined( data ) === false ) {
			data = this.termtitleReplace( data );

			// This order currently needs to be maintained until I can figure out a nicer way to replace this.
			data = this.parentReplace( data );
			data = this.defaultReplace( data );
		}

		return data;
	};

	/**
	 * Replaces %%term_title%% with the title of the term
	 *
	 * TODO: This one can also be done via a term_title property. Ruhroh.
	 *
	 * @param {String} data the data to replace the term_title var
	 * @returns {String} the data with the replaced variables
	 */
	YoastReplaceVarPlugin.prototype.termtitleReplace = function( data ) {
		var term_title = this._app.rawData.name;

		data = data.replace( /%%term_title%%/g, term_title);

		return data;
	};

	/**
	 * Replaces %%parent_title%% with the selected value from selectbox (if available on pages only).
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.parentReplace = function( data ) {
		var parentId = jQuery( '#parent_id, #parent' )[0];

		if ( this.hasParentTitle() ) {
			data = data.replace( /%%parent_title%%/, this.getParentTitleReplacement( parentId ) );
		}

		return data;
	};

	/**
	 * Checks whether or not there's a parent title available.
	 *
	 * @returns {boolean}
	 */
	YoastReplaceVarPlugin.prototype.hasParentTitle = function() {
		var parentId = jQuery( '#parent_id, #parent' )[0];

		return ( isUndefined( parentId ) === false && isUndefined( parentId.options ) === false );
	};

	/**
	 * Gets the replacement for the parent title.
	 *
	 * @param parentId
	 * @returns {*}
	 */
	YoastReplaceVarPlugin.prototype.getParentTitleReplacement = function( parentId ) {
		var parentText = parentId.options[ parentId.selectedIndex ].text;

		if ( parentText === wpseoReplaceVarsL10n.no_parent_text ) {
			return '';
		}

		return parentText;
	};

	/**
	 * Retrieves the object containing the replacements for the placeholders. Defaults to wpseoReplaceVarsL10n.
	 * @param {Object} placeholderOptions Placeholder options object containing a replacement and source.
	 * @returns {Object} The replacement object to use.
	 */
	YoastReplaceVarPlugin.prototype.getReplacementSource = function( placeholderOptions ) {
		if ( placeholderOptions.source === 'app' ) {
			return this._app.rawData;
		}

		return wpseoReplaceVarsL10n.replace_vars;
	};

	/**
	 *
	 * @param replaceVar
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.getReplacement = function( replaceVar ) {
		var replacementSource = this.getReplacementSource( replaceVar.options );

		if ( replaceVar.inScope( wpseoReplaceVarsL10n.scope ) === false ) {
			return '';
		}

		return replacementSource[ replaceVar.replacement ] || '';
	};

	/**
	 * Replaces default variables with the values stored in the wpseoMetaboxL10n object.
	 *
	 * @param {String} textString
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.defaultReplace = function( textString ) {
		forEach( placeholders, function( replaceVar ) {
			textString = textString.replace(
				 new RegExp( replaceVar.getPlaceholder( true ), 'g' ), this.getReplacement( replaceVar )
			);
		}.bind( this ) );

		return textString;
	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());
