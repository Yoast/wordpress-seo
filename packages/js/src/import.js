import jQuery from "jquery";

import IndexingService from "./services/IndexingService";

const AioseoV4 = 'WPSEO_Import_AIOSEO_V4';

let importButton, importForm, spinner, checkMark, errorMark;

/**
 * Watches the Import form.
 *
 * @returns {void}
 */
function watchImportForm() {
	if ( importForm ) {
		importForm.on( "submit", handleImportFormSubmission );
	}
}

/**
 * Adds Progress UI elements in the page.
 *
 * @returns {void}
 */
function addProgressElements() {
	jQuery( spinner ).insertAfter( importButton );
	jQuery( checkMark ).insertAfter( spinner );
	jQuery( errorMark ).insertAfter( spinner );
}

/**
 * Function called when importing progress is made.
 *
 * @param {number} count The amount of items processed.
 *
 * @returns {void}
 */
function importingProgress( count ) {
	console.log( "Now processed", count, "items" );
	spinner.show();

	importButton.prop('disabled', true);
}

/**
 * Function called when importing is completed succesfully.
 *
 * @returns {void}
 */
function importingSuccess() {
	console.log( "Done!" )
	spinner.hide();
	checkMark.show();

	importButton.prop('disabled', false);
}

/**
 * Function called when importing is completed succesfully.
 *
 * @param {string} e The failure string.
 *
 * @returns {void}
 */
function importingFailure( e ) {
	console.log( "Failed: " + e )
	spinner.hide();
	errorMark.show();

	importButton.prop('disabled', false);
}

/**
 * Handles the import form submission and calls the new import endpoints if necessary.
 *
 * @param {JQuery.Event} event The submission event.
 *
 * @returns {void}
 */
function handleImportFormSubmission( event ) {
	let dropdown = jQuery( "[name='import_external_plugin']" );

	if ( dropdown.val() === AioseoV4 ) {
		event.preventDefault();

		const indexingService = new IndexingService( window.yoastImportData );

		indexingService.index( window.yoastImportData.restApi.importing_endpoints.aioseo, importingProgress )
			.then( () => importingSuccess() )
			.catch( e => importingFailure( e ) );

		return;
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
	spinner = jQuery( '<img>' )
					.attr( 'src', window.yoastImportData.assets.spinner )
					.css( {
						"display": "inline-block",
						"margin-left": "10px",
						"vertical-align": "middle"
					} )
					.hide();
	checkMark = jQuery( '<span>' )
						.addClass( 'dashicons dashicons-yes-alt' )
						.css( {
							"margin-left": "10px",
							"vertical-align": "middle",
							"color": "green"
						} )
						.hide();
	errorMark = jQuery( '<span>' )
						.addClass( 'dashicons dashicons-no' )
						.css( {
							"margin-left": "10px",
							"vertical-align": "middle",
							"color": "red"
						} )
						.hide();
}

jQuery( function() {
	initElements();
	watchImportForm();
	addProgressElements();
} );
