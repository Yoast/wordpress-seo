/* global wpseoReplaceVarsL10n, require, YoastSEO */
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

	/**
	 * GENERIC
	 */

	/**
	 * Registers all the placeholders and their replacements.
	 */
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

		this.addReplacement( new ReplaceVar( '%%sep%%(\\s*%%sep%%)*', 'sep' ) );
	};

	/**
	 * Register all the necessary events to live replace, placeholders.
	 */
	YoastReplaceVarPlugin.prototype.registerEvents = function() {
		var currentScope = wpseoReplaceVarsL10n.scope;

		if ( currentScope === 'post' ) {
			// Set events for each taxonomy box.
			jQuery( '.categorydiv' ).each( this.bindTaxonomyEvents.bind( this ) );
		}

		if ( currentScope === 'post' || currentScope === 'page' ) {
			// Add support for custom fields as well.
			jQuery( '#postcustomstuff > #list-table' ).each( this.bindFieldEvents.bind( this ) );
		}
	};

	/**
	 * Add a replacement object to be used when replacing placeholders.
	 *
	 * @param {ReplaceVar} replacement The replacement to add to the placeholders.
	 */
	YoastReplaceVarPlugin.prototype.addReplacement = function( replacement ) {
		placeholders[ replacement.placeholder ] = replacement;
	};

	/**
	 * Removes a replacement if it exists.
	 *
	 * @param {ReplaceVar} replacement The replacement to remove.
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
	 * @param {string} data The data that needs its placeholders replaced.
	 * @returns {string} The data with all its placeholders replaced by actual values.
	 */
	YoastReplaceVarPlugin.prototype.replaceVariables = function( data ) {
		if ( ! isUndefined( data ) ) {
			data = this.termtitleReplace( data );

			// This order currently needs to be maintained until we can figure out a nicer way to replace this.
			data = this.parentReplace( data );
			data = this.replaceCustomTaxonomy( data );
			data = this.replacePlaceholders( data );
		}

		return data;
	};

	/**
	 * Retrieves the object containing the replacements for the placeholders. Defaults to wpseoReplaceVarsL10n.
	 *
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
	 * Gets the proper replacement variable.
	 *
	 * @param {ReplaceVar} replaceVar The replacevar object to use for its source, scope and replacement property.
	 * @returns {string} The replacement for the placeholder.
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
	 * Replaces placeholder variables with their replacement value.
	 *
	 * @param {string} text The text to have its placeholders replaced.
	 * @return {string} The text in which the placeholders have been replaced.
	 */
	YoastReplaceVarPlugin.prototype.replacePlaceholders = function( text ) {
		forEach( placeholders, function( replaceVar ) {
			text = text.replace(
				new RegExp( replaceVar.getPlaceholder( true ), 'g' ), this.getReplacement( replaceVar )
			);
		}.bind( this ) );

		return text;
	};

	/**
	 * Declares reloaded with YoastSEO.
	 */
	YoastReplaceVarPlugin.prototype.declareReloaded = function() {
		YoastSEO.app.pluginReloaded( 'replaceVariablePlugin' );
	};

	/**
	 * TAXONOMIES
	 */

	/**
	 * Gets the taxonomy name from categories.
	 * The logic of this function is inspired by: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
	 *
	 * @param {Object} checkbox The checkbox to parse to retrieve the label.
	 * @returns {string} The category name.
	 */
	YoastReplaceVarPlugin.prototype.getCategoryName = function( checkbox ) {
		// Take the parent of checkbox with type label and clone it.
		var clonedLabel = checkbox.parent( 'label' ).clone();

		// Finds child elements and removes them so we only get the label's text left.
		clonedLabel.children().remove();

		// Returns the trimmed text value,
		return clonedLabel.text().trim();
	};

	/**
	 * Gets the checkbox-based taxonomies that are available on the current page and based on their checked state.
	 *
	 * @param {Object} checkboxes The checkboxes to check.
	 * @param {string} taxonomyName The taxonomy name to use as a reference.
	 */
	YoastReplaceVarPlugin.prototype.parseTaxonomies = function( checkboxes, taxonomyName ) {
		if ( isUndefined( taxonomyElements[ taxonomyName ] ) ) {
			taxonomyElements[ taxonomyName ] = {};
		}

		forEach( checkboxes, function( checkbox ) {
			checkbox = jQuery( checkbox );
			var taxonomyID = checkbox.val();

			taxonomyElements[ taxonomyName ][ taxonomyID ] = {
				label: this.getCategoryName( checkbox ),
				checked: checkbox.prop( 'checked' )
			};
		}.bind( this ) );
	};

	/**
	 * Get the taxonomies that are available on the current page.
	 *
	 * @param {Object} targetMetaBox The HTML element to use as a source for the taxonomies.
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.getAvailableTaxonomies = function( targetMetaBox ) {
		var checkboxes = jQuery( targetMetaBox ).find( 'input[type=checkbox]' );
		var taxonomyName = jQuery( targetMetaBox ).attr( 'id' ).replace( 'taxonomy-', '' );

		if ( checkboxes.length > 0 ) {
			this.parseTaxonomies( checkboxes, taxonomyName );
		}

		this.declareReloaded();
	};

	/**
	 * Binding events for each taxonomy metabox element.
	 *
	 * @param {int} index The index of the element.
	 * @param {Object} taxonomyElement The element to bind the events to.
	 */
	YoastReplaceVarPlugin.prototype.bindTaxonomyEvents = function( index, taxonomyElement ) {
		taxonomyElement = jQuery( taxonomyElement );

		// Set the events.
		taxonomyElement.on( 'wpListAddEnd', '.categorychecklist', this.getAvailableTaxonomies.bind( this, taxonomyElement ) );
		taxonomyElement.on( 'change', 'input[type=checkbox]', this.getAvailableTaxonomies.bind( this, taxonomyElement ) );

		// Get the available taxonomies upon loading the plugin.
		this.getAvailableTaxonomies( taxonomyElement );
	};

	/**
	 * Replace the custom taxonomies.
	 *
	 * @param {string} text The text to have its custom taxonomy placeholders replaced.
	 * @return {string} The text in which the custom taxonomy placeholders have been replaced.
	 */
	YoastReplaceVarPlugin.prototype.replaceCustomTaxonomy = function( text ) {
		forEach( taxonomyElements, function( taxonomy, taxonomyName ) {
			var generatedPlaceholder = '%%ct_' + taxonomyName  + '%%';

			if ( taxonomyName === 'category' ) {
				generatedPlaceholder = '%%' + taxonomyName + '%%';
			}

			text = text.replace( generatedPlaceholder, this.getTaxonomyReplaceVar( taxonomyName ) );
		}.bind( this ) );

		return text;
	};

	/**
	 * Returns the string to replace the category taxonomy placeholders.
	 *
	 * @param {string} taxonomyName The name of the taxonomy needed for the lookup.
	 * @returns {string} The categories as a comma separated list.
	 */
	YoastReplaceVarPlugin.prototype.getTaxonomyReplaceVar = function( taxonomyName ) {
		var filtered = [];
		var toReplaceTaxonomy = taxonomyElements[ taxonomyName ];

		// If no replacement is available, return an empty string.
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
	 * CUSTOM FIELDS
	 */

	/**
	 * Get the custom fields that are available on the current page and adds them to the placeholders.
	 *
	 * @param {Object} customFields The custom fields to parse and add.
	 */
	YoastReplaceVarPlugin.prototype.parseFields = function( customFields ) {
		jQuery( customFields ).each( function( i, customField ) {
			var customFieldName = jQuery( '#' + customField.id + '-key' ).val();
			var customValue = jQuery( '#' + customField.id + '-value' ).val();

			// Register these as new replacevars. The replacement text will be a literal string.
			this.addReplacement( new ReplaceVar( '%%cf_' + this.sanitizeCustomFieldNames( customFieldName ) + '%%',
				customValue,
				{ source: 'direct' }
			) );
		}.bind( this ) );
	};

	/**
	 * Removes the custom fields from the placeholders.
	 *
	 * @param {Object} customFields The fields to parse and remove.
	 */
	YoastReplaceVarPlugin.prototype.removeFields = function( customFields ) {
		jQuery( customFields ).each( function( i, customField ) {
			var customFieldName = jQuery( '#' + customField.id + '-key' ).val();

			// Register these as new replacevars
			this.removeReplacement( '%%cf_' + this.sanitizeCustomFieldNames( customFieldName ) + '%%' );
		}.bind( this ) );
	};

	/**
	 * Sanitizes the custom field's name by replacing spaces with underscores for easier matching.
	 *
	 * @param {string} customFieldName The field name to sanitize.
	 * @returns {string} The sanitized field name.
	 */
	YoastReplaceVarPlugin.prototype.sanitizeCustomFieldNames = function( customFieldName ) {
		return customFieldName.replace( ' ', '_' );
	};

	/**
	 * Get the custom fields that are available on the current page.
	 *
	 * @param {object} targetMetaBox The HTML element to use as a source for the taxonomies.
	 * @returns {void}
	 */
	YoastReplaceVarPlugin.prototype.getAvailableFields = function( targetMetaBox ) {
		// Remove all the custom fields prior. This ensures that deleted fields don't show up anymore.
		this.removeCustomFields();

		var textFields = jQuery( targetMetaBox ).find( '#the-list > tr:visible' );

		if ( textFields.length > 0 ) {
			this.parseFields( textFields );
		}

		this.declareReloaded();
	};

	/**
	 * Binding events for each custom field element.
	 *
	 * @param {int} index The index of the element.
	 * @param {Object} customFieldElement The element to bind the events to.
	 */
	YoastReplaceVarPlugin.prototype.bindFieldEvents = function( index, customFieldElement ) {
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
	 * SPECIALIZED REPLACES
	 */

	/**
	 * Replaces %%term_title%% with the title of the term.
	 *
	 * @param {string} data The data that needs its placeholders replaced.
	 * @returns {string} The data with all its placeholders replaced by actual values.
	 */
	YoastReplaceVarPlugin.prototype.termtitleReplace = function( data ) {
		var term_title = this._app.rawData.name;

		data = data.replace( /%%term_title%%/g, term_title);

		return data;
	};

	/**
	 * Replaces %%parent_title%% with the selected value from selectbox (if available on pages only).
	 *
	 * @param {string} data The data that needs its placeholders replaced.
	 * @returns {string} The data with all its placeholders replaced by actual values.
	 */
	YoastReplaceVarPlugin.prototype.parentReplace = function( data ) {
		var parent = jQuery( '#parent_id, #parent' ).eq( 0 );

		if ( this.hasParentTitle( parent ) ) {
			data = data.replace( /%%parent_title%%/, this.getParentTitleReplacement( parent ) );
		}

		return data;
	};

	/**
	 * Checks whether or not there's a parent title available.
	 *
	 * @returns {boolean} Whether or not there is a parent title present.
	 */
	YoastReplaceVarPlugin.prototype.hasParentTitle = function( parent ) {
		return ( ! isUndefined( parent ) && ! isUndefined( parent.prop( 'options' ) ) );
	};

	/**
	 * Gets the replacement for the parent title.
	 *
	 * @param {Object} parent The parent object to use to look for the selected option.
	 * @returns {string} The string to replace the placeholder with.
	 */
	YoastReplaceVarPlugin.prototype.getParentTitleReplacement = function( parent ) {
		var parentText = parent.find( 'option:selected' ).text();

		if ( parentText === wpseoReplaceVarsL10n.no_parent_text ) {
			return '';
		}

		return parentText;
	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());
