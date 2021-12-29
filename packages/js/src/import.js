import jQuery from "jquery";

import IndexingService from "./services/IndexingService";

const AioseoV4 = "WPSEO_Import_AIOSEO_V4";

let importButton, importForm, spinner, loading_msg, checkMark, errorMark;

/**
 * Adds Progress UI elements in the page.
 *
 * @returns {void}
 */
function addProgressElements() {
	jQuery( spinner ).insertAfter( importButton );
	jQuery( checkMark ).insertAfter( spinner );
	jQuery( errorMark ).insertAfter( spinner );
	jQuery( loading_msg ).insertAfter( spinner );
}

/**
 * Function called when importing progress is made.
 *
 * @param {number} count The amount of items processed.
 *
 * @returns {void}
 */
function importingProgress( count ) {
	spinner.show();
	loading_msg.show();

	importButton.prop( "disabled", true );
}

/**
 * Function called when importing is completed succesfully.
 *
 * @returns {void}
 */
function importingSuccess() {
	spinner.hide();
	loading_msg.hide();
	checkMark.show();

	importButton.prop( "disabled", false );
}

/**
 * Function called when importing is completed succesfully.
 *
 * @param {string} e The failure string.
 *
 * @returns {void}
 */
function importingFailure( e ) {
	console.log( "Failed: " + e );
	spinner.hide();
	loading_msg.hide();
	errorMark.show();

	importButton.prop( "disabled", false );
}

/**
 * Handles the import form submission and calls the new import endpoints if necessary.
 *
 * @param {JQuery.Event} event The submission event.
 *
 * @returns {void}
 */
function handleImportFormSubmission( event ) {
	const dropdown = jQuery( "[name='import_external_plugin']" );

	if ( dropdown.val() === AioseoV4 ) {
		// Do not actually submit the form.
		event.preventDefault();

		const indexingService = new IndexingService( window.yoastImportData );

		indexingService.index( window.yoastImportData.restApi.importing_endpoints.aioseo, importingProgress )
			.then( () => importingSuccess() )
			.catch( e => importingFailure( e ) );
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
	spinner = jQuery( "<img>" )
		.attr( "src", window.yoastImportData.assets.spinner )
		.css( {
			display: "inline-block",
			"margin-left": "10px",
			"vertical-align": "middle",
		} )
		.hide();
	loading_msg = jQuery( "<span>" )
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
	errorMark = jQuery( "<span>" )
		.addClass( "dashicons dashicons-no" )
		.css( {
			"margin-left": "10px",
			"vertical-align": "middle",
			color: "red",
		} )
		.hide();
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
	watchImportForm();
	addProgressElements();
} );
