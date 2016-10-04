/* global YoastCustomFieldsPluginL10 */
/* global YoastSEO */
/* global _ */
( function() {
	/**
	 * The Yoast Custom Fields Plugin adds the custom fields to the content that were defined in the titles and meta's
	 * section of the Yoast SEO settings when those fields are available.
	 *
	 * @constructor
	 * @property {Array} customFieldNames
	 * @property {Object} customFields
	 */
	var YoastCustomFieldsPlugin = function() {
		YoastSEO.app.registerPlugin( "YoastCustomFieldsPlugin", { status: "loading" } );

		this.customFields = {};

		this.updateCustomFields();
		this.declareReady();
	};

	/**
	 * Declares ready with YoastSEO.
	 *
	 * @returns {void}
	 */
	YoastCustomFieldsPlugin.prototype.declareReady = function() {
		YoastSEO.app.pluginReady( "YoastCustomFieldsPlugin" );
		YoastSEO.app.registerModification( "content", this.addCustomFields.bind( this ), "YoastCustomFieldsPlugin" );
	};

	/**
	 * Declares reloaded with YoastSEO.
	 *
	 * @returns {void}
	 */
	YoastCustomFieldsPlugin.prototype.declareReloaded = function() {
		YoastSEO.app.pluginReloaded( "YoastCustomFieldsPlugin" );
	};

	/**
	 * The callback used to add the custom fields to the content to be analyzed by YoastSEO.js.
	 *
	 * @param {String} content The content for adding the custom fields to.
	 * @returns {String} The content.
	 */
	YoastCustomFieldsPlugin.prototype.addCustomFields = function( content ) {
		for( var fieldName in this.customFields ) {
			content += " ";
			content += this.customFields[ fieldName ];
		}
		return content;
	};

	/**
	 * Fetches the relevant custom fields from the form and saves them in a property.
	 * Then declares reloaded and rebinds the custom fields form.
	 *
	 * @returns {void}
	 */
	YoastCustomFieldsPlugin.prototype.updateCustomFields = function() {
		var customFields = {};
		jQuery( "#the-list > tr:visible" ).each(
			function( i, el ) {
				var customFieldName = jQuery( "#" + el.id + "-key" ).val();
				if ( YoastCustomFieldsPluginL10.custom_field_names.indexOf( customFieldName ) !== -1 ) {
					customFields[ customFieldName ] = jQuery( "#" + el.id + "-value" ).val();
				}
			}
		);
		this.customFields = customFields;
		this.declareReloaded();
		this.bindCustomFields();
	};

	/**
	 * Adds the necessary event bindings for monitoring which custom fields are added/removed/updated.
	 *
	 * @returns {void}
	 */
	YoastCustomFieldsPlugin.prototype.bindCustomFields = function() {
		var callback = _.debounce( this.updateCustomFields.bind( this ), 500, true );

		jQuery( "#the-list .button + .update_meta" ).off( "click.wpseoCustomFields" ).on( "click.wpseoCustomFields", callback );
		jQuery( "#the-list" ).off( "wpListDelEnd.wpseoCustomFields" ).on( "wpListDelEnd.wpseoCustomFields", callback );
		jQuery( "#the-list" ).off( "wpListAddEnd.wpseoCustomFields" ).on( "wpListAddEnd.wpseoCustomFields", callback );
		jQuery( "#the-list textarea" ).off( "input.wpseoCustomFields" ).on( "input.wpseoCustomFields", callback );
	};

	if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
		new YoastCustomFieldsPlugin();
	} else {
		jQuery( window ).on(
			"YoastSEO:ready",
			function() {
				new YoastCustomFieldsPlugin();
			}
		);
	}
}() );
