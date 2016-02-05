/* global wpseoReplaceVarsL10n, YoastSEO */
(function() {
	'use strict';

	/**
	 * variable replacement plugin for wordpress.
	 */
	var YoastReplaceVarPlugin = function() {
		this.replaceVars = wpseoReplaceVarsL10n.replace_vars;

		this.taxonomyRepository = {};
		this.currentTaxonomies  = {};

		YoastSEO.app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerModifications();

		// Adding events to the dom, to fetch changes.
		if ( jQuery( '#post_ID').val() !== undefined ) {
			// Set events for each taxonomy box.
			jQuery.each( jQuery( '.categorydiv' ),  this.setTaxonomyEvents.bind( this ) );

			this.addTagEvents();
		}
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
			data = this.doubleSepReplace( data );
			data = this.excerptReplace( data );
			data = this.categoryReplace( data );
			data = this.customTaxonomyReplace( data );
			data = this.tagReplace( data );

			// Taxonomy replacements
			if ( jQuery( 'input[name=tag_ID]').val() !== undefined ) {
				data = this.taxonomyDescriptionReplace( data );
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
	YoastReplaceVarPlugin.prototype.setTaxonomyEvents = function( index, taxonomyMetaBox ) {
		// Set the events.
		taxonomyMetaBox = jQuery( taxonomyMetaBox );

		taxonomyMetaBox.on( 'wpListAddEnd', '.categorychecklist', function() {
			this.fetchTaxonomies( taxonomyMetaBox );
		}.bind( this ) );
		taxonomyMetaBox.on( 'change', 'input[type=checkbox]', function() {
			this.fetchTaxonomies( taxonomyMetaBox );
		}.bind( this ) );

		// We always wanted it to be fetched
		this.fetchTaxonomies( taxonomyMetaBox );
	};

	/**
	 * Adding tag events to the dom, to fetch added/removed tags.
	 */
	YoastReplaceVarPlugin.prototype.addTagEvents = function() {
		if ( typeof MutationObserver === 'undefined' ) {
			jQuery( '#post_tag' ).on( 'DOMSubtreeModified propertychange', '.tagchecklist', function() {
				this.declareReloaded();
			}.bind( this ) );
		}
		else {
			// Select the target node
			var target = document.querySelector('.tagchecklist');

			// create an observer instance
			var observer = new MutationObserver(
				function() {
					this.declareReloaded();
				}.bind( this )
			);

			// configuration of the observer:
			var config = { attributes: false, childList: true, characterData: false };

			// pass in the target node, as well as the observer options
			observer.observe(target, config);
		}
	};

	/**
	 * Replaces %%title%% with the title
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.titleReplace = function( data ) {
		var title = YoastSEO.app.rawData.title;

		data = data.replace( /%%title%%/g, title );

		return data;
	};

	/**
	 * Replaces %%term_title%% with the title of the term
	 * @param {String} data the data to replace the term_title var
	 * @returns {String} the data with the replaced variables
	 */
	YoastReplaceVarPlugin.prototype.termtitleReplace = function( data ) {
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
	YoastReplaceVarPlugin.prototype.parentReplace = function( data ) {
		var parentId = document.getElementById( 'parent_id' );

		if ( parentId !== null && typeof parentId.options !== 'undefined' && parentId.options[ parentId.selectedIndex ].text !== wpseoReplaceVarsL10n.no_parent_text ) {
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
	YoastReplaceVarPlugin.prototype.doubleSepReplace = function( data ) {
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
	YoastReplaceVarPlugin.prototype.excerptReplace = function( data ) {
		if ( typeof YoastSEO.app.rawData.excerpt !== 'undefined' ) {
			data = data.replace( /%%excerpt_only%%/g, YoastSEO.app.rawData.excerpt );
			data = data.replace( /%%excerpt%%/g, YoastSEO.app.rawData.excerpt );
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
		textString = textString.replace( /%%focuskw%%/g, YoastSEO.app.stringHelper.stripAllTags( YoastSEO.app.rawData.keyword ) );

		jQuery.each( this.replaceVars, function( original, replacement ) {
			textString = textString.replace( '%%' + original + '%%', replacement );
		} );

		return textString;
	};

	/**
	 * replaces the category strings with the category names.
	 *
	 * @param {String} data
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.categoryReplace = function( data ) {
		if ( jQuery( '#post_ID').val() !== undefined ) {
			data = data.replace( /%%category%%/g, jQuery.unique( this.currentTaxonomies[ 'category' ] ).join( ', ' ) );
		}

		return data;
	};

	/**
	 * Replace the custom taxonomies.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.customTaxonomyReplace = function( data ) {

		jQuery.each( this.currentTaxonomies, function( taxonomy, replaceVariables ) {
			if ( taxonomy !== 'category' ) {
				data = data.replace( '%%ct_' + taxonomy  + '%%', jQuery.unique( replaceVariables ).join( ', ' ) );
			}
		});

		return data;
	};

	/**
	 * replaces the category strings with the category names.
	 *
	 * @param {String} data
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.tagReplace = function( data ) {
		if ( jQuery( '#post_ID').val() !== undefined ) {
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
	YoastReplaceVarPlugin.prototype.taxonomyDescriptionReplace = function( data ) {
		var text = YoastSEO.app.rawData.text;

		data = data.replace( /%%category_description%%/g, text );
		data = data.replace( /%%tag_description%%/g, text );
		data = data.replace( /%%term_description%%/g, text );

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
	 * @param {Object[]} activeCheckboxes
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
	 * @param {Object} checkbox
	 * @returns String
	 */
	YoastReplaceVarPlugin.prototype.getTaxonomyName = function( checkbox ) {
		return jQuery(checkbox).parent( 'label' ).clone().find('span').remove().end().text().trim();
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
