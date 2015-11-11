/* global YoastCustomFieldsPluginL10 */
/* global YoastSEO */
(function() {
	'use strict';

	/**
	 * The Yoast Custom Fields Plugin adds the custom fields to the content that were defined in the titles and meta's
	 * section of the Yoast SEO settings when those fields are available.
	 *
	 * @constructor
	 * @property {Array} customFieldNames
	 */
	var YoastCustomFieldsPlugin = function() {
		this.customFieldNames = YoastCustomFieldsPluginL10.custom_field_names;

		jQuery.on( 'YoastSEO:ready', this.register );
	};

	YoastCustomFieldsPlugin.prototype.register = function() {
		YoastSEO.app.registerPlugin( 'YoastCustomFieldsPlugin', { status: 'ready' } );
		YoastSEO.app.registerModification( 'content', this.addCustomFields.bind( this ), 'YoastCustomFieldsPlugin' );
	};

	/**
	 * Declares reloaded with YoastSEO.
	 */
	YoastCustomFieldsPlugin.prototype.declareReloaded = function() {
		YoastSEO.app.pluginReloaded( 'YoastCustomFieldsPlugin' );
	};


	YoastCustomFieldsPlugin.prototype.addCustomFields = function( content ) {
		return content;
	};

	window.YoastCustomFieldsPlugin = YoastCustomFieldsPlugin;
}());
