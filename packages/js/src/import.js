import jQuery from "jquery";

import IndexingService from "./services/IndexingService";

const AioseoV4 = 'WPSEO_Import_AIOSEO_V4';

let importButton, importForm;

/**
 * Watches the Import form.
 *
 * @returns {void}
 */
function watchImportForm() {
	importButton = jQuery( "[name='import_external']" );
	importForm = jQuery( importButton ).parents( "form:first" );

	if ( importForm ) {
		importForm.on( "submit", handleImportFormSubmission );
	}
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

		const indexingService = new IndexingService( window.yoastIndexingData );

		indexingService.index( window.yoastIndexingData.restApi.importing_endpoints.aioseo, importingProgress )
			.then( () => console.log( "Done!" ) )
			.catch( e => console.error( e ) );

		return;
	}
}

jQuery( function() {
	watchImportForm();
} );
