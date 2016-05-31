/* global wpseoReplaceVarsL10n, require */
(function() {
	'use strict';

	var forEach = require( 'lodash/forEach' );
	var filter = require( 'lodash/filter' );
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
	var taxonomyElements = {};

	/**
	 * Variable replacement plugin for WordPress.
	 */
	var YoastReplaceVarPlugin = function( app ) {
		this._app = app;
		this._app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerReplacements();
		this.registerModifications();
		this.registerEvents();
	};

	YoastReplaceVarPlugin.prototype.registerReplacements = function() {
		this.addReplacement( new ReplaceVar( '%%currentdate%%',     'currentdate' ) );
		this.addReplacement( new ReplaceVar( '%%currentday%%',      'currentday' ) );
		this.addReplacement( new ReplaceVar( '%%currentmonth%%',    'currentmonth' ) );
		this.addReplacement( new ReplaceVar( '%%currenttime%%',     'currenttime' ) );
		this.addReplacement( new ReplaceVar( '%%currentyear%%',     'currentyear' ) );
		this.addReplacement( new ReplaceVar( '%%date%%',            'date' ) );
		this.addReplacement( new ReplaceVar( '%%id%%',              'id' ) );
		this.addReplacement( new ReplaceVar( '%%page%%',            'page' ) );
		this.addReplacement( new ReplaceVar( '%%searchphrase%%',    'searchphrase' ) );
		this.addReplacement( new ReplaceVar( '%%sitedesc%%',        'sitedesc' ) );
		this.addReplacement( new ReplaceVar( '%%sitename%%',        'sitename' ) );
		this.addReplacement( new ReplaceVar( '%%category%%',        'category' ) );

		this.addReplacement( new ReplaceVar( '%%sep%%(\s+%%sep%%)*', 'sep' ) );

		this.addReplacement( new ReplaceVar( '%%focuskw%%', 'keyword', {
			source: 'app',
			aliases: [ '%%keyword%%' ]
		} ) );

		this.addReplacement( new ReplaceVar( '%%term_description%%', 'text', {
			source: 'app',
			scope: [ 'term', 'category', 'tag' ],
			aliases: [ '%%tag_description%%', '%%category_description%%' ]
		} ) );

		this.addReplacement( new ReplaceVar( '%%term_title%%', 'term_title', {
			scope: [ 'post', 'term' ]
		} ) );

		this.addReplacement( new ReplaceVar( '%%title%%', 'title', {
			source: 'app',
			scope: [ 'post', 'term', 'page' ]
		} ) );

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

	YoastReplaceVarPlugin.prototype.registerEvents = function() {
		var currentPage = wpseoReplaceVarsL10n.scope;

		if ( currentPage === 'post' ) {
			// Register category and tag events
			// Set events for each taxonomy box.
			jQuery( '.categorydiv' ).each( this.bindTaxonomyEvents.bind( this ) );
//			jQuery( '.tagsdiv' ).each( this.bindTaxonomyEvents.bind( this ) );
		}

		if ( currentPage === 'post' || currentPage === 'page' )  {
			jQuery( '#postcustomstuff > #list-table' ).each( this.bindFieldEvents.bind( this ) );
		}
	};

	/**
	 * Gets the taxonomy name.
	 * The logic of this function is inspired by: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
	 *
	 * @param {Object} checkbox
	 * @returns String
	 */
	YoastReplaceVarPlugin.prototype.getCategoryName = function ( checkbox ) {

		// Take parent of checkbox with type label.
		var label = jQuery( checkbox ).parent( 'label' );

		// We don't want to touch the element itself, thus we will clone it.
		var cloned_label = label.clone();

		// Finds the span element.
		var span = cloned_label.find( 'span' );

		// Remove the span, because it could contain some text.
		span.remove();

		// Get the text value,
		var text_only = cloned_label.text();

		// Return the trimmed value.
		return text_only.trim();
	};

	/**
	 * Get the taxonomies that are available on the current page.
	 *
	 * @param checkboxes
	 * @param taxonomyName
	 */
	YoastReplaceVarPlugin.prototype.parseTaxonomies = function ( checkboxes, taxonomyName ) {
		if ( isUndefined( taxonomyElements[ taxonomyName ] ) ) {
			taxonomyElements[ taxonomyName ] = {};
		}

		forEach( checkboxes, function( checkbox ) {
			var taxonomyID = jQuery( checkbox ).val();

			taxonomyElements[ taxonomyName ][ taxonomyID ] = {
				label: this.getCategoryName( checkbox ),
				checked: checkbox.checked
			};
		}.bind( this ) );
	};

	/**
	 * Get the custom fields that are available on the current page.
	 *
	 * @param textFields
	 */
	YoastReplaceVarPlugin.prototype.parseFields = function ( textFields ) {
		jQuery( textFields ).each(
			function( i, el ) {
				var customFieldName = jQuery( '#' + el.id + '-key' ).val();
				var customValue = jQuery( '#' + el.id + '-value' ).val();

				// Register these as new replacevars
				this.addReplacement( new ReplaceVar( '%%cf_' + customFieldName.replace( ' ', '_' ) + '%%', customValue, { source: 'direct' } ) );
			}.bind( this )
		);
	};

	/**
	 * Removes the custom fields.
	 *
	 * @param textFields
	 */
	YoastReplaceVarPlugin.prototype.removeFields = function ( textFields ) {
		jQuery( textFields ).each(
			function( i, el ) {
				var customFieldName = jQuery( '#' + el.id + '-key' ).val();

				// Register these as new replacevars
				this.removeReplacement( '%%cf_' + customFieldName.replace( ' ', '_' ) + '%%' );
			}.bind( this )
		);
	};

	/**
	 * Get the taxonomies that are available on the current page.
	 * TODO: Add more than just categories
	 * @param {object} targetMetaBox
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.getAvailableTaxonomies = function ( targetMetaBox ) {
		var checkboxes = jQuery( targetMetaBox ).find( 'input[type=checkbox]' );
		var taxonomyName = jQuery( targetMetaBox ).attr( 'id' ).replace( 'taxonomy-', '' );

		if ( checkboxes.length > 0 ) {
			this.parseTaxonomies( checkboxes, taxonomyName );
		}

		this.declareReloaded();
	};

	/**
	 * Get the custom fields that are available on the current page.
	 *
	 * @param {object} targetMetaBox
	 *
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.getAvailableFields = function ( targetMetaBox ) {

		// Remove all the custom fields prior. This ensure that deleted fields don't show up.
		this.removeCustomFields();

		var textFields = jQuery( targetMetaBox ).find( '#the-list > tr:visible' );

		if ( textFields.length > 0 ) {
			this.parseFields( textFields );
		}

		this.declareReloaded();
	};

	/**
	 * Binding events for each taxonomy metabox element.
	 *
	 * @param {int} index
	 * @param {Object} taxonomyElement
	 */
	YoastReplaceVarPlugin.prototype.bindTaxonomyEvents = function ( index, taxonomyElement ) {
		taxonomyElement = jQuery( taxonomyElement );

		// Set the events.
		taxonomyElement.on( 'wpListAddEnd', '.categorychecklist', this.getAvailableTaxonomies.bind( this, taxonomyElement ) );
		taxonomyElement.on( 'change', 'input[type=checkbox]', this.getAvailableTaxonomies.bind( this, taxonomyElement ) );

		// Get the available taxonomies upon loading the plugin.
		this.getAvailableTaxonomies( taxonomyElement );
	};

	/**
	 * Binding events for each taxonomy metabox element.
	 *
	 * @param {int} index
	 * @param {Object} customFieldElement
	 */
	YoastReplaceVarPlugin.prototype.bindFieldEvents = function ( index, customFieldElement ) {
		customFieldElement = jQuery( customFieldElement );
		var customFieldElementList = customFieldElement.find( '#the-list' );

		customFieldElementList.on( 'wpListDelEnd.wpseoCustomFields', this.getAvailableFields.bind( this, customFieldElement ) );
		customFieldElementList.on( 'wpListAddEnd.wpseoCustomFields', this.getAvailableFields.bind( this, customFieldElement ) );
		customFieldElementList.on( 'input.wpseoCustomFields', '.textarea', this.getAvailableFields.bind( this, customFieldElement ) );
		customFieldElementList.on( 'click.wpseoCustomFields', '.button + .updatemeta', this.getAvailableFields.bind( this, customFieldElement ) );

		// Get the available fields upon loading the plugin.
		this.getAvailableFields( customFieldElement );
	};

	/**
	 * Looks for custom fields in the list of placeholders and deletes them.
	 */
	YoastReplaceVarPlugin.prototype.removeCustomFields = function() {
		var customFields = filter( placeholders, function( item, key ) {
			return key.indexOf( '%%cf_' ) > -1;
		} );

		forEach( customFields, function( item ) {
			this.removeReplacement( item );
		}.bind( this ) );
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
	 * Removes a replacement if it exists.
	 *
	 * @param replacement
	 */
	YoastReplaceVarPlugin.prototype.removeReplacement = function( replacement ) {
		delete placeholders[ replacement.getPlaceholder() ];
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
	 * TODO: this can be done in `replaceDefaultPlaceholders` once termtitle and parentreplace are moved / fixed.
	 *
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {
		if ( isUndefined( data ) === false ) {
			data = this.termtitleReplace( data );

			// This order currently needs to be maintained until I can figure out a nicer way to replace this.
			data = this.parentReplace( data );
			data = this.replaceCustomTaxonomy( data );
			data = this.replaceDefaultPlaceholders( data );
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

		if ( placeholderOptions.source === 'direct' ) {
			return 'direct';
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

		if ( replacementSource === 'direct' ) {
			return replaceVar.replacement;
		}

		return replacementSource[ replaceVar.replacement ] || '';
	};

	/**
	 * Replaces default variables with the values stored in the wpseoMetaboxL10n object.
	 *
	 * @param {String} textString
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceDefaultPlaceholders = function( textString ) {

		forEach( placeholders, function( replaceVar ) {
			textString = textString.replace(
				 new RegExp( replaceVar.getPlaceholder( true ), 'g' ), this.getReplacement( replaceVar )
			);
		}.bind( this ) );

		return textString;
	};

	/**
	 * Replace the custom taxonomies.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceCustomTaxonomy = function( data ) {
		forEach( taxonomyElements, function( taxonomy, taxonomyName ) {
			if ( taxonomyName !== 'category' ) {
				data = data.replace( '%%ct_' + taxonomyName  + '%%', this.getTaxonomyReplaceVar( taxonomyName ) );
			} else {
				data = data.replace( '%%' + taxonomyName  + '%%', this.getTaxonomyReplaceVar( taxonomyName ) );
			}
		}.bind( this ) );

		return data;
	};

	/**
	 * Returns the string to replace the taxonomy var. This is a comma separated list.
	 *
	 * @param {String} taxonomy
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.getTaxonomyReplaceVar = function( taxonomy ) {
		var toReplaceTaxonomy = taxonomyElements[ taxonomy ];
		var filtered = [];

		if ( isUndefined( toReplaceTaxonomy ) === true ) {
			return '';
		}

		forEach( toReplaceTaxonomy, function( item ) {
			if ( item.checked === false ) {
				return;
			}

			filtered.push( item.label );
		} );

		return jQuery.unique( filtered ).join( ', ' );
	};

	/**
	 * Declares reloaded with YoastSEO.
	 */
	YoastReplaceVarPlugin.prototype.declareReloaded = function() {
		YoastSEO.app.pluginReloaded( 'replaceVariablePlugin' );
	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());
