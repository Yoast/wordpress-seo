/* global wpseoReplaceVarsL10n, YoastSEO */
(function() {
	'use strict';

	/**
	 * Variable replacement plugin for wordpress.
	 */
	var YoastReplaceVarPlugin = function() {
		this.replaceVars = wpseoReplaceVarsL10n.replace_vars;

		this.taxonomyRepository = {};
		this.currentTaxonomies  = {};

		YoastSEO.app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerModifications();

		// Adding events to the dom, to fetch changes.
		if ( this.isPost() ) {
			// Set events for each taxonomy box.
			jQuery( '.categorydiv' ).each( this.bindTaxonomyEvents.bind( this ) );

			this.addTagEvents();
		}
	};

	/**
	 * Return true when current page is a taxonomy page.
	 *
	 * @returns {boolean}
	 */
	YoastReplaceVarPlugin.prototype.isPost = function() {
		return jQuery( '#post_ID').length !== 0;
	};

	/**
	 * Return true when current page is a taxonomy page.
	 *
	 * @returns {boolean}
	 */
	YoastReplaceVarPlugin.prototype.isTaxonomy = function() {
		return jQuery( 'input[name=tag_ID]').length !== 0;
	};

	/**
	 * Registers the modifications for the plugin.
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function() {
		var callback = this.replaceVariablesPlugin.bind( this );

		YoastSEO.app.registerModification( 'content', callback, 'replaceVariablePlugin', 10 );
		YoastSEO.app.registerModification( 'title', callback, 'replaceVariablePlugin', 10 );
		YoastSEO.app.registerModification( 'snippet_title', callback, 'replaceVariablePlugin', 10 );
		YoastSEO.app.registerModification( 'snippet_meta', callback, 'replaceVariablePlugin', 10 );

		//modifications applied on the getData from the scrapers to use templates
		YoastSEO.app.registerModification( 'data_page_title', callback, 'replaceVariablePlugin', 10);
		YoastSEO.app.registerModification( 'data_meta_desc', callback, 'replaceVariablePlugin', 10);
	};

	/**
	 * Runs the different replacements on the data-string
	 *
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceVariablesPlugin = function( data ) {
		if( typeof data !== 'undefined' ) {
			data = this.replaceTitle( data );
			data = this.replaceTermTitle( data );
			data = this.replaceDefault( data );
			data = this.replaceParent( data );
			data = this.replaceDoubleSeparators( data );
			data = this.replaceExcerpt( data );

			if ( this.isPost() ) {
				data = this.replaceCategory(data);
				data = this.replaceTag(data);
				data = this.replaceCustomTaxonomy(data);
			}

			if ( this.isTaxonomy() ) {
				data = this.replaceTaxonomyDescription( data );
			}
		}
		return data;
	};

	/**
	 * Binding events for each taxonomy metabox element.
	 *
	 * @param {int} index
	 * @param {Object} taxonomyMetaBox
	 */
	YoastReplaceVarPlugin.prototype.bindTaxonomyEvents = function(index, taxonomyMetaBox ) {
		taxonomyMetaBox = jQuery( taxonomyMetaBox );

		// Set the events.
		taxonomyMetaBox.on( 'wpListAddEnd', '.categorychecklist', this.fetchTaxonomies.bind( this, taxonomyMetaBox ) );
		taxonomyMetaBox.on( 'change', 'input[type=checkbox]', this.fetchTaxonomies.bind( this, taxonomyMetaBox ) );

		// We always wanted it to be fetched
		this.fetchTaxonomies( taxonomyMetaBox );
	};

	/**
	 * Adding tag events to the dom, to fetch added/removed tags.
	 *
	 * Where are using the MutationObserver (https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to
	 * determine if there is a change in the .tagchecklist. This happens when a user is adding, editing or removing an
	 * element. When MutationObserver doesn't exist (because of browser support) fallback on the property change.
	 */
	YoastReplaceVarPlugin.prototype.addTagEvents = function() {
		if ( typeof MutationObserver === 'undefined' ) {
			jQuery( '.tagsdiv' ).on( 'DOMSubtreeModified propertychange', '.tagchecklist', this.declareReloaded.bind( this ) );
		}
		else {
			// create an observer instance
			var tag_observer = new MutationObserver( this.declareReloaded.bind( this ) );

			tag_observer.observe(
				document.querySelector('.tagchecklist'),

				// The configuration.
				{
					attributes: false,
					childList: true,
					characterData: false
				}
			);
		}
	};

	/**
	 * Replaces %%title%% with the title
	 *
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceTitle = function( data ) {
		var title = YoastSEO.app.rawData.title;

		data = data.replace( /%%title%%/g, title );

		return data;
	};

	/**
	 * Replaces %%term_title%% with the title of the term
	 *
	 * @param {String} data the data to replace the term_title var
	 * @returns {String} the data with the replaced variables
	 */
	YoastReplaceVarPlugin.prototype.replaceTermTitle = function( data ) {
		var term_title = YoastSEO.app.rawData.name;

		data = data.replace( /%%term_title%%/g, term_title);

		return data;
	};

	/**
	 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceParent = function( data ) {
		var parentId = document.getElementById( 'parent_id' );

		if ( parentId !== null && typeof parentId.options !== 'undefined' && parentId.options[ parentId.selectedIndex ].text !== wpseoReplaceVarsL10n.no_parent_text ) {
			data = data.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
		}
		return data;
	};

	/**
	 * Removes double separators and replaces them with a single separator
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceDoubleSeparators = function(data ) {
		var escaped_seperator = YoastSEO.app.stringHelper.addEscapeChars( this.replaceVars.sep );
		var pattern = new RegExp( escaped_seperator + ' ' + escaped_seperator, 'g' );
		data = data.replace( pattern, this.replaceVars.sep );
		return data;
	};

	/**
	 * Replaces the excerpts strings with strings for the excerpts, if not empty.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceExcerpt = function(data ) {
		if ( typeof YoastSEO.app.rawData.excerpt !== 'undefined' ) {
			data = data.replace( /%%excerpt_only%%/g, YoastSEO.app.rawData.excerpt );
			data = data.replace( /%%excerpt%%/g, YoastSEO.app.rawData.excerpt );
		}
		return data;
	};

	/**
	 * Replaces default variables with the values stored in the wpseoMetaboxL10n object.
	 *
	 * @param {String} textString
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceDefault = function(textString ) {
		textString = textString.replace( /%%focuskw%%/g, YoastSEO.app.stringHelper.stripAllTags( YoastSEO.app.rawData.keyword ) );

		jQuery.each( this.replaceVars, function( original, replacement ) {
			textString = textString.replace( '%%' + original + '%%', replacement );
		} );

		return textString;
	};

	/**
	 * Replaces the category strings with the category names.
	 *
	 * @param {String} data
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceCategory = function( data ) {
		if ( this.isPost() ) {
			data = data.replace( /%%category%%/g, this.getTaxonomyReplaceVar( 'category' ) );
		}

		return data;
	};

	/**
	 * Replace the custom taxonomies.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceCustomTaxonomy = function(data ) {
		jQuery.each( this.currentTaxonomies, function( taxonomy ) {
			if ( taxonomy !== 'category' ) {
				data = data.replace( '%%ct_' + taxonomy  + '%%', this.getTaxonomyReplaceVar( taxonomy ) );
			}
		}.bind( this ) );

		return data;
	};

	/**
	 * Returns the string to replace the taxonomy var.
	 *
	 * @param {String} taxonomy
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.getTaxonomyReplaceVar = function( taxonomy ) {
		if ( this.currentTaxonomies[ taxonomy ] !== undefined ) {
			return jQuery.unique( this.currentTaxonomies[ taxonomy ] ).join( ', ' );
		}

		return '';
	};

	/**
	 * replaces the category strings with the category names.
	 *
	 * @param {String} data
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceTag = function(data ) {
		if ( this.isPost() ) {
			data = data.replace( /%%tag%%/g, jQuery( ' #tax-input-post_tag' ).val() );
		}

		return data;
	};

	/**
	 * Replaces the taxonomy description
	 *
	 * @param {String} data
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceTaxonomyDescription = function(data ) {
		var text = YoastSEO.app.rawData.text;

		data = data.replace( /%%category_description%%/g, text );
		data = data.replace( /%%tag_description%%/g, text );
		data = data.replace( /%%term_description%%/g, text );

		// We want to replace 'ct_desc_{custom_taxonomy_name}' with the value of `text`.
		if ( wpseoReplaceVarsL10n.taxonomy_description !== '' ) {
			data = data.replace( '%%' + wpseoReplaceVarsL10n.taxonomy_description + '%%', text );
		}

		return data;
	};

	/**
	 * Fetch the taxonomies, based on the checked checkboxes
	 *
	 * @param {object} targetMetaBox
	 *
	 * @return {void}
	 */
	YoastReplaceVarPlugin.prototype.fetchTaxonomies = function( targetMetaBox ) {
		var activeCheckboxes = jQuery( targetMetaBox ).find( 'input:checked' );
		var taxonomyName     = jQuery( targetMetaBox ).attr( 'id' ).replace( 'taxonomy-', '' );

		if ( activeCheckboxes.length > 0 ) {
			this.setUnparsedTaxonomies( activeCheckboxes, taxonomyName );
		}

		this.setCurrentTaxonomies( activeCheckboxes, taxonomyName );
		this.declareReloaded();
	};

	/**
	 * Filters the already fetch categories
	 *
	 * @param {array} activeCheckboxes
	 * @param {String}   taxonomyName
	 */
	YoastReplaceVarPlugin.prototype.setUnparsedTaxonomies = function( activeCheckboxes, taxonomyName ) {
		if ( this.taxonomyRepository[ taxonomyName ] === undefined ) {
			this.taxonomyRepository[ taxonomyName ] = [];
		}

		activeCheckboxes.each(
			function( index, checkbox ) {
				var taxonomyID = jQuery(checkbox).val();
				if ( this.taxonomyRepository[ taxonomyName ][ taxonomyID ] === undefined ) {
					this.taxonomyRepository[ taxonomyName ][ taxonomyID ] = this.getTaxonomyName( checkbox );
				}
			}.bind( this )
		);
	};

	/**
	 * Gets the taxonomy name.
	 *
	 * The logic of this function is inspired by: http://viralpatel.net/blogs/jquery-get-text-element-without-child-element/
	 *
	 * @param {Object} checkbox
	 * @returns String
	 */
	YoastReplaceVarPlugin.prototype.getTaxonomyName = function( checkbox ) {
		// Take parent of checkbox with type label.
		var label = jQuery(checkbox).parent( 'label' );

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
	 * Sets the current categories based on the selected ones.
	 *
	 * @param {Object[]} activeCheckboxes
	 * @param {String} taxonomyName
	 */
	YoastReplaceVarPlugin.prototype.setCurrentTaxonomies = function( activeCheckboxes, taxonomyName ) {
		this.currentTaxonomies[ taxonomyName ] = [];

		if ( activeCheckboxes.length > 0 ) {
			activeCheckboxes.each(
				function(index, checkbox) {
					var taxonomyToAdd = this.taxonomyRepository[ taxonomyName ][ jQuery( checkbox ).val() ];
					this.currentTaxonomies[ taxonomyName ].push( taxonomyToAdd );
				}.bind( this )
			);
		}
	};

	/**
	 * Declares reloaded with YoastSEO.
	 */
	YoastReplaceVarPlugin.prototype.declareReloaded = function() {
		YoastSEO.app.pluginReloaded( 'replaceVariablePlugin' );
	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());
