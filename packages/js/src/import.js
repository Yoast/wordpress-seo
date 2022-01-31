import jQuery from "jquery";

import IndexingService from "./services/IndexingService";

const AioseoV4 = "WPSEO_Import_AIOSEO_V4";

let dropdown, importButton, importForm, spinner, loadingMessage, checkMark;

/**
 * Adds Progress UI elements in the page.
 *
 * @returns {void}
 */
function addProgressElements() {
	jQuery( spinner ).insertAfter( importButton );
	jQuery( checkMark ).insertAfter( spinner );
	jQuery( loadingMessage ).insertAfter( spinner );
}

/**
 * Function called when importing progress is made.
 *
 * @param {number} count The amount of items processed.
 *
 * @returns {void}
 */
function importingProgress( count ) { // eslint-disable-line no-unused-vars
	spinner.show();
	loadingMessage.show();
	jQuery( ".yoast-import-failure" ).remove();

	importButton.prop( "disabled", true );
}

/**
 * Function called when importing is completed succesfully.
 *
 * @returns {void}
 */
function importingSuccess() {
	spinner.hide();
	loadingMessage.hide();
	checkMark.show();
	jQuery( ".yoast-import-failure" ).remove();

	importButton.prop( "disabled", false );

	// Remove the plugin that we just finished import for, from the import dropdown.
	jQuery( "option:selected", dropdown ).remove();
	jQuery( "option[value='']", dropdown ).prop( "selected", true );
	dropdown.trigger( "change" );

	// Dropdown will always have at least one option aka the placeholder, so let's check if it has any more options before displaying the no_data_msg.
	if ( dropdown.children( "option" ).length < 2 ) {
		dropdown.prop( "disabled", true );
		importForm.after( jQuery( "<p></p>" ).text( window.yoastImportData.assets.no_data_msg ) );
	}
}

/**
 * Function called when importing is completed succesfully.
 *
 * @param {string} e The failure string.
 *
 * @returns {void}
 */
function importingFailure( e ) {
	spinner.hide();
	loadingMessage.hide();

	importButton.prop( "disabled", false );

	// Add a failure alert too.
	var failureAlert = jQuery( "<div>" )
		.addClass( "yoast-measure yoast-import-failure" )
		.html( window.yoastImportData.assets.import_failure.replace( /%s/g, "<strong>" + e + "</strong>" ) );

	importForm.after( failureAlert );
}

/**
 * Handles the import form submission and calls the new import endpoints if necessary.
 *
 * @param {JQuery.Event} event The submission event.
 *
 * @returns {void}
 */
function handleImportFormSubmission( event ) {
	if ( dropdown.val() === AioseoV4 ) {
		// Do not actually submit the form.
		event.preventDefault();

		const indexingService = new IndexingService( window.yoastImportData );

		indexingService.index( window.yoastImportData.restApi.importing_endpoints.aioseo, importingProgress )
			.then( importingSuccess )
			.catch( importingFailure );
	}
}

/**
 * Initialize elements.
 *
 * @returns {void}
 */
function initElements() {
	importButton = jQuery( "[name='import_external']" );
	importForm = jQuery( importButton ).parents( "form:first" );
	dropdown = jQuery( "[name='import_external_plugin']" );
	spinner = jQuery( "<img>" )
		.attr( "src", window.yoastImportData.assets.spinner )
		.css( {
			display: "inline-block",
			"margin-left": "10px",
			"vertical-align": "middle",
		} )
		.hide();
	loadingMessage = jQuery( "<span>" )
		.html( window.yoastImportData.assets.loading_msg )
		.css( {
			"margin-left": "5px",
			"vertical-align": "middle",
		} )
		.hide();
	checkMark = jQuery( "<span>" )
		.addClass( "dashicons dashicons-yes-alt" )
		.css( {
			"margin-left": "10px",
			"vertical-align": "middle",
			color: "green",
		} )
		.hide();
}

/**
 * Watches the import select.
 *
 * @returns {void}
 */
function watchImportSelect() {
	dropdown.on( "change", function() {
		if ( jQuery( this ).find( "option:selected" ).attr( "value" ) === "" ) {
			importButton.prop( "disabled", true );

			return;
		}
		importButton.prop( "disabled", false );
	} );
}

/**
 * Prepares the import select.
 *
 * @returns {void}
 */
function prepareImportSelect() {
	if ( dropdown ) {
		watchImportSelect();

		dropdown.append(
			"<option value='' disabled='disabled' selected hidden>&mdash; " + window.yoastImportData.assets.select_placeholder + " &mdash;</option>"
		).trigger( "change" );
	}
}

/**
 * Watches the `Import` form.
 *
 * @returns {void}
 */
function watchImportForm() {
	if ( importForm ) {
		importForm.on( "submit", handleImportFormSubmission );
	}
}

jQuery( function() {
	initElements();
	prepareImportSelect();
	watchImportForm();
	addProgressElements();
} );
